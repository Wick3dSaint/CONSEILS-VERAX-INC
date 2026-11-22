/**
 * French writes the first day of a month as « 1er » (lundi 1er mars), which Intl date
 * formatting does not do. Apply to any long French date; other languages pass through.
 */
export function frenchFirst(locale, text) {
  return locale.startsWith('fr') ? text.replace(/(^|\s)1(?= \p{L})/u, '$11er') : text;
}

/** Intl.DateTimeFormat with the French « 1er » applied to its output. */
export function longDateFormat(locale, options) {
  const f = new Intl.DateTimeFormat(locale, options);
  return { format: (date) => frenchFirst(locale, f.format(date)) };
}
