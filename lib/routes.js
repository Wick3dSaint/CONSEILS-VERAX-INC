/**
 * Page addresses per language. Pages live at their English path inside app/[lang]; French visitors
 * see a French address instead (next.config.mjs serves the page at it and redirects the English one).
 * Kept free of other imports so proxy.js and next.config.mjs can use it too.
 */
export const FR_PATHS = {
  '/about': '/a-propos',
  '/book': '/reserver',
  '/book/cancel': '/reserver/annuler',
};

const FR_TO_INTERNAL = Object.fromEntries(Object.entries(FR_PATHS).map(([internal, fr]) => [fr, internal]));

function split(path) {
  const i = path.search(/[?#]/);
  return i === -1 ? [path, ''] : [path.slice(0, i), path.slice(i)];
}

/** The page's internal (English) path from the address a visitor sees: ('fr', '/a-propos') → '/about'. */
export function internalPath(lang, path) {
  const [base, rest] = split(path);
  return (lang === 'fr' ? (FR_TO_INTERNAL[base] ?? base) : base) + rest;
}

/** Adds the language prefix and the language's own address: ('fr', '/about#approach') → '/fr/a-propos#approach'. */
export function localePath(lang, path = '/') {
  if (!path.startsWith('/')) return path;
  const [base, rest] = split(path);
  if (base === '/' || base === '') return `/${lang}${rest}`;
  return `/${lang}${lang === 'fr' ? (FR_PATHS[base] ?? base) : base}${rest}`;
}
