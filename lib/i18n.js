import en from './content/en.js';
import fr from './content/fr.js';
import { getSettings } from './settings.js';

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

/* ------------------------------------------------------------------ */
/* Content with the admin portal's settings applied                    */
/* ------------------------------------------------------------------ */

const AND = { en: 'and', fr: 'et' };

/** "a, b and c" (English) / "a, b et c" (French). */
function joinList(items, lang) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} ${AND[lang] ?? 'and'} ${items.at(-1)}`;
}

const capitalize = (s) => (s ? s.charAt(0).toLocaleUpperCase() + s.slice(1) : s);

/**
 * Applies settings to a dictionary:
 * - keeps only the services switched on (and drops switched-off ones from "Often paired with");
 * - fills [[email]], [[phone]], [[hours]], [[responseTime]], [[ServiceList]], [[serviceList]], [[Count]];
 * - picks { one, other } wording by how many services are on ("One way…" / "Four ways…").
 */
export function buildContent(base, lang, settings) {
  const disabled = new Set(settings.services.disabled);
  const services = base.services.filter((s) => !disabled.has(s.id));
  const count = services.length;
  const list = joinList(services.map((s) => s.listName), lang);
  const tokens = {
    email: settings.contact.email,
    phone: settings.contact.phone,
    hours: settings.contact.hours[lang] ?? settings.contact.hours.en,
    responseTime: settings.contact.responseTime[lang] ?? settings.contact.responseTime.en,
    serviceList: list,
    ServiceList: capitalize(list),
    Count: base.ui.numberWords[count] ?? String(count),
  };

  const fill = (value) => {
    if (typeof value === 'string') return value.replace(/\[\[(\w+)\]\]/g, (m, key) => tokens[key] ?? m);
    if (Array.isArray(value)) return value.map(fill);
    if (value && typeof value === 'object') {
      const keys = Object.keys(value);
      if (keys.length === 2 && 'one' in value && 'other' in value) return fill(count === 1 ? value.one : value.other);
      return Object.fromEntries(keys.map((k) => [k, fill(value[k])]));
    }
    return value;
  };

  const dict = fill({
    ...base,
    services,
    clientSegments: base.clientSegments.map((c) => ({ ...c, pairs: c.pairs.filter((id) => !disabled.has(id)) })),
  });
  dict.site = { ...dict.site, email: tokens.email, phone: tokens.phone, hours: tokens.hours, responseTime: tokens.responseTime };
  return dict;
}

/** The content for a language, with the current admin settings applied. */
export async function getContent(lang) {
  return buildContent(getDictionary(lang), lang, await getSettings());
}
