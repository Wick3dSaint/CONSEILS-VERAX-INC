/**
 * Québec public (statutory) holidays, calculated for any year.
 * Source of the list: Québec's Act respecting labour standards. Both Good Friday and
 * Easter Monday are closed (an employer may observe either one; closing both is the safe choice).
 * Dates are 'YYYY-MM-DD' calendar dates in Québec.
 */

const pad = (n) => String(n).padStart(2, '0');
const ymd = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

/** Easter Sunday (Gregorian calendar), anonymous Gregorian algorithm. */
function easterSunday(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

const shift = (date, days) => new Date(date.getTime() + days * 86_400_000);
const toYmd = (date) => ymd(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());

/** The n-th given weekday (0 = Sunday … 6 = Saturday) of a month. */
function nthWeekday(year, month, weekday, n) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const offset = (weekday - first.getUTCDay() + 7) % 7;
  return new Date(Date.UTC(year, month - 1, 1 + offset + (n - 1) * 7));
}

/** Monday before May 25 (Journée nationale des patriotes). */
function patriotsDay(year) {
  const may24 = new Date(Date.UTC(year, 4, 24));
  return shift(may24, -((may24.getUTCDay() + 6) % 7));
}

export function quebecHolidays(year) {
  const easter = easterSunday(year);
  const canadaDay = new Date(Date.UTC(year, 6, 1));
  return [
    { date: ymd(year, 1, 1), name: 'New Year’s Day / Jour de l’An' },
    { date: toYmd(shift(easter, -2)), name: 'Good Friday / Vendredi saint' },
    { date: toYmd(shift(easter, 1)), name: 'Easter Monday / Lundi de Pâques' },
    { date: toYmd(patriotsDay(year)), name: 'National Patriots’ Day / Journée nationale des patriotes' },
    { date: ymd(year, 6, 24), name: 'Fête nationale du Québec' },
    // Canada Day moves to July 2 when July 1 falls on a Sunday.
    { date: canadaDay.getUTCDay() === 0 ? ymd(year, 7, 2) : ymd(year, 7, 1), name: 'Canada Day / Fête du Canada' },
    { date: toYmd(nthWeekday(year, 9, 1, 1)), name: 'Labour Day / Fête du Travail' },
    { date: toYmd(nthWeekday(year, 10, 1, 2)), name: 'Thanksgiving / Action de grâce' },
    { date: ymd(year, 12, 25), name: 'Christmas Day / Noël' },
  ];
}

const cache = new Map();
export function isQuebecHoliday(dateYmd) {
  const year = Number(dateYmd.slice(0, 4));
  if (!cache.has(year)) cache.set(year, new Set(quebecHolidays(year).map((h) => h.date)));
  return cache.get(year).has(dateYmd);
}
