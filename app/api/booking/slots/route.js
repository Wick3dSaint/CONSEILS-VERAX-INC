import { BOOKING } from '@/lib/booking/config';
import { bookedStarts, isDbConfigured } from '@/lib/booking/db';
import { candidateSlots } from '@/lib/booking/slots';

export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'private, no-store' };

/** Open slots for the next four weeks (times are ISO instants; the page shows them in Eastern Time). */
export async function GET() {
  if (!isDbConfigured()) {
    return Response.json({ ok: false, error: 'unavailable' }, { status: 503, headers: noStore });
  }
  try {
    const slots = candidateSlots();
    const taken = slots.length ? await bookedStarts(slots[0].start, slots.at(-1).start) : new Set();
    return Response.json(
      { ok: true, timeZone: BOOKING.timeZone, slots: slots.filter((s) => !taken.has(s.start)) },
      { headers: noStore },
    );
  } catch (error) {
    console.error('[booking] Could not load slots:', error?.message ?? error);
    return Response.json({ ok: false, error: 'unavailable' }, { status: 503, headers: noStore });
  }
}
