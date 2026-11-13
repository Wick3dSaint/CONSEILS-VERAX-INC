#!/usr/bin/env node
/**
 * npm run i18n:check
 *
 * 1. Verifies lib/content/fr.js has exactly the same structure as lib/content/en.js
 *    (same keys and list lengths; ids, icons, links and other non-text values identical).
 * 2. Lists every French string still marked pending(…) and writes TRANSLATIONS.md.
 * Exits with an error if the structures differ.
 */
import { writeFile } from 'node:fs/promises';
import en from '../lib/content/en.js';
import fr from '../lib/content/fr.js';
import { PENDING } from '../lib/content/pending.js';

// Values that must be identical in both languages (not words).
const STRUCTURAL = new Set(['id', 'icon', 'href', 'part', 'pairs', 'numeral', 'titleLang', 'word']);
const STRUCTURAL_PATHS = new Set(['site.email', 'site.phone']);
// Rich text (string / { em } parts) may legitimately differ in length between languages.
const RICH_TEXT = new Set(['etymology']);
// Intentionally different per language.
const EXEMPT = new Set(['site.locale', 'ui.otherLanguage.code', 'ui.otherLanguage.label', 'ui.otherLanguage.ariaLabel']);

const problems = [];
const pendingItems = [];

function walk(a, b, path) {
  const key = path.split('.').at(-1).replace(/\[\d+\]$/, '');
  if (EXEMPT.has(path)) return;
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return problems.push(`${path}: should be a list`);
    if (RICH_TEXT.has(key)) return;
    if (a.length !== b.length) return problems.push(`${path}: ${a.length} items in English, ${b.length} in French`);
    a.forEach((item, i) => walk(item, b[i], `${path}[${i}]`));
    return;
  }
  if (a && typeof a === 'object') {
    if (!b || typeof b !== 'object') return problems.push(`${path}: missing in French`);
    for (const k of Object.keys(a)) {
      if (!(k in b)) problems.push(`${path}.${k}: missing in French`);
      else walk(a[k], b[k], path ? `${path}.${k}` : k);
    }
    for (const k of Object.keys(b)) if (!(k in a)) problems.push(`${path}.${k}: only in French`);
    return;
  }
  if ((STRUCTURAL.has(key) || STRUCTURAL_PATHS.has(path)) && a !== b) problems.push(`${path}: must match English ("${a}" ≠ "${b}")`);
  if (typeof b === 'string' && PENDING.has(b)) pendingItems.push({ path, english: b });
}

walk(en, fr, '');

const where = (path) =>
  path
    .replace(/^services\[(\d)\]/, (_, i) => `Service: ${en.services[i].title} ›`)
    .replace(/\[(\d+)\]/g, (_, i) => ` #${Number(i) + 1}`);

// One item per distinct English text: a single translation fills every place it appears.
const groups = new Map();
for (const p of pendingItems) {
  if (!groups.has(p.english)) groups.set(p.english, []);
  groups.get(p.english).push(where(p.path));
}
const cell = (text) => text.replace(/\|/g, '\\|');
const rows = [...groups].map(([english, places], i) => {
  const suggestions = [...PENDING.get(english)].join(' — or — ') || '—';
  return `| ${i + 1} | ${cell(english)} | ${cell(suggestions)} | ${places.join('<br>')} |`;
});
const md = `# French translations to confirm

The French version of the site shows the **English** text for each item below until the firm
provides its own translation, so nothing on the site is a guess. The suggestions are
**unverified**: they are never shown on the site. Reply with the item number and the approved
French (or "accept" to use the suggestion).

To finish an item: in \`lib/content/fr.js\`, replace its whole \`pending(…)\` call with the approved
French text, then run \`npm run i18n:check\` to update this list.

${groups.size} item(s) pending (${pendingItems.length} places on the site).

| # | English (shown for now) | Suggested French (unverified) | Where it appears (lib/content/fr.js) |
| --- | --- | --- | --- |
${rows.join('\n')}
`;
await writeFile(new URL('../TRANSLATIONS.md', import.meta.url), md);

if (problems.length) {
  console.error(`✗ French content does not match the English structure:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ Structure matches. ${groups.size} French item(s) pending (${pendingItems.length} places) — see TRANSLATIONS.md.`);
