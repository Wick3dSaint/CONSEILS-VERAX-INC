/**
 * General federal and Québec tax deadlines, computed from their rules (no hard-coded years).
 * Dates are 'YYYY-MM-DD' strings. Pure functions: used on the server and in the browser.
 *
 * Rules (general cases only — the firm should confirm these before the page is published):
 * - RRSP contribution deadline: the 60th day after December 31.
 * - T4 / RL-1 slips: the last day of February.
 * - Personal returns and any balance owing: April 30.
 * - Self-employed people (and their spouses): returns due June 15; any balance owing still due April 30.
 * - Quarterly instalments: March 15, June 15, September 15, December 15.
 * - Corporations: balance of tax due 2 months after year-end (3 for some CCPCs);
 *   T2 / CO-17 returns due 6 months after year-end. A year-end on the last day of a month
 *   gives a deadline on the last day of the target month.
 * - A deadline on a Saturday or Sunday is treated as on time the next business day
 *   (public holidays can also move a deadline; they are not computed here).
 */

import { frenchFirst } from './dates.js';

const pad = (n) => String(n).padStart(2, '0');
const ymd = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;
const parts = (date) => date.split('-').map(Number);
const lastDay = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();

function addDays(date, days) {
  const [y, m, d] = parts(date);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

function weekday(date) {
  const [y, m, d] = parts(date);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 = Sunday … 6 = Saturday
}

/** The next business day when a date falls on a weekend; otherwise null. */
export function weekendShift(date) {
  const w = weekday(date);
  if (w === 6) return addDays(date, 2);
  if (w === 0) return addDays(date, 1);
  return null;
}

/** Same day n months later; a month-end stays a month-end. */
export function addMonths(date, n) {
  const [y, m, d] = parts(date);
  const total = m - 1 + n;
  const ty = y + Math.floor(total / 12);
  const tm = (total % 12) + 1;
  const day = d === lastDay(y, m) ? lastDay(ty, tm) : Math.min(d, lastDay(ty, tm));
  return ymd(ty, tm, day);
}

/** Personal deadlines from `today` (inclusive) for the next twelve months, in date order. */
export function personalDates(today) {
  const [ty] = parts(today);
  const end = addDays(today, 365);
  const events = [];
  for (const y of [ty, ty + 1]) {
    events.push({ id: 'rrsp', date: addDays(ymd(y - 1, 12, 31), 60), taxYear: y - 1 });
    events.push({ id: 'slips', date: ymd(y, 2, lastDay(y, 2)), taxYear: y - 1 });
    events.push({ id: 'file', date: ymd(y, 4, 30), taxYear: y - 1 });
    events.push({ id: 'selfEmployed', date: ymd(y, 6, 15), taxYear: y - 1 });
    for (const m of [3, 6, 9, 12]) events.push({ id: 'instalment', date: ymd(y, m, 15), taxYear: y });
  }
  return events
    .filter((e) => e.date >= today && e.date < end)
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
    .map((e) => ({ ...e, shiftedTo: weekendShift(e.date) }));
}

/** "Monday, March 1, 2027" / « lundi 1er mars 2027 » (French writes the first of the month as 1er). */
export function formatLongDate(locale, date) {
  const text = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
  return frenchFirst(locale, text);
}

/** Corporate deadlines for a fiscal year-end. */
export function corporateDates(yearEnd) {
  const make = (date) => ({ date, shiftedTo: weekendShift(date) });
  return {
    balance: make(addMonths(yearEnd, 2)),
    balanceCcpc: make(addMonths(yearEnd, 3)),
    filing: make(addMonths(yearEnd, 6)),
  };
}
