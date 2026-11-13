#!/usr/bin/env node
/**
 * Refreshes lib/geo/quebec-ranges.json from DB-IP's free "IP to City Lite" database.
 *
 *   npm run geo:update            (uses the current month's release)
 *   npm run geo:update -- 2026-11 (a specific release)
 *
 * The database is released monthly; refresh about once a month. It is licensed under
 * Creative Commons Attribution 4.0 — the site keeps the required "IP Geolocation by DB-IP"
 * link in its footer. Only Québec ranges are kept: visitor IPs are compared against this
 * file on our own server and are never sent anywhere.
 */
import { createGunzip } from 'node:zlib';
import { createInterface } from 'node:readline';
import { Readable } from 'node:stream';
import { writeFile } from 'node:fs/promises';
import { isIPv4 } from 'node:net';

const release = process.argv[2] || new Date().toISOString().slice(0, 7);
const url = `https://download.db-ip.com/free/dbip-city-lite-${release}.csv.gz`;
const OUT = new URL('../lib/geo/quebec-ranges.json', import.meta.url);

function v4ToInt(ip) {
  return ip.split('.').reduce((n, part) => n * 256 + Number(part), 0);
}

/** IPv6 → 32 hex digits (fixed width, so plain string comparison orders addresses). */
function v6ToHex(ip) {
  let [head, tail] = ip.includes('::') ? ip.split('::') : [ip, null];
  const h = head ? head.split(':') : [];
  const t = tail ? tail.split(':') : [];
  const groups = tail === null ? h : [...h, ...Array(8 - h.length - t.length).fill('0'), ...t];
  return groups.map((g) => g.padStart(4, '0')).join('').toLowerCase();
}

function merge(ranges, adjacent) {
  ranges.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const out = [];
  for (const r of ranges) {
    const last = out[out.length - 1];
    if (last && adjacent(last[1], r[0])) {
      if (r[1] > last[1]) last[1] = r[1];
    } else out.push([...r]);
  }
  return out;
}

const hexInc = (hex) => (BigInt(`0x${hex}`) + 1n).toString(16).padStart(32, '0');

console.log(`Downloading ${url} …`);
const res = await fetch(url);
if (!res.ok) throw new Error(`Download failed: HTTP ${res.status} (is the ${release} release out yet?)`);

const lines = createInterface({ input: Readable.fromWeb(res.body).pipe(createGunzip()) });
const v4 = [];
const v6 = [];
let rows = 0;
for await (const line of lines) {
  rows++;
  // ip_start,ip_end,continent,country,stateprov,city,lat,lon — the first five fields never contain commas
  const [start, end, , country, region] = line.split(',', 5);
  if (country !== 'CA' || region !== 'Quebec') continue;
  if (isIPv4(start)) v4.push([v4ToInt(start), v4ToInt(end)]);
  else v6.push([v6ToHex(start), v6ToHex(end)]);
}

const v4Merged = merge(v4, (lastEnd, nextStart) => nextStart <= lastEnd + 1);
const v6Merged = merge(v6, (lastEnd, nextStart) => nextStart <= hexInc(lastEnd));

const data = {
  source: 'DB-IP IP to City Lite (https://db-ip.com), CC BY 4.0',
  release,
  generated: new Date().toISOString(),
  // Flat [start, end, start, end, …] lists, sorted, non-overlapping.
  v4: v4Merged.flat(),
  v6: v6Merged.flat(),
};
await writeFile(OUT, JSON.stringify(data));
console.log(
  `Read ${rows.toLocaleString()} rows → Québec: ${v4.length} IPv4 / ${v6.length} IPv6 ranges, ` +
    `merged to ${v4Merged.length} / ${v6Merged.length}. Wrote ${OUT.pathname}`,
);
