import { AlreadyBookedError, SlotTakenError, createBooking, isDbConfigured } from '@/lib/booking/db';
import { notifyBooked } from '@/lib/booking/notify';
import { findOfferedSlot } from '@/lib/booking/slots';
import { clientIp, rateLimited } from '@/lib/rate-limit';
import { validateBooking } from '@/lib/validation';

export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 16 * 1024;
const reply = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });

export async function POST(request) {
  if (!isDbConfigured()) return reply({ ok: false, error: 'unavailable' }, 503);

  let body;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return reply({ ok: false, error: 'Payload too large' }, 413);
    body = JSON.parse(raw);
  } catch {
    return reply({ ok: false, error: 'Invalid JSON' }, 400);
  }

  // Honeypot: only bots fill the hidden field. Pretend success, book nothing.
  if (typeof body?.website === 'string' && body.website.trim() !== '') return reply({ ok: true });

  if (rateLimited(`book:${clientIp(request)}`, { max: 5, windowMs: 60 * 60 * 1000 })) {
    return reply({ ok: false, error: 'rate_limited' }, 429);
  }

  const { values, errors, isValid } = validateBooking(body);
  if (!isValid) return reply({ ok: false, errors }, 422);

  // Only slots the rules currently offer can be booked (not past, not today, not a holiday…).
  const slot = findOfferedSlot(values.start);
  if (!slot) return reply({ ok: false, error: 'slot_taken' }, 409);

  const lang = body?.lang === 'fr' ? 'fr' : 'en';
  const booking = { ...values, start: slot.start, lang };
  try {
    const { id, cancelToken } = await createBooking(booking);
    await notifyBooked({ ...booking, id }, cancelToken);
    console.info('[booking] Booked', id, slot.start);
    return reply({ ok: true, start: slot.start });
  } catch (error) {
    if (error instanceof SlotTakenError) return reply({ ok: false, error: 'slot_taken' }, 409);
    if (error instanceof AlreadyBookedError) return reply({ ok: false, error: 'already_booked' }, 409);
    console.error('[booking] Could not save booking:', error?.message ?? error);
    return reply({ ok: false, error: 'unavailable' }, 503);
  }
}
