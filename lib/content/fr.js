/**
 * FRENCH copy (Québec). Same structure as lib/content/en.js — `npm run i18n:check` verifies it.
 *
 * - Text wrapped in pending('English', 'suggestion') is waiting for the firm's approved
 *   translation: the English shows on the site until then. See TRANSLATIONS.md.
 * - Typography: a non-breaking space ( ) goes before a colon and inside « guillemets ».
 * - Structural values (ids, icons, links, service pairings) come from the English file,
 *   so only words live here.
 */
import en from './en.js';
import { pending } from './pending.js';

const site = {
  name: 'Conseils Verax',
  legalName: 'Conseils Verax Inc.',
  locale: 'fr-CA',
  description: 'Conseils Verax est un cabinet canadien de comptabilité et de services-conseils. Déclaration d’impôt, planification fiscale, contrôleur à temps partiel, services-conseils et tenue de livres — avec des réponses honnêtes et des honoraires transparents.',
  email: en.site.email,
  phone: en.site.phone,
  hours: '10 h à 17 h (HE)',
  responseTime: 'deux jours ouvrables',
  area: 'Au service de clients partout au Canada',
  signoff: 'Fidèles à notre parole. Fidèles à vos chiffres.',
};

const ui = {
  skipLink: 'Passer au contenu principal',
  homeLabel: 'Conseils Verax, accueil',
  mainNavLabel: 'Navigation principale',
  learnMore: 'En savoir plus',
  levelLabel: 'Un niveau à bulle dont la bulle oscille d’un côté à l’autre, puis s’immobilise exactement au centre.',
  otherLanguage: { code: 'en', label: 'English', ariaLabel: 'View this page in English' },
};

const navigation = {
  links: [
    { href: '/services', label: 'Services' },
    { href: '/approach', label: 'Approche' },
    { href: '/clients', label: 'Clientèle' },
    { href: '/contact', label: 'Contact' },
  ],
  cta: { href: '/book', label: 'Réserver une consultation' },
};

