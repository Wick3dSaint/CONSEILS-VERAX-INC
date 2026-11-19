import { requireAdmin } from '@/lib/admin/auth';
import { listBookings } from '@/lib/booking/db';
import { candidateSlots } from '@/lib/booking/slots';
import { getSettings, saveSettings, validateSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';
const reply = (body, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function GET(request) {
  if (!(await requireAdmin(request))) return reply({ ok: false, error: 'unauthorized' }, 401);
  return reply({ ok: true, settings: await getSettings() });
}

export async function PUT(request) {
  if (!(await requireAdmin(request, { mutating: true }))) return reply({ ok: false, error: 'unauthorized' }, 401);
  let body;
  try {
    body = JSON.parse((await request.text()).slice(0, 100_000));
  } catch {
    return reply({ ok: false, error: 'invalid' }, 400);
  }
  const { settings, errors } = validateSettings(body?.settings);
  if (Object.keys(errors).length) return reply({ ok: false, errors }, 422);

  try {
    const saved = await saveSettings(settings);
    // Existing bookings are never changed automatically: list any that fall outside the new hours.
    let outside = [];
    try {
      const allowed = new Set(candidateSlots({ ...saved.booking, minDaysAhead: 0, maxDaysAhead: 366 }).map((s) => s.start));
      outside = (await listBookings(new Date().toISOString())).filter((b) => b.active && !allowed.has(b.start));
    } catch {
      /* the warning is optional */
    }
    return reply({ ok: true, settings: saved, outside });
  } catch (error) {
    console.error('[admin] Could not save settings:', error?.message ?? error);
    return reply({ ok: false, error: 'save_failed' }, 503);
  }
}
