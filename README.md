# Conseils Verax Inc. — website

Marketing website for **Conseils Verax Inc.**, a Canadian accounting and advisory firm.
*Verax* is Latin for *truthful*; the mark is a spirit level at rest: "On the level."

Built with **Next.js 16 (App Router)**, **React 19** and JavaScript, styled with a single plain-CSS file
(`app/globals.css`). It has no Tailwind, no UI libraries and no third-party services.

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
| **All copy** (text, placeholders, services, navigation, form messages) | `lib/content.js` |
| Global styles and design tokens (colours, radii, type scale) | `app/globals.css` (top of file) |
| Pages | `app/page.js` (home), `app/services`, `app/approach`, `app/clients`, `app/contact` |
| Contact form (browser side) | `components/ContactForm.js` |
| Contact form endpoint | `app/api/contact/route.js` |
| Form validation, shared by the form and the endpoint | `lib/validation.js` |
| Logo mark (React component, colours as props) | `components/Logo.js` |
| Animated spirit level | `components/Level.js`, keyframes in `app/globals.css` |
| Icons | `components/Icon.js` |
| Favicon | `app/icon.svg` |
| Page titles and descriptions | the `metadata` export at the top of each `page.js` (text in `lib/content.js`) |

To change any wording, edit `lib/content.js`; you don't need to touch the page files. Headlines with a grey
second half are written as `{ lead, rest }`. The email, phone, hours and response time are set **once**
in the `site` object at the top of the file and reused everywhere.

Once you replace `[YOUR EMAIL]` and `[YOUR PHONE]`, they turn into clickable `mailto:` and `tel:` links
automatically.

## Pre-launch checklist

### 1. Replace placeholders

All four are in the `site` object at the top of `lib/content.js`:

- [ ] `[YOUR EMAIL]`: footer, home page, contact sidebar, and the contact form's error message
- [ ] `[YOUR PHONE]`: footer, home page, contact sidebar
- [ ] `[YOUR HOURS]`: contact sidebar ("Office hours")
- [ ] `[YOUR RESPONSE TIME]`: the contact form's success message and the "What happens next" card

To confirm nothing is left, run this; it should print nothing:

```bash
grep -rn "\[YOUR" app components lib
```

### 2. Verify the [CONFIRM] items

These services are listed on the site but need the firm's confirmation. Delete the ` [CONFIRM]` marker
once each one is verified, or remove the item if you don't offer it.

- [ ] Tax Preparation: "Support with tax authority notices"
- [ ] Tax Planning: "Owner remuneration planning"
- [ ] Fractional Controller: "A regular review meeting with you"

To check for any that remain:

```bash
grep -rn "CONFIRM" lib/content.js
```

Also have someone at the firm read **every** service description and "What's included" list, so the site
promises only what the firm delivers. The brand promise depends on it.

### 3. Connect the contact form

Right now `POST /api/contact` validates each enquiry and **only writes it to the server log**. Nobody is
notified. Before launch:

- [ ] Choose a delivery method (an email service, a CRM, or an automation webhook).
- [ ] Set `CONTACT_WEBHOOK_URL` (see `.env.example`) in your hosting provider's environment settings, or in
      `.env.local` for local testing. Never commit real secrets.
- [ ] Finish the `TODO` in `app/api/contact/route.js`; a commented example is included.
- [ ] Submit a test enquiry on the live site and confirm it arrives.
- [ ] Consider rate limiting the endpoint. A hidden "honeypot" field already filters out simple bots.
- [ ] Enquiries contain personal information. Check how long your server logs keep them, and who can
      read them, against your privacy obligations. *Québec's privacy law (often called Law 25) may apply.
      Please confirm with a qualified adviser.*

### 4. Add a French version

For a business based in Québec, a French version of the website is very likely required under the
*Charter of the French language*. It is also what many clients will expect. *I'm not certain of the exact
current requirements, so please confirm them with a qualified adviser.*

Suggested approach:

- [ ] Translate `lib/content.js` into a French copy (for example `lib/content.fr.js`). Every visible string
      on the site, form messages included, lives there.
- [ ] Add French routes, such as an `app/[lang]/` segment, or follow the internationalisation guide in
      `node_modules/next/dist/docs/01-app/02-guides/`. Set `<html lang="fr-CA">` on French pages.
- [ ] Add a language switcher to the header, and `alternates.languages` to each page's `metadata`.
- [ ] Have a professional translator review the copy, including the brand line *"True to our word. True to
      your numbers."*

### 5. Before going live

- [ ] Add your domain as `metadataBase` in `app/layout.js` (needed for social-share images and canonical
      URLs), and consider adding `app/sitemap.js` and `app/robots.js`.
- [ ] Optionally add a social-share image (`app/opengraph-image.png`).
- [ ] Check the site on a real phone, and with a screen reader if possible.
- [ ] Note: the © year in the footer is set when the site is built. Rebuild at least once a year, or after
      January 1.

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