/** Words only, by service id; ids and icons come from en.js. */
const serviceText = {
  'tax-prep': {
    title: 'Déclaration d’impôt',
    shortLabel: 'Déclaration d’impôt',
    eyebrow: 'Particuliers et sociétés',
    summary:
      'Des déclarations exactes et conformes — y compris les déclarations de TPS, de TVH et de TVQ — où chaque déduction et chaque crédit permis par la loi sont appliqués.',
    body: 'Des déclarations exactes et conformes pour les particuliers et les sociétés — y compris les déclarations de taxes de vente (TPS, TVH et TVQ) — où chaque déduction et chaque crédit permis par la loi sont appliqués pour réduire au minimum ce que vous devez. Rien de plus, rien de moins.',
    included: [
      'Déclarations de revenus des particuliers, fédérales et du Québec',
      'Déclarations de revenus des sociétés',
      'Déclarations de TPS/TVH et de TVQ',
      'Examen des déductions et des crédits admissibles',
      'Accompagnement lors des avis des autorités fiscales',
    ],
    bestFor: 'toute personne qui veut que sa déclaration soit bien faite du premier coup — et comprendre ce qui a été produit.',
    cta: 'Parler de votre déclaration',
  },
  'tax-planning': {
    title: 'Planification fiscale',
    shortLabel: 'Planification fiscale',
    eyebrow: 'Toute l’année',
    summary: 'Une stratégie proactive — des réorganisations de sociétés à la structuration de vos affaires, pour conserver une plus grande part de ce que vous gagnez.',
    body: 'Une stratégie fiscale proactive, toute l’année — des réorganisations de sociétés à la structuration de vos affaires, pour conserver une plus grande part de ce que vous gagnez. Nous vous dirons aussi quand une stratégie ne vaut pas ce qu’elle coûte.',
    included: [
      'Examens de stratégie fiscale tout au long de l’année',
      'Réorganisations de sociétés',
      'Planification de la rémunération du propriétaire-dirigeant',
      'Structuration de vos affaires personnelles et d’entreprise',
      'Choix du moment des décisions importantes selon leur incidence fiscale',
    ],
    bestFor: 'les propriétaires d’entreprise et les particuliers dont la situation évolue — croissance, vente, nouvelle structure.',
    cta: 'Planifier avec nous',
  },
  controller: {
    title: 'Contrôleur à temps partiel',
    shortLabel: 'Contrôleur à temps partiel',
    eyebrow: 'Sans embauche à temps plein',
    summary: 'Clôture mensuelle, rapports de gestion, budgétisation et prévisions de trésorerie, adaptés à votre entreprise.',
    body: 'Une supervision financière de niveau contrôleur, sans embauche à temps plein — ajustée exactement à ce dont votre entreprise a besoin, sans rien de superflu.',
    included: [
      'Clôture mensuelle',
      'Rapports de gestion',
      'Budgétisation',
      'Prévisions de trésorerie',
      'Une rencontre de suivi régulière avec vous',
    ],
    bestFor: 'les entreprises en croissance qui ont besoin d’une supervision financière chevronnée avant d’avoir besoin d’un contrôleur à temps plein.',
    cta: 'Parler de supervision',
  },
  advisory: {
    title: 'Services-conseils',
    shortLabel: 'Services-conseils',
    eyebrow: 'Stratégie',
    summary: 'Plans de financement, évaluations d’entreprise, croissance ou accompagnement lors d’une transaction importante.',
    body: 'Du conseil en gestion et des orientations stratégiques adaptés à vos objectifs. Notre opinion est indépendante — nous vous dirons si le plan ne tient pas la route, même si c’est le vôtre.',
    included: [
      'Plans de financement',
      'Évaluations d’entreprise',
      'Stratégie de croissance et d’expansion',
      'Accompagnement lors de transactions importantes',
      'Conseil en gestion',
    ],
    bestFor: 'les propriétaires devant une décision importante qui veulent un conseiller sans intérêt dans l’issue.',
    cta: 'Obtenir un avis franc',
  },
  bookkeeping: {
    title: 'Tenue de livres',
    shortLabel: 'Tenue de livres',
    eyebrow: 'Un portrait en temps réel',
    summary: 'Des dossiers propres et à jour — pour que chaque décision repose sur des chiffres fiables.',
    body: 'Des dossiers propres et à jour qui vous donnent un portrait en temps réel de vos finances — pour que chaque décision repose sur des chiffres fiables. Des livres fiables sont des livres qui disent la vérité.',
    included: [
      'Saisie et classement des opérations',
      'Conciliations bancaires et de cartes de crédit',
      'Suivi des comptes fournisseurs et des comptes clients',
      'États financiers périodiques',
      'Dossiers de fin d’année prêts pour l’impôt',
    ],
    bestFor: 'les petites entreprises et les travailleurs autonomes qui préfèrent gérer leur entreprise plutôt que courir après les reçus.',
    cta: 'Mettre de l’ordre dans vos livres',
  },
};
const services = en.services.map((s) => ({ ...s, ...serviceText[s.id] }));

const clientText = {
  corporations: {
    title: 'Sociétés',
    text: 'Des entreprises dirigées par leur propriétaire aux entreprises en pleine croissance : une conformité assurée, des contrôles vérifiés et une vision claire de la situation réelle de l’entreprise.',
  },
  'self-employed': {
    title: 'Travailleurs autonomes et entrepreneurs',
    text: 'Pigistes, consultants, professionnels et entreprises individuelles : des livres propres, des déclarations de taxes de vente produites à temps, une déclaration de revenus qui tient compte de chaque déduction à laquelle vous avez droit — et des conseils honnêtes sur le moment de vous constituer en société et la façon de financer votre croissance.',
  },
  individuals: {
    title: 'Particuliers',
    text: 'Des déclarations de revenus exactes, expliquées simplement et planifiées à l’avance — pour que la saison des impôts ne réserve aucune surprise.',
  },
};
const clientSegments = en.clientSegments.map((c) => ({ ...c, ...clientText[c.id] }));

const markText = {
  vial: { title: 'La fiole', text: 'Un cadre stable — structure et rigueur.' },
  lines: { title: 'Les deux lignes', text: 'Ce que nous disons et ce que nous faisons — toujours à la même distance.' },
  bubble: { title: 'La bulle', text: 'La vérité — au repos, au centre.' },
};
const markParts = en.markParts.map((m) => ({ ...m, ...markText[m.part] }));

