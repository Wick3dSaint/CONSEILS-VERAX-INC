import mysql from 'mysql2/promise';

/**
 * Shared MySQL access (Hostinger). Connection details come from the environment variables
 * Hostinger writes when the database is set up: DB_HOST, DB_PORT, DB_NAME, DB_USER,
 * DB_PASSWORD (or DATABASE_URL). Tables are created automatically on first use.
 */

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

const SCHEMA = [
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
  `CREATE TABLE IF NOT EXISTS site_settings (
    name VARCHAR(50) NOT NULL PRIMARY KEY,
    value LONGTEXT NOT NULL COMMENT 'JSON',
    updated_at DATETIME NOT NULL COMMENT 'UTC'
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS admin_attempts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ip VARCHAR(64) NOT NULL,
    at DATETIME NOT NULL COMMENT 'UTC',
    KEY by_ip_time (ip, at),
    KEY by_time (at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

/** The connection pool, with all tables created. */
export async function db() {
  const p = getPool();
  schemaReady ??= (async () => {
    for (const statement of SCHEMA) await p.query(statement);
  })().catch((error) => {
    schemaReady = undefined; // retry on the next request
    throw error;
  });
  await schemaReady;
  return p;
}

/** ISO instant ↔ 'YYYY-MM-DD HH:MM:SS' (UTC) as stored in DATETIME columns. */
export const toSql = (iso) => new Date(iso).toISOString().slice(0, 19).replace('T', ' ');
export const fromSql = (value) => `${value.replace(' ', 'T')}.000Z`;
