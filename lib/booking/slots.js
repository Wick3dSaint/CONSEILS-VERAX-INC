import { BOOKING } from './config.js';
import { isQuebecHoliday } from './holidays.js';
import { addDays, isoWeekday, todayInZone, zonedTimeToUtc } from './time.js';

/**
 * Every slot the rules allow, before removing booked ones:
 * from tomorrow (minDaysAhead) to four weeks out, weekdays only, closed on Québec holidays.
 */
export function candidateSlots(now = new Date()) {
  const today = todayInZone(BOOKING.timeZone, now);
  const closed = new Set(BOOKING.extraClosedDates);
  const slots = [];
  for (let i = BOOKING.minDaysAhead; i <= BOOKING.maxDaysAhead; i++) {
    const date = addDays(today, i);
    if (!BOOKING.weekdays.includes(isoWeekday(date)) || isQuebecHoliday(date) || closed.has(date)) continue;
    for (const time of BOOKING.dailySlots) {
      const start = zonedTimeToUtc(date, time, BOOKING.timeZone);
      if (start > now) slots.push({ start: start.toISOString(), date, time });
    }
  }
  return slots;
}

/** The candidate slot starting at this exact instant, or null if it isn't offered. */
export function findOfferedSlot(startIso, now = new Date()) {
  return candidateSlots(now).find((s) => s.start === startIso) ?? null;
}
