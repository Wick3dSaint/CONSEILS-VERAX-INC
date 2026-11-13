import { createHash, randomBytes } from 'node:crypto';
import mysql from 'mysql2/promise';

/**
 * Booking storage (MySQL on Hostinger). Connection details come from the environment
 * variables Hostinger writes when the database is set up: DB_HOST, DB_PORT, DB_NAME,
 * DB_USER, DB_PASSWORD (or DATABASE_URL). The table is created automatically on first use.
 *
 * Double bookings are impossible: the unique key (slot_start, active) allows only one active
 * booking per slot, even if two people confirm at the same instant. A cancelled booking sets
 * active to NULL, which frees the slot (NULLs never collide in a unique key).
 */

export class SlotTakenError extends Error {}
export class AlreadyBookedError extends Error {}

export function isDbConfigured() {
  return Boolean(process.env.DATABASE_URL || (process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME));
}

let pool;
let schemaReady;

function getPool() {
  if (!pool) {
    const common = { connectionLimit: 3, timezone: 'Z', dateStrings: true, charset: 'utf8mb4' };
    if (process.env.DB_HOST) {
      pool = mysql.createPool({
        ...common,
        // "localhost" can resolve to IPv6 on Hostinger, where the database user may not have access.
        host: process.env.DB_HOST === 'localhost' ? '127.0.0.1' : process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
    } else {
      pool = mysql.createPool({ ...common, uri: process.env.DATABASE_URL });
    }
  }
  return pool;
}

async function db() {
  const p = getPool();
  schemaReady ??= p
    .query(
      `CREATE TABLE IF NOT EXISTS bookings (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        slot_start DATETIME NOT NULL COMMENT 'UTC',
        active TINYINT NULL DEFAULT 1 COMMENT '1 = booked; NULL = cancelled (frees the slot)',
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(254) NOT NULL,
        phone VARCHAR(40) NULL,
        meeting_type ENUM('phone', 'video') NOT NULL,
        message TEXT NULL,
        lang CHAR(2) NOT NULL,
        cancel_token_hash CHAR(64) NOT NULL,
        created_at DATETIME NOT NULL COMMENT 'UTC',
        cancelled_at DATETIME NULL COMMENT 'UTC',
        UNIQUE KEY one_booking_per_slot (slot_start, active),
        UNIQUE KEY cancel_token (cancel_token_hash),
        KEY upcoming_by_email (email, active, slot_start)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    )
    .catch((error) => {
      schemaReady = undefined; // retry on the next request
      throw error;
    });
  await schemaReady;
  return p;
}

/** ISO instant → 'YYYY-MM-DD HH:MM:SS' (UTC) and back. */
const toSql = (iso) => new Date(iso).toISOString().slice(0, 19).replace('T', ' ');
const fromSql = (value) => `${value.replace(' ', 'T')}.000Z`;
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
