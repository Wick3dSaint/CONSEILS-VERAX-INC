import {
  COOKIE,
  checkPassword,
  checkTotp,
  clearFailures,
  cookieOptions,
  createSession,
  getTwoStep,
  isLockedOut,
  passwordConfigured,
  recordFailure,
} from '@/lib/admin/auth';
import { clientIp } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
const reply = (body, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request) {
  if (!passwordConfigured()) return reply({ ok: false, error: 'not_configured' }, 503);
  const ip = clientIp(request);
  if (await isLockedOut(ip)) return reply({ ok: false, error: 'locked' }, 429);

  let body;
  try {
    body = JSON.parse((await request.text()).slice(0, 4096));
  } catch {
    return reply({ ok: false, error: 'invalid' }, 400);
  }

  if (!checkPassword(body?.password)) {
    await recordFailure(ip);
    return reply({ ok: false, error: 'invalid' }, 401);
  }

  const twoStep = await getTwoStep().catch(() => ({ enabled: false, secret: null }));
  if (twoStep.enabled) {
    if (!body?.code) return reply({ ok: false, error: 'code_required' }, 401);
    if (!checkTotp(twoStep.secret, body.code)) {
      await recordFailure(ip);
      return reply({ ok: false, error: 'invalid_code' }, 401);
    }
  }

  await clearFailures(ip);
  const res = reply({ ok: true });
  res.cookies.set(COOKIE, createSession(twoStep.enabled ? twoStep.secret : null), cookieOptions(request));
  return res;
}
