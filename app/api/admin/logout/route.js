import { COOKIE, cookieOptions } from '@/lib/admin/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, '', cookieOptions(request, 0));
  return res;
}
