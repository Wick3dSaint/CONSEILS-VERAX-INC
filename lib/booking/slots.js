import { BOOKING, DEFAULT_BOOKING_RULES } from './config.js';
import { isQuebecHoliday } from './holidays.js';
import { addDays, isoWeekday, todayInZone, zonedTimeToUtc } from './time.js';

/**
 * Every slot the rules allow, before removing booked ones: from minDaysAhead to maxDaysAhead,
 * on the chosen weekdays, closed on Québec public holidays and on the admin's closed days.
 */
export function candidateSlots(rules = DEFAULT_BOOKING_RULES, now = new Date()) {
  const today = todayInZone(BOOKING.timeZone, now);
  const closed = new Set(rules.closedDates);
  const times = [...rules.dailySlots].sort();
  const slots = [];
  for (let i = rules.minDaysAhead; i <= rules.maxDaysAhead; i++) {
    const date = addDays(today, i);
    if (!rules.weekdays.includes(isoWeekday(date)) || isQuebecHoliday(date) || closed.has(date)) continue;
    for (const time of times) {
      const start = zonedTimeToUtc(date, time, BOOKING.timeZone);
      if (start > now) slots.push({ start: start.toISOString(), date, time });
    }
  }
  return slots;
}

/** The candidate slot starting at this exact instant, or null if it isn't offered. */
export function findOfferedSlot(startIso, rules = DEFAULT_BOOKING_RULES, now = new Date()) {
  return candidateSlots(rules, now).find((s) => s.start === startIso) ?? null;
}
