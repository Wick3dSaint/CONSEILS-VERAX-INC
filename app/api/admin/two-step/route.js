import { renderSVG } from 'uqr';
import { NextResponse } from 'next/server';
import {
  COOKIE,
  checkTotp,
  cookieOptions,
  createSession,
  getTwoStep,
  newTotpSecret,
  otpauthUri,
  requireAdmin,
  setTwoStep,
} from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';
const reply = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

/**
 * { action: 'start' }            → a new secret + QR code to scan (not active yet)
 * { action: 'confirm', code }    → turns two-step verification on once a code from the app matches
 * { action: 'disable', code }    → turns it off (needs a current code)
 * The session cookie is re-issued, because changing two-step signs other sessions out.
 */
export async function POST(request) {
  if (!(await requireAdmin(request, { mutating: true }))) return reply({ ok: false, error: 'unauthorized' }, 401);
  let body;
  try {
    body = JSON.parse((await request.text()).slice(0, 2048));
  } catch {
    return reply({ ok: false, error: 'invalid' }, 400);
  }
  const current = await getTwoStep();

  if (body?.action === 'start') {
    if (current.enabled) return reply({ ok: false, error: 'already_enabled' }, 409);
    const secret = newTotpSecret();
    await setTwoStep({ ...current, pending: secret });
    const uri = otpauthUri(secret);
    return reply({ ok: true, secret, uri, qr: renderSVG(uri, { border: 1 }) });
  }

  if (body?.action === 'confirm') {
    if (!current.pending || !checkTotp(current.pending, body.code)) return reply({ ok: false, error: 'invalid_code' }, 422);
    await setTwoStep({ enabled: true, secret: current.pending, pending: null });
    const res = reply({ ok: true, enabled: true });
    res.cookies.set(COOKIE, createSession(current.pending), cookieOptions(request));
    return res;
  }

  if (body?.action === 'disable') {
    if (!current.enabled || !checkTotp(current.secret, body.code)) return reply({ ok: false, error: 'invalid_code' }, 422);
    await setTwoStep({ enabled: false, secret: null, pending: null });
    const res = reply({ ok: true, enabled: false });
    res.cookies.set(COOKIE, createSession(null), cookieOptions(request));
    return res;
  }

  return reply({ ok: false, error: 'invalid' }, 400);
}
