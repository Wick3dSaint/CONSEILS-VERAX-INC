import en from './content/en';
import fr from './content/fr';

export const SITE_URL = 'https://conseilsverax.ca';

/** Supported languages. URLs are /fr/… and /en/…; proxy.js picks one for unprefixed URLs. */
export const locales = ['fr', 'en'];
export const LOCALE_COOKIE = 'lang';

const dictionaries = { en, fr };

export function hasLocale(lang) {
  return Object.hasOwn(dictionaries, lang);
}

export function getDictionary(lang) {
  return dictionaries[lang] ?? dictionaries.en;
}

/** Adds the language prefix to an internal path: ('fr', '/contact#reach-us') → '/fr/contact#reach-us'. */
export function localePath(lang, path = '/') {
  if (!path.startsWith('/')) return path;
  return path === '/' ? `/${lang}` : `/${lang}${path}`;
}

/** Page metadata with canonical and alternate-language links for search engines. */
export function pageMetadata(lang, path, { title, description }) {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: localePath(lang, path),
      languages: {
        'fr-CA': localePath('fr', path),
        'en-CA': localePath('en', path),
        'x-default': path,
      },
    },
  };
}

export function serviceMap(dict) {
  return Object.fromEntries(dict.services.map((s) => [s.id, s]));
}
