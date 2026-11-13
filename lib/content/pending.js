/**
 * Marks French text that is waiting for the firm's own translation.
 *
 *   pending('English text', 'Suggested French (unverified)')
 *
 * Until it is replaced, the site shows the ENGLISH text, so nothing on the site is a guess.
 * The suggestion is never displayed: it only appears in TRANSLATIONS.md
 * (regenerate with `npm run i18n:check`) for the firm to accept or correct.
 *
 * To finish an item, replace the whole pending(…) call with the approved French string.
 */
export const PENDING = new Map();

export function pending(english, suggestion = '') {
  if (!PENDING.has(english)) PENDING.set(english, new Set());
  if (suggestion) PENDING.get(english).add(suggestion);
  return english;
}
