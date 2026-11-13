/**
 * All site copy lives in this file, so it can be edited or translated in one place.
 *
 * - Placeholders in [SQUARE BRACKETS] must be replaced before launch. Most are set
 *   once in `site` below and reused everywhere else.
 * - Items marked [CONFIRM] must be verified by the firm before launch.
 * - Headlines with a grey second half are written as { lead, rest }.
 * - Rich text can be an array of strings and { em, lang } parts (rendered as <em>).
 */

export const site = {
  name: 'Conseils Verax',
  legalName: 'Conseils Verax Inc.',
  locale: 'en-CA',
  description:
    'Conseils Verax is a Canadian accounting and advisory firm. Tax preparation, tax planning, fractional controller, advisory and bookkeeping services — with honest answers and fees in plain sight.',
  email: 'jli@conseilsverax.ca',
  phone: '514-224-7948',
  hours: '10 a.m. to 5 p.m. ET',
  responseTime: 'two business days',
  area: 'Serving clients across Canada',
  signoff: 'True to our word. True to your numbers.',
};

export const ui = {
  skipLink: 'Skip to main content',
  homeLabel: 'Conseils Verax, home',
  mainNavLabel: 'Main',
  learnMore: 'Learn more',
  levelLabel: 'A spirit level whose bubble swings from side to side, then settles exactly in the centre.',
};

export const navigation = {
  links: [
    { href: '/services', label: 'Services' },
    { href: '/approach', label: 'Approach' },
    { href: '/clients', label: 'Clients' },
    { href: '/contact', label: 'Contact' },
  ],
  cta: { href: '/contact', label: 'Book a consultation' },
};

/** Always in this order. */
export const services = [
  {
    id: 'tax-prep',
    icon: 'document',
    title: 'Tax Preparation',
    shortLabel: 'Tax Preparation',
    eyebrow: 'Individuals & corporations',
    summary:
      'Accurate, compliant returns — including GST, HST and QST filings — with every lawful deduction and credit applied.',
    body: 'Accurate, compliant returns for individuals and corporations — including GST, HST and QST sales-tax filings — with every lawful deduction and credit applied to minimize what you owe. Nothing more, nothing less.',
    included: [
      'Personal income tax returns, federal and Québec',
      'Corporate income tax returns',
      'GST/HST and QST filings',
      'Review of eligible deductions and credits',
      'Support with tax authority notices',
    ],
    bestFor: 'anyone who wants their return done right the first time — and to understand what was filed.',
    cta: 'Discuss your return',
  },
  {
    id: 'tax-planning',
    icon: 'calendar',
    title: 'Tax Planning',
    shortLabel: 'Tax Planning',
    eyebrow: 'Year-round',
    summary:
      'Proactive strategy — from corporate reorganisations to structuring your affairs so you keep more of what you earn.',
    body: 'Proactive tax strategy, all year — from corporate reorganisations to structuring your affairs so you keep more of what you earn. We’ll also tell you when a strategy isn’t worth its cost.',
    included: [
      'Year-round tax strategy reviews',
      'Corporate reorganisations',
      'Owner remuneration planning',
      'Structuring personal and business affairs',
      'Timing of major decisions around tax impact',
    ],
    bestFor: 'business owners and individuals whose situation is changing — growth, a sale, a new structure.',
    cta: 'Plan ahead with us',
  },
  {
    id: 'controller',
    icon: 'chart',
    title: 'Fractional Controller',
    shortLabel: 'Fractional Controller',
    eyebrow: 'Without a full-time hire',
    summary:
      'Month-end close, management reporting, budgeting and cash-flow forecasting, scaled to your business.',
    body: 'Controller-level oversight without a full-time hire — scaled to exactly what your business needs, and nothing it doesn’t.',
    included: [
      'Month-end close',
      'Management reporting',
      'Budgeting',
      'Cash-flow forecasting',
      'A regular review meeting with you',
    ],
    bestFor: 'growing companies that need senior financial oversight before they need a full-time controller.',
    cta: 'Talk about oversight',
  },
  {
    id: 'advisory',
    icon: 'compass',
    title: 'Advisory Services',
    shortLabel: 'Advisory',
    eyebrow: 'Strategy',
    summary: 'Financing plans, business valuations, scaling up or navigating a major transaction.',
    body: 'Management consulting and strategic guidance tailored to your goals. Our opinion is independent — we’ll tell you if the plan doesn’t add up, even when it’s yours.',
    included: [
      'Financing plans',
      'Business valuations',
      'Scaling and growth strategy',
      'Support through major transactions',
      'Management consulting',
    ],
    bestFor: 'owners facing a big decision who want an adviser with no stake in the answer.',
    cta: 'Get a straight opinion',
  },
  {
    id: 'bookkeeping',
    icon: 'book',
    title: 'Bookkeeping',
    shortLabel: 'Bookkeeping',
    eyebrow: 'A real-time picture',
    summary: 'Clean, current records — so every decision rests on numbers you can trust.',
    body: 'Clean, current records that give you a real-time picture of your finances — so every decision rests on numbers you can trust. Books that balance are books that tell the truth.',
    included: [
      'Recording and categorizing transactions',
      'Bank and credit card reconciliations',
      'Payables and receivables tracking',
      'Regular financial statements',
      'Year-end files ready for tax',
    ],
    bestFor: 'small businesses and self-employed people who’d rather run the business than chase receipts.',
    cta: 'Get your books in order',
  },
];

