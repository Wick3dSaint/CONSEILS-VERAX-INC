import { createHash, randomBytes } from 'node:crypto';
import { db, fromSql, isDbConfigured, toSql } from '../db.js';

/**
 * Booking storage. Double bookings are impossible: the unique key (slot_start, active) allows
 * only one active booking per slot, even if two people confirm at the same instant. A cancelled
 * booking sets active to NULL, which frees the slot (NULLs never collide in a unique key).
 */

export { isDbConfigured };
export class SlotTakenError extends Error {}
export class AlreadyBookedError extends Error {}

const hash = (token) => createHash('sha256').update(token).digest('hex');

/** Start times (ISO) of active bookings in a range. */
export async function bookedStarts(fromIso, toIso) {
  const [rows] = await (await db()).query(
    'SELECT slot_start FROM bookings WHERE active = 1 AND slot_start BETWEEN ? AND ?',
    [toSql(fromIso), toSql(toIso)],
  );
  return new Set(rows.map((r) => fromSql(r.slot_start)));
}

/**
 * Saves a booking. Throws SlotTakenError if the slot was just taken, and AlreadyBookedError
 * if this email already has an upcoming booking (one first consultation per person).
 * Returns { id, cancelToken }.
 */
export async function createBooking(b) {
  const p = await db();
  const [existing] = await p.query(
    'SELECT id FROM bookings WHERE email = ? AND active = 1 AND slot_start > UTC_TIMESTAMP() LIMIT 1',
    [b.email],
  );
  if (existing.length) throw new AlreadyBookedError();

  const cancelToken = randomBytes(24).toString('base64url');
  try {
    const [result] = await p.query(
      `INSERT INTO bookings
        (slot_start, active, first_name, last_name, email, phone, meeting_type, message, lang, cancel_token_hash, created_at)
       VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())`,
      [toSql(b.start), b.firstName, b.lastName, b.email, b.phone || null, b.meetingType, b.message || null, b.lang, hash(cancelToken)],
    );
    return { id: result.insertId, cancelToken };
  } catch (error) {
    if (error?.code === 'ER_DUP_ENTRY') throw new SlotTakenError();
    throw error;
  }
}

function toBooking(row) {
  return {
    id: row.id,
    start: fromSql(row.slot_start),
    active: row.active === 1,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    meetingType: row.meeting_type,
    message: row.message,
    lang: row.lang,
  };
}

/** The booking a cancellation link points to, or null. */
export async function findByCancelToken(token) {
  if (typeof token !== 'string' || token.length < 20 || token.length > 100) return null;
  const [rows] = await (await db()).query('SELECT * FROM bookings WHERE cancel_token_hash = ? LIMIT 1', [hash(token)]);
  return rows.length ? toBooking(rows[0]) : null;
}

/** Cancels an upcoming booking. Returns the booking, or null if nothing was cancelled. */
export async function cancelBooking(token) {
  const booking = await findByCancelToken(token);
  if (!booking || !booking.active || new Date(booking.start) <= new Date()) return null;
  const [result] = await (await db()).query(
    'UPDATE bookings SET active = NULL, cancelled_at = UTC_TIMESTAMP() WHERE id = ? AND active = 1',
    [booking.id],
  );
  return result.affectedRows === 1 ? booking : null;
}

/** Bookings from `fromIso` onward (upcoming and recent), for the admin portal. */
export async function listBookings(fromIso) {
  const [rows] = await (await db()).query(
    'SELECT * FROM bookings WHERE slot_start >= ? ORDER BY slot_start ASC LIMIT 500',
    [toSql(fromIso)],
  );
  return rows.map((row) => ({ ...toBooking(row), createdAt: fromSql(row.created_at), cancelledAt: row.cancelled_at ? fromSql(row.cancelled_at) : null }));
}

/** Cancels an upcoming booking by id (admin). Returns the booking, or null if nothing was cancelled. */
export async function cancelBookingById(id) {
  const [rows] = await (await db()).query('SELECT * FROM bookings WHERE id = ? LIMIT 1', [id]);
  if (!rows.length) return null;
  const booking = toBooking(rows[0]);
  if (!booking.active || new Date(booking.start) <= new Date()) return null;
  const [result] = await (await db()).query(
    'UPDATE bookings SET active = NULL, cancelled_at = UTC_TIMESTAMP() WHERE id = ? AND active = 1',
    [id],
  );
  return result.affectedRows === 1 ? booking : null;
}