const footer = {
  servicesHeading: 'Services',
  firmHeading: 'Le cabinet',
  firmLinks: [
    { href: '/approach', label: 'Notre approche' },
    { href: '/clients', label: 'Notre clientèle' },
    { href: '/contact', label: 'Contact' },
  ],
  contactHeading: 'Contact',
  rights: 'Tous droits réservés.',
  geoAttribution: en.footer.geoAttribution, // license wording: not translated
};

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

const home = {
  meta: {
    title: 'Conseils Verax · Comptabilité, fiscalité et services-conseils au Canada',
    description: site.description,
  },
  hero: {
    title: {
      lead: 'Verax.',
      rest: 'La façon honnête de gérer vos finances.',
    },
    rows: [
      {
        icon: 'chat',
        text: 'Vous préférez une vraie conversation?',
        link: { href: '/contact#reach-us', label: 'Parlez-nous directement' },
      },
      {
        icon: 'calendar',
        text: 'Première rencontre sans engagement.',
        link: { href: '/book', label: 'Réserver une consultation' },
      },
    ],
  },
  serviceRowLabel: 'Nos services',
  feature: {
    label: 'Du latin',
    word: 'verax',
    partOfSpeech: 'adj.',
    line: {
      lead: 'Véridique. Qui dit la vérité.',
      rest: 'Nous avons choisi ce mot comme nom — et comme une promesse à laquelle vous pouvez nous tenir.',
    },
    caption:
      'Comme un niveau au repos, nos conseils vous montrent exactement où en sont les choses — et non où vous espériez qu’elles soient.',
    link: { href: '/approach', label: 'Découvrir notre approche' },
  },
  servicesBand: {
    title: { lead: 'Services.', rest: 'Cinq façons de voir clair dans vos chiffres.' },
    scrollerLabel: 'Services, faites défiler horizontalement pour en voir plus',
  },
  promise: {
    title: { lead: 'La promesse Verax.', rest: 'Trois engagements que vous pouvez exiger de nous.' },
    items: [
      {
        numeral: 'I',
        title: 'Nous disons ce que nous ferons. Puis nous le faisons.',
        text: 'Les échéances, les livrables et les honoraires sont respectés comme convenu. Si quelque chose change, vous l’apprenez de nous en premier — et tôt.',
      },
      {
        numeral: 'II',
        title: 'Vous entendez la vérité — même ce qui est difficile à entendre.',
        text: 'Un diagnostic honnête d’abord. De bons conseils sont impossibles sans lui.',
      },
      {
        numeral: 'III',
        title: 'Des honoraires transparents. Aucune surprise.',
        text: 'La portée du mandat et les honoraires sont convenus avant le début des travaux. Vous savez toujours ce que nous faisons et pourquoi.',
      },
    ],
    link: { href: '/approach', label: 'Lire notre approche complète' },
  },
  serve: {
    title: { lead: 'Notre clientèle.', rest: 'La même attention, quelle que soit votre taille.' },
  },
  help: {
    title: { lead: 'Nous sommes là pour vous aider.', rest: 'Des réponses franches, d’une vraie personne.' },
    consult: {
      eyebrow: 'Sans engagement',
      title: 'Réservez une première consultation.',
      text: 'Dites-nous où en sont les choses. Nous vous dirons honnêtement ce dont vous avez besoin — et ce dont vous n’avez pas besoin.',
      link: { href: '/book', label: 'Commencer' },
    },
    direct: {
      eyebrow: 'Partout au Canada',
      title: 'Joignez-nous directement.',
      link: { href: '/contact', label: 'Toutes les façons de nous joindre' },
    },
  },
};