export const serviceById = Object.fromEntries(services.map((s) => [s.id, s]));

/** Used on the home page and on /clients. `pairs` are service ids. */
export const clientSegments = [
  {
    id: 'corporations',
    icon: 'building',
    title: 'Corporations',
    text: 'From owner-managed companies to growing enterprises: compliance handled, controls tested, and a clear view of where the business really stands.',
    pairs: ['controller', 'tax-planning'],
  },
  {
    id: 'self-employed',
    icon: 'briefcase',
    title: 'Self-employed & entrepreneurs',
    text: 'Freelancers, consultants, professionals and sole proprietors: clean books, sales-tax filings on time, a return that captures every deduction you’re entitled to — and honest advice on when to incorporate and how to finance growth.',
    pairs: ['bookkeeping', 'tax-prep', 'advisory'],
  },
  {
    id: 'individuals',
    icon: 'person',
    title: 'Individuals',
    text: 'Personal returns done accurately, explained plainly, and planned ahead — so tax season holds no surprises.',
    pairs: ['tax-prep', 'tax-planning'],
  },
];

/** The three parts of the mark and what each one stands for. */
export const markParts = [
  { part: 'vial', title: 'The vial', text: 'A steady frame — structure and discipline.' },
  { part: 'lines', title: 'The two lines', text: 'What we say and what we do — always the same distance apart.' },
  { part: 'bubble', title: 'The bubble', text: 'The truth — at rest in the centre.' },
];

export const footer = {
  servicesHeading: 'Services',
  firmHeading: 'The firm',
  firmLinks: [
    { href: '/approach', label: 'Our approach' },
    { href: '/clients', label: 'Who we serve' },
    { href: '/contact', label: 'Contact' },
  ],
  contactHeading: 'Contact',
  rights: 'All rights reserved.',
};

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

export const home = {
  meta: {
    title: 'Conseils Verax · Accounting, tax and advisory in Canada',
    description: site.description,
  },
  hero: {
    title: { lead: 'Verax.', rest: 'The truthful way to run your finances.' },
    rows: [
      {
        icon: 'chat',
        text: 'Prefer a real conversation?',
        link: { href: '/contact#reach-us', label: 'Talk to us directly' },
      },
      {
        icon: 'calendar',
        text: 'No-obligation first meeting.',
        link: { href: '/contact', label: 'Book a consultation' },
      },
    ],
  },
  serviceRowLabel: 'Our services',
  feature: {
    label: 'From the Latin',
    word: 'verax',
    partOfSpeech: 'adj.',
    line: {
      lead: 'Truthful. Speaking the truth.',
      rest: 'We chose the word as our name — and as a promise we can be held to.',
    },
    caption: 'Like a level at rest, our advice shows you exactly where things stand — not where you hoped they would.',
    link: { href: '/approach', label: 'Discover our approach' },
  },
  servicesBand: {
    title: { lead: 'Services.', rest: 'Five ways to see your numbers clearly.' },
    scrollerLabel: 'Services, scroll horizontally for more',
  },
  promise: {
    title: { lead: 'The Verax promise.', rest: 'Three things you can hold us to.' },
    items: [
      {
        numeral: 'I',
        title: 'We say what we’ll do. Then we do it.',
        text: 'Deadlines, deliverables and fees happen as stated. If anything changes, you hear it from us first — early.',
      },
      {
        numeral: 'II',
        title: 'You hear the truth — even the unwelcome parts.',
        text: 'Honest diagnosis first. Good advice is impossible without it.',
      },
      {
        numeral: 'III',
        title: 'Fees in plain sight. No surprises.',
        text: 'Scope and fees agreed before work begins. You always know what we’re doing and why.',
      },
    ],
    link: { href: '/approach', label: 'Read the full approach' },
  },
  serve: {
    title: { lead: 'Who we serve.', rest: 'The same attention, whatever your size.' },
  },
  help: {
    title: { lead: 'Help is here.', rest: 'Straight answers from a real person.' },
    consult: {
      eyebrow: 'No obligation',
      title: 'Book a first consultation.',
      text: 'Tell us where things stand. We’ll tell you honestly what you need — and what you don’t.',
      link: { href: '/contact', label: 'Get started' },
    },
    direct: {
      eyebrow: 'Across Canada',
      title: 'Reach us directly.',
      link: { href: '/contact', label: 'All contact options' },
    },
  },
};

