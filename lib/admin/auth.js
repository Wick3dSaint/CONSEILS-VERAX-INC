import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { db, isDbConfigured } from '../db.js';
import { readRow, writeRow } from '../settings.js';

/**
 * Admin portal security.
 * - Password: the ADMIN_PASSWORD environment variable (set in hPanel; at least 12 characters).
 * - Optional two-step verification: 6-digit codes from an authenticator app (TOTP, RFC 6238).
 * - Session: a signed, HttpOnly cookie valid 8 hours. Changing the password or the two-step
 *   setting signs every session out.
 * - Guessing protection: 5 failed attempts per address, or 30 overall, within 15 minutes lock
 *   the login for the rest of that window.
 */

export const COOKIE = 'verax_admin';
const SESSION_HOURS = 8;
const WINDOW_MIN = 15;
const MAX_PER_IP = 5;
const MAX_TOTAL = 30;
export const MIN_PASSWORD = 12;

export function passwordConfigured() {
  return (process.env.ADMIN_PASSWORD ?? '').length >= MIN_PASSWORD;
}

const digest = (key, value) => createHmac('sha256', key).update(value).digest();

export function checkPassword(input) {
  if (!passwordConfigured() || typeof input !== 'string') return false;
  // Compare fixed-length digests so the comparison takes the same time whatever is typed.
  const key = 'verax-admin-password';
  return timingSafeEqual(digest(key, input), digest(key, process.env.ADMIN_PASSWORD));
}

/* ------------------------------------------------------------------ */
/* Two-step verification (TOTP)                                         */
/* ------------------------------------------------------------------ */

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buf) {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += B32[(value << (5 - bits)) & 31];
  return out;
}

function base32Decode(str) {
  let bits = 0;
  let value = 0;
  const out = [];
  for (const ch of str.replace(/=+$/, '').toUpperCase()) {
    const idx = B32.indexOf(ch);
    if (idx < 0) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

export function newTotpSecret() {
  return base32Encode(randomBytes(20));
}

export function totpCode(secret, time = Date.now(), step = 30) {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(time / 1000 / step)));
  const h = createHmac('sha1', base32Decode(secret)).update(counter).digest();
  const offset = h[h.length - 1] & 15;
  const bin = ((h[offset] & 127) << 24) | (h[offset + 1] << 16) | (h[offset + 2] << 8) | h[offset + 3];
  return String(bin % 1_000_000).padStart(6, '0');
}

/** Accepts the current code and the ones just before/after (clock drift). */
export function checkTotp(secret, code) {
  const clean = String(code ?? '').replace(/\s/g, '');
  if (!/^\d{6}$/.test(clean) || !secret) return false;
  const now = Date.now();
  return [-1, 0, 1].some((w) => {
    const expected = totpCode(secret, now + w * 30_000);
    return timingSafeEqual(Buffer.from(expected), Buffer.from(clean));
  });
}

export function otpauthUri(secret) {
  const label = encodeURIComponent('Conseils Verax:admin');
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent('Conseils Verax')}&algorithm=SHA1&digits=6&period=30`;
}

/** { enabled, secret, pending } — stored in site_settings under "admin". */
export async function getTwoStep() {
  if (!isDbConfigured()) return { enabled: false, secret: null, pending: null };
  const row = (await readRow('admin')) ?? {};
  return { enabled: Boolean(row.totpEnabled && row.totpSecret), secret: row.totpSecret ?? null, pending: row.pendingSecret ?? null };
}

export async function setTwoStep({ enabled, secret, pending }) {
  await writeRow('admin', { totpEnabled: Boolean(enabled), totpSecret: secret ?? null, pendingSecret: pending ?? null });
}

/* ------------------------------------------------------------------ */
/* Session cookie                                                       */
/* ------------------------------------------------------------------ */

function sessionKey(totpSecret) {
  return digest('verax-admin-session', `${process.env.ADMIN_PASSWORD ?? ''}:${totpSecret ?? ''}`);
}

export function createSession(totpSecret) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_HOURS * 3_600_000 })).toString('base64url');
  const sig = createHmac('sha256', sessionKey(totpSecret)).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySession(value, totpSecret) {
  if (!passwordConfigured() || typeof value !== 'string' || !value.includes('.')) return false;
  const [payload, sig] = value.split('.');
  const expected = createHmac('sha256', sessionKey(totpSecret)).update(payload).digest('base64url');
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()).exp > Date.now();
  } catch {
    return false;
  }
}

export function cookieOptions(request, maxAgeSeconds = SESSION_HOURS * 3600) {
  const https = request?.headers?.get('x-forwarded-proto') === 'https' || request?.url?.startsWith('https:');
  return { httpOnly: true, secure: Boolean(https), sameSite: 'strict', path: '/', maxAge: maxAgeSeconds };
}

/** Is this request from a signed-in admin? (Reads the cookie and the current two-step secret.) */
export async function isAdminSession(cookieValue) {
  if (!cookieValue) return false;
  const { enabled, secret } = await getTwoStep().catch(() => ({ enabled: false, secret: null }));
  return verifySession(cookieValue, enabled ? secret : null);
}

/** For API routes: signed in, and (for changes) sent from this site's own pages. */
export async function requireAdmin(request, { mutating = false } = {}) {
  if (mutating) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    if (!origin || new URL(origin).host !== host) return false;
  }
  return isAdminSession(request.cookies.get(COOKIE)?.value);
}

/* ------------------------------------------------------------------ */
/* Guessing protection                                                  */
/* ------------------------------------------------------------------ */

const memory = [];

export async function isLockedOut(ip) {
  const since = new Date(Date.now() - WINDOW_MIN * 60_000);
  try {
    const p = await db();
    const [[mine]] = await p.query('SELECT COUNT(*) AS n FROM admin_attempts WHERE ip = ? AND at > ?', [ip, since]);
    const [[all]] = await p.query('SELECT COUNT(*) AS n FROM admin_attempts WHERE at > ?', [since]);
    return mine.n >= MAX_PER_IP || all.n >= MAX_TOTAL;
  } catch {
    const recent = memory.filter((a) => a.at > since);
    return recent.filter((a) => a.ip === ip).length >= MAX_PER_IP || recent.length >= MAX_TOTAL;
  }
}

export async function recordFailure(ip) {
  memory.push({ ip, at: new Date() });
  if (memory.length > 500) memory.splice(0, memory.length - 500);
  try {
    const p = await db();
    await p.query('INSERT INTO admin_attempts (ip, at) VALUES (?, UTC_TIMESTAMP())', [ip]);
    await p.query('DELETE FROM admin_attempts WHERE at < UTC_TIMESTAMP() - INTERVAL 1 DAY');
  } catch {
    /* in-memory record above still applies */
  }
}

export async function clearFailures(ip) {
  try {
    await (await db()).query('DELETE FROM admin_attempts WHERE ip = ?', [ip]);
  } catch {
    /* ignore */
  }
}