const approach = {
  meta: {
    title: 'Notre approche',
    description:
      'Verax veut dire véridique. Six engagements écrits et une méthode de travail en cinq étapes — pour que vous sachiez toujours où en sont les choses.',
  },
  hero: {
    eyebrow: 'Notre approche',
    title: { lead: 'Verax veut dire véridique.', rest: 'Nous avons bâti un cabinet autour de ce mot.' },
  },
  dictionary: {
    label: 'Latin · adjectif',
    word: 'verax',
    forms: 'verax, veracis',
    senses: ['Véridique, qui dit la vérité.', 'En parlant d’une personne : qui ne ment pas.'],
    etymology: [
      'De ',
      { em: 'verus', lang: 'la' },
      ', « vrai » — la même racine que ',
      { em: 'vérité' },
      ', ',
      { em: 'véracité' },
      ' et ',
      { em: 'vérifier' },
      '. Un cabinet qui porte ce nom doit le mériter dans chaque dossier.',
    ],
  },
  level: {
    title: 'D’aplomb.',
    perspectives: [
      {
        label: 'Pour un charpentier',
        text: '«\u00a0D’aplomb\u00a0» veut dire parfaitement droit. Rien de ce qui est bâti de travers ne tient debout.',
      },
      {
        label: 'En langage simple',
        text: 'Une personne droite est honnête avec vous. Pas d’angle, sans artifice.',
      },
      { label: 'Pour un comptable', text: 'Les comptes sont équilibrés. Chaque chiffre est exactement à sa place.' },
      {
        label: 'En fiscalité',
        text: 'Une déclaration fidèle déclare chaque dollar et réclame chaque crédit auquel vous avez droit. Ni plus, ni moins.',
      },
      {
        label: 'En services-conseils',
        text: 'Un conseil d’aplomb ne penche d’aucun côté. Vous entendez ce que les chiffres appuient, pas ce que vous espériez entendre.',
      },
    ],
    markIntro:
      'C’est pourquoi notre emblème est un niveau à bulle au repos. Il montre où en sont les choses, et non où nous aimerions qu’elles soient. Chaque élément a sa signification :',
  },
  commitments: {
    title: { lead: 'Six engagements.', rest: 'Mis par écrit, pour que vous puissiez nous en tenir responsables.' },
    intro:
      'Chaque mandat commence par l’écoute — parce que les bons conseils dépendent entièrement de la compréhension de votre situation. Ensuite, il repose sur ces engagements.',
    items: [
      {
        numeral: 'I',
        title: 'Dictum, factum.',
        titleLang: 'la',
        subtitle: 'Aussitôt dit, aussitôt fait.',
        text: 'Si nous nous engageons sur une échéance, un livrable ou des honoraires, cela se concrétise comme convenu. Si quelque chose change, vous l’apprenez de nous en premier — avant qu’il ne soit trop tard, pas après.',
      },
      {
        numeral: 'II',
        title: 'Toute la vérité, avec tact.',
        text: 'Nous vous disons ce que vos chiffres disent réellement — y compris ce que vous préféreriez ne pas entendre. Un conseil rassurant mais erroné coûte plus cher qu’une conversation honnête.',
      },
      {
        numeral: 'III',
        title: 'Des honoraires transparents.',
        text: 'Des honoraires clairs, une communication claire, des explications claires. La portée du mandat et le prix sont convenus avant le début des travaux. Vous savez toujours ce que nous faisons et pourquoi.',
      },
      {
        numeral: 'IV',
        title: 'La précision d’abord.',
        text: 'Chaque dossier reçoit une attention méticuleuse aux détails. L’exactitude n’est pas un objectif que nous visons — c’est le point de départ sur lequel nous bâtissons.',
      },
      {
        numeral: 'V',
        title: 'Proactifs, toute l’année.',
        text: 'Nous n’attendons pas que vous le demandiez. Les occasions, les risques et les stratégies sont signalés tout au long de l’année — pas seulement en période d’impôts.',
      },
      {
        numeral: 'VI',
        title: 'Un partenariat qui prend de la valeur.',
        text: 'Nous prenons le temps de bien comprendre votre entreprise et votre vie financière, pour que nos conseils deviennent plus précis — et plus utiles — d’année en année.',
      },
    ],
  },
  steps: {
    title: { lead: 'Notre façon de travailler.', rest: 'Cinq étapes, sans petits caractères.' },
    items: [
      {
        title: 'Nous écoutons.',
        text: 'Une première consultation sans engagement. Vous nous expliquez où en sont les choses; nous posons les questions qui comptent.',
      },
      {
        title: 'Nous vous parlons franchement.',
        text: 'Une lecture honnête de ce dont vous avez besoin — et de ce dont vous n’avez pas besoin. Parfois, la réponse est « moins que vous le pensez ».',
      },
      {
        title: 'Nous convenons de tout, par écrit.',
        text: 'La portée, l’échéancier et les honoraires — clairement établis avant le début des travaux.',
      },
      {
        title: 'Nous livrons comme promis.',
        text: 'À temps, comme convenu. Si une surprise apparaît dans votre dossier, vous en êtes informé le jour même où nous la découvrons.',
      },
      {
        title: 'Nous restons francs avec vous.',
        text: 'À mesure que votre situation évolue, nous revoyons le plan ensemble et l’ajustons — jamais de modèle tout fait.',
      },
    ],
  },
  pledge: {
    eyebrow: 'L’engagement Verax',
    text: 'Si nous le disons, nous le ferons. Sinon, nous vous le dirons — tôt.',
    cta: { href: '/book', label: 'Réserver une consultation' },
  },
};

