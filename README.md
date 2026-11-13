# Conseils Verax Inc. — website

Marketing website for **Conseils Verax Inc.**, a Canadian accounting and advisory firm.
*Verax* is Latin for *truthful*; the mark is a spirit level at rest: "On the level."

Built with **Next.js 16 (App Router)**, **React 19** and JavaScript, styled with a single plain-CSS file
(`app/globals.css`), in French and English. It has no Tailwind and no UI libraries. Its extra dependencies are `nodemailer` (sends email through your own mailbox) and `mysql2` (stores bookings in your Hostinger database).

## Running the site

Requires **Node.js 20.9 or later**.

```bash
npm install
```

```bash
npm run dev
```

The development server runs at http://localhost:3000.

To build and serve a production version:

```bash
npm run build
```

```bash
npm start
```

The Inter font is downloaded from Google Fonts **at build time** by `next/font` and then self-hosted, so
visitors' browsers never contact Google. The build machine needs internet access.

## Where things live

| What | Where |
| --- | --- |
| **English copy** (all text, services, navigation, form messages) | `lib/content/en.js` |
| **French copy** (same structure) | `lib/content/fr.js` |
| French items awaiting the firm's translation | `TRANSLATIONS.md` (generated) |
| Language helpers (URLs, metadata, dictionaries) | `lib/i18n.js` |
| Language choice for visitors (cookie → Québec IP → browser → English) | `proxy.js` |
| Québec IP ranges and lookup | `lib/geo/quebec-ranges.json`, `lib/geo/quebec.js` |
| Global styles and design tokens (colours, radii, type scale) | `app/globals.css` (top of file) |
| Pages (one file serves both languages) | `app/[lang]/page.js` (home), `app/[lang]/services`, `…/approach`, `…/clients`, `…/contact` |
| Contact form (browser side) | `components/ContactForm.js` |
| Contact form endpoint | `app/api/contact/route.js` (email sending: `lib/mailer.js`) |
| Form validation, shared by the form and the endpoint | `lib/validation.js` |
| Logo mark (React component, colours as props) | `components/Logo.js` |
| Animated spirit level | `components/Level.js`, keyframes in `app/globals.css` |
| Language switcher | `components/LanguageSwitcher.js` |
| Online booking (rules, holidays, storage, emails) | `lib/booking/`, page `app/[lang]/book`, widget `components/BookingWidget.js` |
| Icons | `components/Icon.js` |
| Favicon | `app/icon.svg` |

To change any wording, edit `lib/content/en.js` (English) or `lib/content/fr.js` (French); you don't need to
touch the page files. Headlines with a grey second half are written as `{ lead, rest }`. The email and
phone are set once in `en.js` and reused by both languages.

Run `npm run i18n:check` after editing either file: it confirms the French file still matches the English
structure (so no text can go missing) and refreshes `TRANSLATIONS.md`.

## Languages

