/**
 * Fixed booking constants. Day-to-day availability (times, weekdays, notice, how far ahead,
 * closed days) is edited in the admin portal; DEFAULT_BOOKING_RULES is used until then.
 * All times are Eastern Time (Montréal), which follows daylight saving time automatically.
 */
export const BOOKING = {
  timeZone: 'America/Toronto', // Eastern Time — the zone Montréal uses
  slotMinutes: 30,
};

export const DEFAULT_BOOKING_RULES = {
  // Start time of every bookable slot, each day (24-hour clock). Slots are back to back.
  dailySlots: ['10:00', '10:30', '16:00', '16:30'],
  // Days that can be booked: 1 = Monday … 7 = Sunday.
  weekdays: [1, 2, 3, 4, 5],
  // 1 = earliest booking is tomorrow (no same-day bookings).
  minDaysAhead: 1,
  // Latest bookable day, counted from today (28 = four weeks).
  maxDaysAhead: 28,
  // Extra closed days (vacations); Québec public holidays are closed automatically.
  closedDates: [],
};