const servicesPage = {
  meta: {
    title: 'Services',
    description: 'Déclaration d’impôt, planification fiscale, contrôleur à temps partiel, services-conseils et tenue de livres pour les particuliers et les entreprises partout au Canada.',
  },
  hero: {
    eyebrow: 'Services',
    title: { lead: 'Une expertise complète.', rest: 'Un seul cabinet, un portrait honnête.' },
    lead: 'De la conformité fiscale à la stratégie à long terme, Conseils Verax couvre chaque aspect de votre vie financière — et vous dit clairement de quels services vous avez réellement besoin.',
  },
  jumpLabel: 'Aller à un service',
  includedHeading: 'Ce qui est inclus',
  bestForLabel: 'Idéal pour :',
  closing: {
    title: 'Vous ne savez pas de quoi vous avez besoin?',
    text: 'Décrivez-nous votre situation. Nous vous recommanderons seulement ce qui a du sens, en termes simples.',
    cta: { href: '/book', label: 'Réserver une consultation' },
  },
};

const clientsPage = {
  meta: {
    title: 'Notre clientèle',
    description:
      'Sociétés, travailleurs autonomes et entrepreneurs, et particuliers — le même service attentif et les mêmes réponses honnêtes, adaptés à votre situation.',
  },
  hero: {
    eyebrow: 'Notre clientèle',
    title: { lead: 'Entreprises et particuliers.', rest: 'Le même dévouement, dans les deux cas.' },
    lead: 'Que vous soyez travailleur autonome ou à la tête d’une société, vous recevez le même service attentif et expert — et les mêmes réponses honnêtes — adapté précisément à votre situation.',
  },
  pairedLabel: 'Souvent jumelé avec',
  personal: {
    eyebrow: 'Personnalisé, toujours',
    title: { lead: 'Il n’y a pas deux clients pareils.', rest: 'Ni deux plans pareils.' },
    text: 'Vos revenus, vos objectifs, vos contraintes — nous élaborons un plan qui convient à vous seul, et nous le revoyons honnêtement à mesure que votre situation évolue.',
  },
  closing: {
    title: 'Au service de clients partout au Canada.',
    text: 'Où que vous soyez, la première conversation est gratuite et sans engagement.',
    cta: { href: '/book', label: 'Réserver une consultation' },
  },
};

