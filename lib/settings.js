import en from './content/en.js';
import fr from './content/fr.js';
import { DEFAULT_BOOKING_RULES } from './booking/config.js';
import { db, isDbConfigured } from './db.js';

/**
 * Settings the firm edits in the admin portal (/admin), stored in the site_settings table.
 * Until something is saved there, the defaults below (from the content files) apply, so the
 * site always works, even if the database is unreachable.
 */

export const SERVICE_IDS = en.services.map((s) => s.id);

export const DEFAULT_SETTINGS = {
  services: { disabled: [] },
  contact: {
    email: en.site.email,
    phone: en.site.phone,
    hours: { en: en.site.hours, fr: fr.site.hours },
    responseTime: { en: en.site.responseTime, fr: fr.site.responseTime },
  },
  booking: DEFAULT_BOOKING_RULES,
};

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^(?:[01]\d|2[0-3]):(?:00|30)$/;

const str = (v) => (typeof v === 'string' ? v.trim() : '');
const isRealDate = (d) => DATE.test(d) && new Date(`${d}T12:00:00Z`).toISOString().slice(0, 10) === d;

/** Checks a full settings object from the admin portal. Returns { settings, errors }. */
export function validateSettings(input) {
  const errors = {};
  const src = input && typeof input === 'object' ? input : {};

  // Services: at least one must stay on.
  const disabled = [...new Set((src.services?.disabled ?? []).filter((id) => SERVICE_IDS.includes(id)))];
  if (disabled.length >= SERVICE_IDS.length) errors.services = 'At least one service must stay on.';

  // Contact details.
  const c = src.contact ?? {};
  const contact = {
    email: str(c.email),
    phone: str(c.phone),
    hours: { en: str(c.hours?.en), fr: str(c.hours?.fr) },
    responseTime: { en: str(c.responseTime?.en), fr: str(c.responseTime?.fr) },
  };
  if (!EMAIL.test(contact.email) || contact.email.length > 254) errors.email = 'Enter a valid email address.';
  const digits = contact.phone.replace(/\D/g, '');
  if (!/^[+\d\s().-]+$/.test(contact.phone) || digits.length < 10 || digits.length > 15)
    errors.phone = 'Enter a valid phone number, like 514-224-7948.';
  for (const key of ['hours', 'responseTime'])
    for (const lang of ['en', 'fr']) {
      const v = contact[key][lang];
      if (!v || v.length > 100) errors[`${key}.${lang}`] = 'Required, up to 100 characters.';
      if (/[[\]<>]/.test(v)) errors[`${key}.${lang}`] = 'Please don’t use the characters [ ] < >.';
    }

  // Booking rules.
  const b = src.booking ?? {};
  const dailySlots = [...new Set((b.dailySlots ?? []).filter((t) => typeof t === 'string' && TIME.test(t)))].sort();
  const weekdays = [...new Set((b.weekdays ?? []).map(Number).filter((d) => Number.isInteger(d) && d >= 1 && d <= 7))].sort();
  const minDaysAhead = Number(b.minDaysAhead);
  const maxDaysAhead = Number(b.maxDaysAhead);
  const today = new Date().toISOString().slice(0, 10);
  const closedDates = [...new Set((b.closedDates ?? []).filter((d) => typeof d === 'string' && isRealDate(d) && d >= today))].sort();
  if (!dailySlots.length) errors.dailySlots = 'Choose at least one time.';
  if (!weekdays.length) errors.weekdays = 'Choose at least one day.';
  if (!Number.isInteger(minDaysAhead) || minDaysAhead < 0 || minDaysAhead > 30) errors.minDaysAhead = 'Between 0 and 30 days.';
  if (!Number.isInteger(maxDaysAhead) || maxDaysAhead < 1 || maxDaysAhead > 365) errors.maxDaysAhead = 'Between 1 and 365 days.';
  else if (Number.isInteger(minDaysAhead) && maxDaysAhead < minDaysAhead) errors.maxDaysAhead = 'Must be at least the minimum notice.';
  if (closedDates.length > 400) errors.closedDates = 'Too many closed days (400 maximum).';

  return {
    settings: { services: { disabled }, contact, booking: { dailySlots, weekdays, minDaysAhead, maxDaysAhead, closedDates } },
    errors,
  };
}

/* ------------------------------------------------------------------ */
/* Storage. Read fresh each time: public pages are cached as a whole   */
/* (and rebuilt on save), so an in-memory copy here could only go stale. */
/* ------------------------------------------------------------------ */

let lastGood = null; // used only if the database is briefly unreachable

function withDefaults(stored) {
  const s = stored && typeof stored === 'object' ? stored : {};
  const merged = {
    services: { ...DEFAULT_SETTINGS.services, ...s.services },
    contact: {
      ...DEFAULT_SETTINGS.contact,
      ...s.contact,
      hours: { ...DEFAULT_SETTINGS.contact.hours, ...s.contact?.hours },
      responseTime: { ...DEFAULT_SETTINGS.contact.responseTime, ...s.contact?.responseTime },
    },
    booking: { ...DEFAULT_SETTINGS.booking, ...s.booking },
  };
  // Drop closed days that have passed.
  const today = new Date().toISOString().slice(0, 10);
  merged.booking.closedDates = merged.booking.closedDates.filter((d) => d >= today);
  merged.services.disabled = merged.services.disabled.filter((id) => SERVICE_IDS.includes(id));
  return merged;
}

export async function readRow(name) {
  const [rows] = await (await db()).query('SELECT value FROM site_settings WHERE name = ? LIMIT 1', [name]);
  return rows.length ? JSON.parse(rows[0].value) : null;
}

export async function writeRow(name, value) {
  await (await db()).query(
    `INSERT INTO site_settings (name, value, updated_at) VALUES (?, ?, UTC_TIMESTAMP())
     ON DUPLICATE KEY UPDATE value = VALUES(value), updated_at = VALUES(updated_at)`,
    [name, JSON.stringify(value)],
  );
}

/**
 * One-time changes to settings already saved from the admin portal. Each runs once (recorded in the
 * "migrations" row), so anything changed in the portal afterwards is never overridden.
 */
const MIGRATIONS = [
  {
    // November 2026: the firm opened 11:00 and 15:00 consultation slots.
    id: '2026-11-booking-11am-3pm',
    apply: (s) =>
      s.booking?.dailySlots
        ? { ...s, booking: { ...s.booking, dailySlots: [...new Set([...s.booking.dailySlots, '11:00', '15:00'])].sort() } }
        : s,
  },
];
let migrated = false;

async function migrate(stored) {
  if (migrated) return stored;
  const done = new Set((await readRow('migrations')) ?? []);
  const todo = MIGRATIONS.filter((m) => !done.has(m.id));
  let next = stored;
  if (todo.length) {
    // With nothing saved yet the defaults already include these changes; just record them as done.
    if (next) {
      for (const m of todo) next = m.apply(next);
      await writeRow('site', next);
    }
    for (const m of todo) done.add(m.id);
    await writeRow('migrations', [...done]);
  }
  migrated = true;
  return next;
}

/** Current settings (defaults merged in). Never throws. */
export async function getSettings() {
  if (!isDbConfigured()) return withDefaults(null);
  try {
    lastGood = withDefaults(await migrate(await readRow('site')));
    return lastGood;
  } catch (error) {
    console.error('[settings] Could not read settings:', error?.message ?? error);
    return lastGood ?? withDefaults(null);
  }
}

/** Saves validated settings. */
export async function saveSettings(settings) {
  await writeRow('site', settings);
  lastGood = withDefaults(settings);
  return lastGood;
}
