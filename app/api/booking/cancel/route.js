import { cancelBooking, findByCancelToken, isDbConfigured } from '@/lib/booking/db';
import { notifyCancelled } from '@/lib/booking/notify';

export const dynamic = 'force-dynamic';

const reply = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });

function state(booking) {
  if (!booking) return 'invalid';
  if (!booking.active) return 'cancelled';
  if (new Date(booking.start) <= new Date()) return 'past';
  return 'active';
}

/** What a cancellation link points to: { status, start, meetingType }. No personal details. */
export async function GET(request) {
  if (!isDbConfigured()) return reply({ ok: false, error: 'unavailable' }, 503);
  const token = new URL(request.url).searchParams.get('token');
  const booking = await findByCancelToken(token).catch(() => null);
  const status = state(booking);
  return reply({ ok: true, status, ...(booking ? { start: booking.start, meetingType: booking.meetingType } : {}) });
}

export async function POST(request) {
  if (!isDbConfigured()) return reply({ ok: false, error: 'unavailable' }, 503);
  let token;
  try {
    ({ token } = JSON.parse(await request.text()));
  } catch {
    return reply({ ok: false, error: 'Invalid JSON' }, 400);
  }
  try {
    const booking = await cancelBooking(token);
    if (!booking) {
      const current = await findByCancelToken(token);
      return reply({ ok: false, status: state(current) }, 409);
    }
    await notifyCancelled(booking);
    console.info('[booking] Cancelled', booking.id);
    return reply({ ok: true, status: 'cancelled', start: booking.start });
  } catch (error) {
    console.error('[booking] Could not cancel:', error?.message ?? error);
    return reply({ ok: false, error: 'unavailable' }, 503);
  }
}