const contactPage = {
  meta: {
    title: 'Contact',
    description:
      'Réservez une consultation sans engagement avec Conseils Verax. Dites-nous où en sont les choses — nous vous dirons honnêtement comment nous pouvons vous aider, et ce qu’il en coûtera.',
  },
  hero: {
    eyebrow: 'Contact',
    title: 'Commençons par une conversation franche.',
    lead: 'Planifiez une consultation sans engagement. Dites-nous où en sont les choses — nous vous dirons honnêtement comment nous pouvons vous aider, et ce qu’il en coûtera.',
    bookLink: { href: '/book', label: 'Ou choisissez en ligne un moment pour un appel' },
  },
  form: {
    label: 'Demande de consultation',
    fields: {
      firstName: 'Prénom',
      lastName: 'Nom de famille',
      email: 'Adresse courriel',
      clientType: 'Je suis…',
      service: 'Service souhaité',
      message: 'Message',
      optional: '(facultatif)',
      honeypot: 'Laissez ce champ vide',
    },
    selectPrompt: 'Choisir…',
    clientTypes: [
      { id: 'individual', label: 'Particulier' },
      { id: 'self-employed', label: 'Travailleur autonome' },
      { id: 'sme', label: 'Petite entreprise (PME)' },
      { id: 'medium', label: 'Moyenne entreprise' },
      { id: 'corporation', label: 'Société' },
    ],
    notSure: 'Je ne sais pas encore',
    submit: 'Envoyer le message',
    sending: 'Envoi en cours…',
    privacy: 'Nous ne communiquons jamais vos renseignements.',
    errors: {
      firstName: { required: 'Entrez votre prénom.', tooLong: 'Votre prénom est trop long.' },
      lastName: { required: 'Entrez votre nom de famille.', tooLong: 'Votre nom de famille est trop long.' },
      email: {
        required: 'Entrez votre adresse courriel.',
        invalid: 'Entrez une adresse courriel valide, par exemple nom@exemple.com.',
        tooLong: 'Votre adresse courriel est trop longue.',
      },
      message: { tooLong: 'Votre message est trop long. Veuillez le raccourcir.' },
    },
    failure: `Le message n’a pas pu être envoyé. Réessayez, ou écrivez-nous à ${site.email}.`,
    success: {
      title: 'Message envoyé.',
      text: `Merci. Nous vous répondrons d’ici ${site.responseTime} — c’est une promesse, pas une estimation.`,
      again: 'Envoyer un autre message',
    },
  },
  sidebar: {
    direct: { title: 'Nous joindre directement', hoursLabel: 'Heures d’ouverture :' },
    where: { title: 'Où nous travaillons', text: 'Au service de clients partout au Canada.' },
    next: {
      title: 'Prochaines étapes',
      text: `Nous répondons d’ici ${site.responseTime} pour planifier une première conversation. Sans engagement, sans argumentaire de vente.`,
      link: { href: '/approach#how-we-work', label: 'Notre façon de travailler' },
    },
  },
};

