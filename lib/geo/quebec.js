import data from './quebec-ranges.json';

/**
 * Is this IP address located in Québec, according to DB-IP's free database?
 * The lookup happens entirely on our own server. Accuracy is approximate:
 * VPNs and some mobile networks can place a visitor in the wrong province.
 */

function v4ToInt(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    const v = Number(p);
    if (!Number.isInteger(v) || v < 0 || v > 255 || p === '') return null;
    n = n * 256 + v;
  }
  return n;
}

function v6ToHex(ip) {
  if (!/^[0-9a-f:]+$/i.test(ip) || ip.split('::').length > 2) return null;
  const [head, tail] = ip.includes('::') ? ip.split('::') : [ip, null];
  const h = head ? head.split(':') : [];
  const t = tail ? tail.split(':') : [];
  const fill = 8 - h.length - t.length;
  if (tail === null ? h.length !== 8 : fill < 1) return null;
  const groups = tail === null ? h : [...h, ...Array(fill).fill('0'), ...t];
  if (groups.some((g) => g.length === 0 || g.length > 4)) return null;
  return groups.map((g) => g.padStart(4, '0')).join('').toLowerCase();
}

/** Binary search in a flat, sorted [start, end, start, end, …] list. */
function inRanges(list, value) {
  let lo = 0;
  let hi = list.length / 2 - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const start = list[mid * 2];
    const end = list[mid * 2 + 1];
    if (value < start) hi = mid - 1;
    else if (value > end) lo = mid + 1;
    else return true;
  }
  return false;
}

export function isQuebecIp(rawIp) {
  if (!rawIp) return false;
  let ip = rawIp.trim();
  if (ip.startsWith('::ffff:') && ip.includes('.')) ip = ip.slice(7); // IPv4-mapped IPv6
  if (ip.includes('.')) {
    const n = v4ToInt(ip);
    return n !== null && inRanges(data.v4, n);
  }
  const hex = v6ToHex(ip);
  return hex !== null && inRanges(data.v6, hex);
}

export const geoDataRelease = data.release;
