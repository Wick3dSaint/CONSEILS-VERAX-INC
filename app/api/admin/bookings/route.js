import { requireAdmin } from '@/lib/admin/auth';
import { cancelBookingById, listBookings } from '@/lib/booking/db';
import { notifyCancelled } from '@/lib/booking/notify';

export const dynamic = 'force-dynamic';
const reply = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

/** Bookings from 30 days ago onward. */
export async function GET(request) {
  if (!(await requireAdmin(request))) return reply({ ok: false, error: 'unauthorized' }, 401);
  try {
    return reply({ ok: true, bookings: await listBookings(new Date(Date.now() - 30 * 86_400_000).toISOString()) });
  } catch (error) {
    console.error('[admin] Could not list bookings:', error?.message ?? error);
    return reply({ ok: false, error: 'unavailable' }, 503);
  }
}

/** Cancel an upcoming booking; the client and the firm are emailed, as when a client cancels. */
export async function POST(request) {
  if (!(await requireAdmin(request, { mutating: true }))) return reply({ ok: false, error: 'unauthorized' }, 401);
  let id;
  try {
    ({ id } = JSON.parse(await request.text()));
  } catch {
    return reply({ ok: false, error: 'invalid' }, 400);
  }
  if (!Number.isInteger(id)) return reply({ ok: false, error: 'invalid' }, 400);
  try {
    const booking = await cancelBookingById(id);
    if (!booking) return reply({ ok: false, error: 'not_cancellable' }, 409);
    await notifyCancelled(booking);
    console.info('[admin] Cancelled booking', id);
    return reply({ ok: true });
  } catch (error) {
    console.error('[admin] Could not cancel booking:', error?.message ?? error);
    return reply({ ok: false, error: 'unavailable' }, 503);
  }
}
