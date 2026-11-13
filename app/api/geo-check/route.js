// TEMPORARY diagnostic: which request headers does the hosting provide?
// Lists header names, and values only for location-related headers. Remove after use.
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const names = [...request.headers.keys()].sort();
  const geo = {};
  for (const [k, v] of request.headers) {
    if (/country|region|city|geo|continent|latitude|longitude|postal|timezone|metro|subdivision/i.test(k)) geo[k] = v;
  }
  return Response.json({ names, geo }, { headers: { 'Cache-Control': 'no-store' } });
}
