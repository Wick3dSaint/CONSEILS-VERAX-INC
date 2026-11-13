import { NextResponse } from 'next/server';
import { isQuebecIp } from './lib/geo/quebec';

// Keep in sync with lib/i18n.js (kept separate so the content files stay out of this bundle).
const LOCALES = ['fr', 'en'];
const COOKIE = 'lang';

/** The visitor's address as seen by Hostinger's front-end proxy. */
function clientIp(request) {
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  // The last entry is the one added by Hostinger's proxy; earlier ones can be set by the client.
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',').at(-1).trim() : '';
}

/** First of fr/en in the browser's Accept-Language preferences, by quality. */
function browserLocale(header) {
  if (!header) return null;
  const ranked = header
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().toLowerCase().split(';');
      const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      return { lang: tag.split('-')[0], q: q ? Number(q.slice(2)) || 0 : 1, index };
    })
    .filter((l) => l.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  return ranked.find((l) => LOCALES.includes(l.lang))?.lang ?? null;
}

export function chooseLocale(request) {
  // 1. A language the visitor picked with the switcher.
  const saved = request.cookies.get(COOKIE)?.value;
  if (LOCALES.includes(saved)) return saved;
  // 2. Visitors in Québec see French first.
  if (isQuebecIp(clientIp(request))) return 'fr';
  // 3. Otherwise, the browser's preferred language, then English.
  return browserLocale(request.headers.get('accept-language')) ?? 'en';
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${chooseLocale(request)}${pathname === '/' ? '' : pathname}`;
  const response = NextResponse.redirect(url, 307);
  // The answer depends on who is asking: never let a cache serve it to someone else.
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Vary', 'Cookie, Accept-Language, X-Forwarded-For');
  return response;
}

export const config = {
  // Everything except Next.js internals, the API and files with an extension (icon.svg, etc.).
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
};