const bookingPage = {
  meta: {
    title: 'Réserver une consultation',
    description: 'Choisissez un moment de 30 minutes pour une première consultation gratuite et sans engagement avec Conseils Verax, par téléphone ou par vidéo.',
  },
  hero: {
    eyebrow: 'Réserver une consultation',
    title: { lead: 'Choisissez un moment.', rest: 'Trente minutes, sans engagement.' },
    lead: 'Choisissez une journée et une heure pour une première consultation gratuite, par téléphone ou par vidéo. Dites-nous où en sont les choses — nous vous dirons honnêtement comment nous pouvons vous aider.',
  },
  timeZoneNote: 'Toutes les heures sont à l’heure de l’Est (Montréal).',
  steps: { date: 'Choisissez une journée', time: 'Choisissez une heure', details: 'Vos coordonnées' },
  calendarCaption: 'Journées disponibles',
  available: 'disponible',
  timesFor: 'Heures disponibles le {date}',
  loading: 'Chargement des heures disponibles…',
  noSlots: `Aucune heure n’est disponible au cours des quatre prochaines semaines. Écrivez-nous à ${site.email} ou appelez-nous au ${site.phone}.`,
  unavailable: `La réservation en ligne est temporairement indisponible. Écrivez-nous à ${site.email} ou appelez-nous au ${site.phone}.`,
  form: {
    label: 'Détails de la réservation',
    selected: 'Votre rendez-vous\u00a0:',
    change: 'Modifier',
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    email: 'Adresse courriel',
    meetingType: 'Comment souhaitez-vous nous rencontrer?',
    phoneCall: 'Appel téléphonique',
    videoCall: 'Appel vidéo',
    phone: 'Numéro de téléphone',
    phoneHint: 'Nous vous appellerons à ce numéro.',
    videoHint: 'Nous vous enverrons par courriel le lien de l’appel vidéo avant la rencontre.',
    message: 'Y a-t-il quelque chose que nous devrions savoir à l’avance?',
    optional: '(facultatif)',
    submit: 'Confirmer la réservation',
    sending: 'Réservation en cours…',
    privacy: 'Nous ne communiquons jamais vos renseignements.',
    errors: {
      firstName: { required: 'Entrez votre prénom.', tooLong: 'Votre prénom est trop long.' },
      lastName: { required: 'Entrez votre nom de famille.', tooLong: 'Votre nom de famille est trop long.' },
      email: {
        required: 'Entrez votre adresse courriel.',
        invalid: 'Entrez une adresse courriel valide, par exemple nom@exemple.com.',
        tooLong: 'Votre adresse courriel est trop longue.',
      },
      meetingType: { required: 'Choisissez un appel téléphonique ou un appel vidéo.' },
      phone: { required: 'Entrez le numéro auquel nous devons vous appeler.', invalid: 'Entrez un numéro de téléphone valide, par exemple 514-555-0123.' },
      message: { tooLong: 'Votre message est trop long. Veuillez le raccourcir.' },
    },
  },
  slotTaken: 'Désolés — quelqu’un vient de réserver cette heure. Veuillez en choisir une autre.',
  alreadyBooked: `Vous avez déjà une consultation à venir réservée avec cette adresse courriel. Pour la modifier, utilisez le lien d’annulation dans votre courriel de confirmation, ou écrivez-nous à ${site.email}.`,
  rateLimited: `Trop de tentatives. Veuillez réessayer plus tard, ou écrivez-nous à ${site.email}.`,
  failure: `La réservation n’a pas pu être effectuée. Réessayez, ou écrivez-nous à ${site.email}.`,
  success: {
    title: 'C’est réservé.',
    when: '{date} à {time} (heure de l’Est)',
    phoneNext: 'Nous vous appellerons au {phone}.',
    videoNext: 'Nous vous enverrons par courriel le lien de l’appel vidéo avant la rencontre.',
    emailNote: 'Une confirmation avec une invitation de calendrier a été envoyée à {email}.',
    home: { href: '/', label: 'Retour à l’accueil' },
  },
  contactAlt: { text: 'Vous préférez nous écrire d’abord?', link: { href: '/contact', label: 'Envoyez-nous un message' } },
  cancel: {
    meta: { title: 'Annuler une consultation' },
    title: 'Annuler votre consultation?',
    loading: 'Vérification de votre réservation…',
    details: '{date} à {time} (heure de l’Est)',
    confirm: 'Annuler la consultation',
    keep: { href: '/', label: 'La conserver' },
    cancelling: 'Annulation en cours…',
    doneTitle: 'Votre consultation est annulée.',
    doneText: 'Cette heure est de nouveau libre pour quelqu’un d’autre. Vous recevrez un courriel de confirmation.',
    invalid: 'Ce lien d’annulation n’est pas valide. Veuillez vérifier le lien dans votre courriel de confirmation.',
    alreadyCancelled: 'Cette consultation a déjà été annulée.',
    past: `Cette consultation a déjà eu lieu. Pour en réserver une autre, choisissez un nouveau moment, ou écrivez-nous à ${site.email}.`,
    failure: `L’annulation n’a pas pu être effectuée. Réessayez, ou écrivez-nous à ${site.email}.`,
    bookAgain: { href: '/book', label: 'Réserver un autre moment' },
  },
  emails: {
    confirmSubject: 'Votre consultation avec Conseils Verax — {date}, {time} HE',
    greeting: 'Bonjour {firstName},',
    confirmed: 'Votre première consultation gratuite est confirmée.',
    when: 'Quand\u00a0: {date}, {time}, heure de l’Est (30 minutes)',
    how: 'Comment\u00a0: {how}',
    phoneHow: 'appel téléphonique — nous vous appellerons au {phone}',
    videoHow: 'appel vidéo — nous vous enverrons le lien par courriel avant la rencontre',
    cancelLine: 'Un empêchement? Annulez ici pour libérer ce moment pour quelqu’un d’autre\u00a0: {url}',
    questions: 'Des questions? Répondez à ce courriel, écrivez à {email} ou appelez au {phone}.',
    signoff: 'Conseils Verax',
    calendarTitle: 'Consultation — Conseils Verax',
    cancelledSubject: 'Votre consultation du {date} est annulée',
    cancelledBody: 'Votre consultation du {date} à {time} (heure de l’Est) a été annulée. Vous pouvez réserver un autre moment ici\u00a0: {url}',
  },
};

const notFoundPage = {
  meta: { title: 'Page introuvable' },
  title: { lead: 'Page introuvable.', rest: 'Cette page n’existe pas ou a été déplacée.' },
  link: { href: '/', label: 'Retour à l’accueil' },
};

export default {
  site,
  ui,
  navigation,
  services,
  clientSegments,
  markParts,
  footer,
  home,
  approach,
  servicesPage,
  clientsPage,
  contactPage,
  bookingPage,
  notFoundPage,
};