- Every page exists at `/fr/…` and `/en/…`. The **English**/**Français** button in the header switches to
  the same page in the other language and remembers the choice (a `lang` cookie, one year).
- Addresses without a language (`/`, `/services`, old links) are redirected by `proxy.js`:
  1. the visitor's saved choice, if any;
  2. **French for visitors in Québec**, located by IP address;
  3. otherwise their browser's preferred language, then English.
- Québec detection uses DB-IP's free *IP to City Lite* database (CC BY 4.0). Only the Québec ranges are
  kept, in `lib/geo/quebec-ranges.json`; visitor addresses are checked on our own server and never sent
  anywhere. It is approximate: VPNs and some mobile networks can be placed in the wrong province. The license
  requires the "IP Geolocation by DB-IP" link in the footer, so keep it.
- **Refresh the Québec ranges about once a month** (DB-IP releases monthly), then commit and push:

  ```bash
  npm run geo:update
  ```

- French text the firm hasn't approved yet is wrapped in `pending('English', 'suggestion')` in
  `lib/content/fr.js`. The English shows on the French pages until then. The suggestions are never shown.

## Online booking

Visitors book a free 30-minute first consultation at `/fr/book` or `/en/book`. Every "Book a consultation"
button points there.

- **Availability rules** live in `lib/booking/config.js`: slot times (10:00, 10:30, 16:00, 16:30), weekdays
  (Monday to Friday), notice (from tomorrow), how far ahead (4 weeks), and `extraClosedDates` for
  vacations. All times are Eastern Time (Montréal), with daylight saving handled automatically.
- **Québec public holidays** are closed automatically every year (`lib/booking/holidays.js`): New Year's
  Day, Good Friday, Easter Monday, National Patriots' Day, Fête nationale, Canada Day, Labour Day,
  Thanksgiving and Christmas.
- **No double bookings:** the database allows only one active booking per slot, even if two people confirm
  at the same instant. One upcoming booking per email address.
- **Emails** (sent from the mailbox in `SMTP_USER`):
  - the client gets a confirmation in their language, with a calendar invitation and a cancellation link;
  - you get a notification with a calendar entry;
  - on cancellation, both of you are notified and the calendar entry is withdrawn.
- **Video calls:** the site doesn't create video links. Send the client the link yourself before the
  meeting; the confirmation email tells them to expect it.
- **Storage:** a MySQL database on Hostinger, read from the `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` and
  `DB_PASSWORD` environment variables (Hostinger sets these when the database is created). The
  `bookings` table is created automatically. To see bookings, open the database in hPanel's phpMyAdmin.
  Cancelled bookings keep their row with `active` empty.
- If the database is unreachable, the page tells visitors to email or call instead.

## Pre-launch checklist

### 1. Replace placeholders ✅ done

All four are in the `site` object at the top of `lib/content/en.js`:

- [x] `[YOUR EMAIL]`: footer, home page, contact sidebar, and the contact form's error message
- [x] `[YOUR PHONE]`: footer, home page, contact sidebar
- [x] `[YOUR HOURS]`: contact sidebar ("Office hours")
- [x] `[YOUR RESPONSE TIME]`: the contact form's success message and the "What happens next" card

To confirm nothing is left, run this; it should print nothing:

```bash
grep -rn "\[YOUR" app components lib
```

### 2. Verify the [CONFIRM] items ✅ done (all three kept)

These services are listed on the site but need the firm's confirmation. Delete the ` [CONFIRM]` marker
once each one is verified, or remove the item if you don't offer it.

- [x] Tax Preparation: "Support with tax authority notices"
- [x] Tax Planning: "Owner remuneration planning"
- [x] Fractional Controller: "A regular review meeting with you"

To check for any that remain:

```bash
grep -rn "CONFIRM" lib/content
```

Also have someone at the firm read **every** service description and "What's included" list, so the site
promises only what the firm delivers. The brand promise depends on it.

### 3. Turn on contact-form email

The form emails each enquiry to your mailbox through Hostinger's mail server (`lib/mailer.js`). Email
stays **off** until the mailbox credentials are set; until then enquiries are only written to the server
log and nobody is notified.

- [ ] In hPanel, open **Websites → conseilsverax.ca → Node.js → Environment variables** and add:

  | Key | Value |
  | --- | --- |
  | `SMTP_USER` | the sending mailbox, e.g. `jli@conseilsverax.ca` |
  | `SMTP_PASS` | that mailbox's password |
  | `CONTACT_TO_EMAIL` | *optional*: deliver to a different address (default: `SMTP_USER`) |

  `SMTP_HOST` (default `smtp.hostinger.com`) and `SMTP_PORT` (default `465`, SSL; use `587` for
  STARTTLS) only need setting if you use another mail provider. Never commit real values to Git.
- [ ] Submit a test enquiry on the live site and confirm the email arrives. Pressing **Reply** answers
      the visitor directly.
- [ ] If the visitor sees "The message didn't go through", check the app's runtime logs in hPanel for
      `[contact] Email delivery failed` (usually a wrong password).
- [ ] Consider rate limiting the endpoint. A hidden "honeypot" field already filters out simple bots.
- [ ] Enquiries contain personal information. Once email works, the server log keeps only a timestamp.
      Check how long your mailbox keeps enquiries, and who can read them, against your privacy
      obligations. *Québec's privacy law (often called Law 25) may apply. Please confirm with a qualified
      adviser.*

### 4. French version ✅ done

- [x] French pages at `/fr/…`, language switcher, Québec visitors see French first.
- [x] All French items approved by the firm (`TRANSLATIONS.md` lists none pending). For new text, use
      `pending('English', 'suggestion')` in `lib/content/fr.js` until it is approved.
- [ ] Have a professional translator review the French copy. *A French version is very likely required for a
      Québec business under the Charter of the French language; please confirm the exact requirements with a
      qualified adviser.*
- [ ] Optional: French web addresses (e.g. `/fr/approche` instead of `/fr/approach`). The addresses are
      currently the same English words in both languages.

### 5. Before going live

- [x] Domain set as `metadataBase` (`SITE_URL` in `lib/i18n.js`); each page lists its French and English
      versions for search engines. Consider adding `app/sitemap.js` and `app/robots.js`.
- [ ] Optionally add a social-share image (`app/opengraph-image.png`).
- [ ] Check the site on a real phone, and with a screen reader if possible.
- [ ] Note: the © year in the footer is set when the site is built. Rebuild at least once a year, or after
      January 1.
- [ ] Refresh the Québec IP ranges monthly: `npm run geo:update`, then commit and push.

## Design notes

- **Tokens:** ink `#1d1d1f`, secondary text `#424245`, muted `#6e6e73` (`#a1a1a6` on dark), paper
  `#f5f5f7`, hairline `#d2d2d7`, Verity green `#0a6e5c` (hover `#07493d`), bubble mint `#5fd3b3`
  (on dark backgrounds only). Two additions that weren't in the original token list: error red `#b42318`,
  and form-field borders in `#86868b`, because `#d2d2d7` is too faint for input outlines (WCAG asks for
  3:1).
- **Radii:** panels 28px, cards 22px, inner boxes 20px, pills 980px. The content column is 1040px wide
  with 22px side padding.
- **Motion:** the only motion is the spirit-level animation (runs once on page load: 5s, `ease-in-out`,
  0.5s delay), one fade-up entrance per hero, and gentle card scaling on hover. All of it is turned off
  when the visitor's system asks for reduced motion.
- **Accessibility:** a skip link, semantic landmarks, `aria-current` on the active navigation link, visible
  focus rings, labelled SVGs, form errors linked to their fields with `aria-describedby`, and focus moved
  to the first invalid field. Text meets 4.5:1 contrast.
- **Service links:** each service's call-to-action button opens the contact form with that service already
  selected (for example `/contact?service=tax-prep`).
