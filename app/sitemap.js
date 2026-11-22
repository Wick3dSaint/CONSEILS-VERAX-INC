import { SHOW_CLIENTS, SITE_URL, localePath, locales } from '@/lib/i18n';

/** Public pages, listed for search engines in both languages (with each page's other-language twin). */
const PAGES = [
  '/',
  '/services',
  '/about',
  '/contact',
  '/book',
  ...(SHOW_CLIENTS ? ['/clients'] : []),
];

export default function sitemap() {
  return PAGES.flatMap((path) =>
    locales.map((lang) => ({
      url: `${SITE_URL}${localePath(lang, path)}`,
      changeFrequency: 'monthly',
      priority: path === '/' ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [`${l}-CA`, `${SITE_URL}${localePath(l, path)}`])),
      },
    })),
  );
}