export const approach = {
  meta: {
    title: 'Our approach',
    description:
      'Verax means truthful. Six written commitments and a five-step way of working — so you always know where things stand.',
  },
  hero: {
    eyebrow: 'Our approach',
    title: { lead: 'Verax means truthful.', rest: 'We built a firm around the word.' },
  },
  dictionary: {
    label: 'Latin · adjective',
    word: 'verax',
    forms: 'verax, veracis',
    senses: ['Truthful; speaking the truth.', 'Of a person: one who does not lie.'],
    etymology: [
      'From ',
      { em: 'verus', lang: 'la' },
      ', “true” — the same root behind ',
      { em: 'verify' },
      ', ',
      { em: 'verity' },
      ' and the French ',
      { em: 'vérité', lang: 'fr' },
      '. A firm that takes this name has to earn it on every file.',
    ],
  },
  level: {
    title: 'On the level.',
    perspectives: [
      { label: 'For a carpenter', text: '“True” means perfectly level. Nothing built on a crooked line stays standing.' },
      { label: 'In plain English', text: 'Someone “on the level” is honest with you. No angle, no spin.' },
      { label: 'For an accountant', text: 'The books balance. Every number sits exactly where it should.' },
      {
        label: 'In tax',
        text: 'A true return reports every dollar and claims every credit you’re entitled to. No more, no less.',
      },
      {
        label: 'In advisory',
        text: 'Level advice has no tilt. You hear what the numbers support, not what you hoped to hear.',
      },
    ],
    markIntro:
      'That’s why our mark is a spirit level at rest. It shows where things stand, not where we’d like them to be. Each part carries a meaning:',
  },
  commitments: {
    title: { lead: 'Six commitments.', rest: 'Written down, so you can hold us to them.' },
    intro:
      'Every engagement starts with listening — because the right advice depends entirely on understanding your circumstances. Then it runs on these.',
    items: [
      {
        numeral: 'I',
        title: 'Dictum, factum.',
        titleLang: 'la',
        subtitle: 'Said, done.',
        text: 'If we commit to a deadline, a deliverable or a fee, it happens as stated. If something changes, you hear it from us first — before it’s late, not after.',
      },
      {
        numeral: 'II',
        title: 'The whole truth, kindly told.',
        text: 'We tell you what your numbers actually say — including the parts you’d rather not hear. Comfortable advice that’s wrong costs more than an honest conversation.',
      },
      {
        numeral: 'III',
        title: 'Fees in plain sight.',
        text: 'Clear fees, clear communication, clear explanations. Scope and price are agreed before work begins. You always know what we’re doing and why.',
      },
      {
        numeral: 'IV',
        title: 'Precision first.',
        text: 'Every file gets meticulous attention to detail. Accuracy isn’t a standard we aim for — it’s the baseline we build from.',
      },
      {
        numeral: 'V',
        title: 'Proactive, all year.',
        text: 'We don’t wait for you to ask. Opportunities, risks and strategies are flagged throughout the year — not just at tax time.',
      },
      {
        numeral: 'VI',
        title: 'A partnership that compounds.',
        text: 'We invest in understanding your business and financial life deeply, so our advice gets sharper — and more valuable — every year.',
      },
    ],
  },
  steps: {
    title: { lead: 'How we work.', rest: 'Five steps, no fine print.' },
    items: [
      {
        title: 'We listen.',
        text: 'A no-obligation first consultation. You explain where things stand; we ask the questions that matter.',
      },
      {
        title: 'We tell you straight.',
        text: 'An honest read of what you need — and what you don’t. Sometimes that answer is “less than you think.”',
      },
      { title: 'We agree, in writing.', text: 'Scope, timeline and fee — set out clearly before any work begins.' },
      {
        title: 'We deliver as promised.',
        text: 'On time, as agreed. If a surprise turns up in your file, you hear about it the day we find it.',
      },
      {
        title: 'We stay level with you.',
        text: 'As your situation changes, we review the plan together and adjust it — never a fixed template.',
      },
    ],
  },
  pledge: {
    eyebrow: 'The Verax pledge',
    text: 'If we say it, we’ll do it. If we can’t, we’ll tell you — early.',
    cta: { href: '/contact', label: 'Book a consultation' },
  },
};

