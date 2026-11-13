/**
 * Online booking rules. Edit these values to change availability.
 * All times are Eastern Time (Montréal), which follows daylight saving time automatically.
 */
export const BOOKING = {
  timeZone: 'America/Toronto', // Eastern Time — the zone Montréal uses
  slotMinutes: 30,
  // Start time of every bookable slot, each day (24-hour clock). Slots are back to back, no gaps.
  dailySlots: ['10:00', '10:30', '16:00', '16:30'],
  // Days that can be booked: 1 = Monday … 7 = Sunday.
  weekdays: [1, 2, 3, 4, 5],
  // 1 = earliest booking is tomorrow (no same-day bookings).
  minDaysAhead: 1,
  // Latest bookable day, counted from today (28 = four weeks).
  maxDaysAhead: 28,
  // Québec public holidays are closed automatically (lib/booking/holidays.js).
  // Add other closed days here, e.g. vacations: ['2026-12-24', '2026-12-31'].
  extraClosedDates: [],
};
