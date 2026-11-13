/**
 * Small in-memory rate limiter (per server process): at most `max` actions per `windowMs`
 * for each key. Enough to stop one visitor from filling the calendar; resets on restart.
 */
const buckets = new Map();

export function rateLimited(key, { max, windowMs }) {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    buckets.set(key, recent);
    return true;
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) buckets.clear(); // keep memory bounded
  return false;
}

/** The visitor's address as seen by Hostinger's front-end proxy. */
export function clientIp(request) {
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',').at(-1).trim() : 'unknown';
}