export const servicesPage = {
  meta: {
    title: 'Services',
    description:
      'Tax preparation, tax planning, fractional controller, advisory and bookkeeping services for individuals and businesses across Canada.',
  },
  hero: {
    eyebrow: 'Services',
    title: { lead: 'Comprehensive expertise.', rest: 'One firm, one honest picture.' },
    lead: 'From tax compliance to long-range strategy, Conseils Verax covers every dimension of your financial life — and tells you plainly which services you actually need.',
  },
  jumpLabel: 'Jump to a service',
  includedHeading: 'What’s included',
  bestForLabel: 'Best for:',
  closing: {
    title: 'Not sure which you need?',
    text: 'Tell us your situation. We’ll recommend only what makes sense, in plain language.',
    cta: { href: '/contact', label: 'Book a consultation' },
  },
};

export const clientsPage = {
  meta: {
    title: 'Who we serve',
    description:
      'Corporations, self-employed people and entrepreneurs, and individuals — the same attentive service and the same honest answers, tailored to your situation.',
  },
  hero: {
    eyebrow: 'Who we serve',
    title: { lead: 'Businesses and individuals.', rest: 'Equal dedication, either way.' },
    lead: 'Whether you’re self-employed or running a corporation, you get the same attentive, expert service — and the same honest answers — tailored precisely to your situation.',
  },
  pairedLabel: 'Often paired with',
  personal: {
    eyebrow: 'Personalised, always',
    title: { lead: 'No two clients are alike.', rest: 'Neither is their plan.' },
    text: 'Your income, your goals, your constraints — we shape a plan that fits only you, and reshape it honestly as your situation changes.',
  },
  closing: {
    title: 'Serving clients across Canada.',
    text: 'Wherever you are, the first conversation is free and carries no obligation.',
    cta: { href: '/contact', label: 'Book a consultation' },
  },
};

export const contactPage = {
  meta: {
    title: 'Contact',
    description:
      'Book a no-obligation consultation with Conseils Verax. Tell us where things stand — we’ll tell you honestly how we can help, and what it will cost.',
  },
  hero: {
    eyebrow: 'Contact',
    title: 'Let’s start with a straight conversation.',
    lead: 'Schedule a no-obligation consultation. Tell us where things stand — we’ll tell you honestly how we can help, and what it will cost.',
  },
  form: {
    label: 'Consultation request',
    fields: {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email address',
      clientType: 'I am a…',
      service: 'Service of interest',
      message: 'Message',
      optional: '(optional)',
      honeypot: 'Leave this field empty',
    },
    selectPrompt: 'Choose…',
    clientTypes: ['Individual / personal', 'Self-employed', 'Small business (SME)', 'Medium enterprise', 'Corporation'],
    notSure: 'Not sure yet',
    submit: 'Send message',
    sending: 'Sending…',
    privacy: 'We never share your information.',
    errors: {
      firstName: { required: 'Enter your first name.', tooLong: 'Your first name is too long.' },
      lastName: { required: 'Enter your last name.', tooLong: 'Your last name is too long.' },
      email: {
        required: 'Enter your email address.',
        invalid: 'Enter a valid email address, like name@example.com.',
        tooLong: 'Your email address is too long.',
      },
      message: { tooLong: 'Your message is too long. Please shorten it.' },
    },
    failure: `The message didn’t go through. Try again, or email us at ${site.email}.`,
    success: {
      title: 'Message sent.',
      text: `Thank you. We’ll reply within ${site.responseTime} — that’s a promise, not an estimate.`,
      again: 'Send another message',
    },
  },
  sidebar: {
    direct: { title: 'Reach us directly', hoursLabel: 'Office hours:' },
    where: { title: 'Where we work', text: 'Serving clients across Canada.' },
    next: {
      title: 'What happens next',
      text: `We reply within ${site.responseTime} to set up a first conversation. No obligation, no sales pitch.`,
      link: { href: '/approach#how-we-work', label: 'How we work' },
    },
  },
};

export const notFoundPage = {
  meta: { title: 'Page not found' },
  title: { lead: 'Page not found.', rest: 'This page doesn’t exist, or it has moved.' },
  link: { href: '/', label: 'Back to the home page' },
};
