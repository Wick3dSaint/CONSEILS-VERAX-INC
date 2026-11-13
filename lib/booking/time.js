/** Date helpers for a named time zone (no dependencies). Calendar dates are 'YYYY-MM-DD'. */

const partsCache = new Map();
function formatter(timeZone) {
  if (!partsCache.has(timeZone)) {
    partsCache.set(
      timeZone,
      new Intl.DateTimeFormat('en-CA', {
        timeZone,
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    );
  }
  return partsCache.get(timeZone);
}

function zoned(date, timeZone) {
  const p = Object.fromEntries(formatter(timeZone).formatToParts(date).map((x) => [x.type, x.value]));
  return { year: +p.year, month: +p.month, day: +p.day, hour: +p.hour, minute: +p.minute, second: +p.second };
}

/** Offset of the zone from UTC at that instant, in milliseconds. */
function offsetMs(date, timeZone) {
  const z = zoned(date, timeZone);
  return Date.UTC(z.year, z.month - 1, z.day, z.hour, z.minute, z.second) - Math.floor(date.getTime() / 1000) * 1000;
}

/** Wall-clock date and time in the zone → the UTC instant. */
export function zonedTimeToUtc(dateYmd, timeHm, timeZone) {
  const [y, m, d] = dateYmd.split('-').map(Number);
  const [h, min] = timeHm.split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, h, min);
  let utc = guess - offsetMs(new Date(guess), timeZone);
  utc = guess - offsetMs(new Date(utc), timeZone); // second pass settles daylight-saving changes
  return new Date(utc);
}

export function todayInZone(timeZone, now = new Date()) {
  const z = zoned(now, timeZone);
  return `${z.year}-${String(z.month).padStart(2, '0')}-${String(z.day).padStart(2, '0')}`;
}

export function addDays(dateYmd, days) {
  const [y, m, d] = dateYmd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** ISO weekday: 1 = Monday … 7 = Sunday. */
export function isoWeekday(dateYmd) {
  const [y, m, d] = dateYmd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() || 7;
}
