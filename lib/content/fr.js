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
  // [[ServiceList]] is rebuilt from the services switched on in the admin portal.
  description: 'Conseils Verax est un cabinet canadien de comptabilité et de services-conseils. [[ServiceList]] — avec des réponses honnêtes et des honoraires transparents.',
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
  numberWords: ['Zéro', 'Une', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit', 'Neuf', 'Dix'],
  otherLanguage: { code: 'en', label: 'English', ariaLabel: 'View this page in English' },
};

const navigation = {
  links: [
    { href: '/services', label: 'Services' },
    { href: '/clients', label: 'Clientèle' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ],
  cta: { href: '/book', label: 'Réserver une consultation' },
  allServices: { href: '/services', label: 'Tous les services' },
};

/** Words only, by service id; ids and icons come from en.js. */
const serviceText = {
  'tax-prep': {
    title: 'Déclaration d’impôt',
    shortLabel: 'Déclaration d’impôt',
    listName: 'déclaration d’impôt',
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
    listName: 'planification fiscale',
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
    listName: 'contrôleur à temps partiel',
    eyebrow: 'Sans embauche à temps plein',
    summary:
      'Soutien stratégique en planification et analyse financières, outils financiers pour mieux décider et un allié d’expérience à la table avec votre banque — adaptés à votre entreprise.',
    body: 'Une supervision financière de niveau contrôleur, sans embauche à temps plein\u00a0: un partenaire stratégique qui vous présente les bons chiffres avant chaque décision importante — ajusté exactement à ce dont votre entreprise a besoin, sans rien de superflu.',
    included: [
      'Soutien stratégique en matière de planification et d’analyse financières',
      'Amélioration de la capacité décisionnelle des propriétaires, des fondateurs et des chefs de la direction au moyen d’outils financiers (analyse du seuil de rentabilité, rentabilité d’un projet, estimation afin d’optimiser les coûts, analyse de la marge sur coût variable, optimisation des ressources)',
      'Négociations avec les institutions bancaires et les parties prenantes',
      'Clôture mensuelle, budgétisation et prévisions de trésorerie',
      'Une rencontre de suivi régulière avec vous',
    ],
    bestFor: 'les entreprises en croissance qui ont besoin d’une supervision financière chevronnée avant d’avoir besoin d’un contrôleur à temps plein.',
    cta: 'Parler de supervision',
  },
  advisory: {
    title: 'Services-conseils',
    shortLabel: 'Services-conseils',
    listName: 'services-conseils',
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
    listName: 'tenue de livres',
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
  reporting: {
    title: 'Information financière',
    shortLabel: 'Information financière',
    listName: 'information financière',
    eyebrow: 'États financiers annuels',
    summary:
      'Des états financiers préparés avec exactitude et à temps — prêts pour votre banque, vos investisseurs et les autorités fiscales.',
    body: 'Des états financiers préparés à partir de vos livres — clairs, exacts et produits à temps — pour que votre banque, vos investisseurs et les autorités fiscales voient le même portrait fidèle que vous.',
    included: [
      'Préparation des états financiers annuels',
      'Bilan et état des résultats',
      'Écritures de régularisation de fin d’exercice',
      'États financiers prêts pour votre banque, vos investisseurs et vos déclarations fiscales',
      'Une revue des résultats avec vous',
    ],
    bestFor: 'les sociétés qui ont besoin d’états financiers annuels pour l’impôt, leur banque ou leurs actionnaires.',
    cta: 'Parler de vos états financiers',
  },
};
const services = en.services.map((s) => ({ ...s, ...serviceText[s.id] }));

const groupTitles = { accounting: 'Comptabilité', taxation: 'Fiscalité', advisory: 'Conseil' };
const serviceGroups = en.serviceGroups.map((g) => ({ ...g, title: groupTitles[g.id] }));

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
    { href: '/clients', label: 'Notre clientèle' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ],
  contactHeading: 'Contact',
  rights: 'Tous droits réservés.',
  geoAttribution: 'Données IP\u00a0: DB-IP',
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
    link: { href: '/about#approach', label: 'Découvrir notre approche' },
  },
  servicesBand: {
    title: { lead: 'Services.', rest: { one: 'Une façon de voir clair dans vos chiffres.', other: '[[Count]] façons de voir clair dans vos chiffres.' } },
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
    link: { href: '/about#approach', label: 'Lire notre approche complète' },
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
    description: '[[ServiceList]] pour les particuliers et les entreprises partout au Canada.',
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
    jump: { book: 'Réserver une consultation', message: 'Envoyer un message' },
  },
  bookingSection: {
    title: { lead: 'Réservez une consultation.', rest: 'Trente minutes, gratuites et sans engagement.' },
  },
  messageSection: {
    title: { lead: 'Envoyez un message.', rest: 'Nous répondons d’ici [[responseTime]].' },
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
    failure: `Le message n’a pas pu être envoyé. Réessayez, ou écrivez-nous à [[email]].`,
    success: {
      title: 'Message envoyé.',
      text: `Merci. Nous vous répondrons d’ici [[responseTime]] — c’est une promesse, pas une estimation.`,
      again: 'Envoyer un autre message',
    },
  },
  faq: {
    title: { lead: 'Questions fréquentes.', rest: 'Des réponses franches.' },
    items: [
      {
        q: 'Comment se déroule la première consultation?',
        a: 'Trente minutes, par téléphone ou en vidéo — à votre choix. Vous nous expliquez où en sont les choses; nous posons les questions qui comptent, puis nous vous disons honnêtement ce dont vous avez besoin, et ce dont vous n’avez pas besoin. C’est gratuit et sans engagement.',
      },
      {
        q: 'Que dois-je préparer?',
        a: 'Rien n’est obligatoire. Si vous les avez sous la main, votre dernière déclaration de revenus ou votre dernier avis de cotisation, ou vos plus récents états financiers, nous aident à vous donner une réponse plus précise.',
      },
      {
        q: 'Comment vos honoraires sont-ils établis?',
        a: 'La portée du mandat, l’échéancier et les honoraires sont convenus par écrit avant le début des travaux. Aucune surprise\u00a0: si quelque chose change, vous l’apprenez d’abord de nous.',
      },
      {
        q: 'Travaillez-vous avec des clients à l’extérieur du Québec?',
        a: 'Oui. Nous servons des clients partout au Canada, et les rencontres peuvent se faire par téléphone ou en vidéo.',
      },
      { q: 'Travaillez-vous en français et en anglais?', a: 'Oui, dans les deux langues — celle que vous préférez.' },
      {
        q: 'J’ai reçu un avis de l’ARC ou de Revenu Québec. Pouvez-vous m’aider?',
        a: 'Oui. L’accompagnement lors des avis des autorités fiscales fait partie de notre service de déclaration d’impôt. Réservez une consultation et gardez l’avis à portée de main.',
        serviceId: 'tax-prep',
      },
      {
        q: 'Dans quel délai aurai-je une réponse?',
        a: 'D’ici [[responseTime]]. Les consultations réservées en ligne sont confirmées immédiatement par courriel.',
      },
    ],
  },
  sidebar: {
    direct: { title: 'Nous joindre directement', hoursLabel: 'Heures d’ouverture :' },
    where: { title: 'Où nous travaillons', text: 'Au service de clients partout au Canada.' },
    next: {
      title: 'Prochaines étapes',
      text: `Nous répondons d’ici [[responseTime]] pour planifier une première conversation. Sans engagement, sans argumentaire de vente.`,
      link: { href: '/about#how-we-work', label: 'Notre façon de travailler' },
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
  noSlots: `Aucune heure n’est disponible pour le moment. Écrivez-nous à [[email]] ou appelez-nous au [[phone]].`,
  unavailable: `La réservation en ligne est temporairement indisponible. Écrivez-nous à [[email]] ou appelez-nous au [[phone]].`,
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
  alreadyBooked: `Vous avez déjà une consultation à venir réservée avec cette adresse courriel. Pour la modifier, utilisez le lien d’annulation dans votre courriel de confirmation, ou écrivez-nous à [[email]].`,
  rateLimited: `Trop de tentatives. Veuillez réessayer plus tard, ou écrivez-nous à [[email]].`,
  failure: `La réservation n’a pas pu être effectuée. Réessayez, ou écrivez-nous à [[email]].`,
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
    past: `Cette consultation a déjà eu lieu. Pour en réserver une autre, choisissez un nouveau moment, ou écrivez-nous à [[email]].`,
    failure: `L’annulation n’a pas pu être effectuée. Réessayez, ou écrivez-nous à [[email]].`,
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

const aboutPage = {
  draft: en.aboutPage.draft,
  meta: {
    title: 'À propos',
    description: 'Qui nous sommes chez Conseils Verax\u00a0: un cabinet canadien de comptabilité et de services-conseils bâti autour d’un mot — verax, véridique.',
  },
  hero: {
    eyebrow: 'À propos',
    title: { lead: 'Conseils Verax.', rest: 'Un cabinet bâti sur la vérité.' },
    lead: 'Nous sommes un cabinet canadien de comptabilité et de services-conseils au service des particuliers et des entreprises partout au Canada. Notre nom vient du latin verax — véridique — et c’est une promesse que nous entendons tenir dans chaque dossier.',
  },
  story: {
    title: { lead: 'Notre histoire.', rest: 'Pourquoi Conseils Verax existe.' },
    paragraphs: [
      'La plupart des cabinets portent le nom des gens qui les dirigent. Nous avons donné au nôtre le nom d’une promesse. Verax veut dire «\u00a0véridique\u00a0» en latin — un mot qu’on ne choisit que si l’on est prêt à en répondre.',
      'L’idée est venue d’un niveau à bulle, pas d’un chiffrier. Un niveau n’a rien à défendre. On le pose, et la bulle vous dit où vous en êtes\u00a0: de niveau, ou pas encore. Il n’arrondit pas, il ne flatte pas, et il n’attend pas que vous posiez la bonne question. C’est le cabinet que nous avons voulu bâtir\u00a0: un cabinet qui vous dit exactement où en sont vos chiffres, en langage simple, pendant qu’il est encore temps d’agir.',
      'Encore faut-il que le niveau soit à portée de main. Les moments qui comptent attendent rarement un rendez-vous\u00a0: la période des impôts, le jour où un avis arrive, la semaine où une décision ne peut pas attendre. Être là quand vous avez besoin de nous fait partie du travail, ce n’est pas une faveur — chaque message reçoit une réponse d’ici [[responseTime]].',
    ],
  },
  team: {
    title: { lead: 'Avec qui vous travaillerez.', rest: 'Une vraie personne, dès le premier appel.' },
    people: [
      {
        name: 'Jeff',
        role: 'Fondateur',
        // [CONFIRM] Titre professionnel (p. ex. CPA), seulement s’il est détenu.
        credentials: '',
        bio: 'Jeff accompagne les entrepreneurs qui préfèrent se concentrer sur leur entreprise plutôt que sur les casse-têtes de la comptabilité et de la fiscalité. Avant de fonder Conseils Verax, il a travaillé dans des cabinets comptables en Ontario et au Québec, auprès de clients de nombreux secteurs — notamment la construction, les professionnels de la santé et les cabinets de professionnels. Il travaille en français et en anglais.',
      },
    ],
  },
};

const taxDatesPage = {
  draft: en.taxDatesPage.draft,
  meta: {
    title: 'Dates fiscales importantes',
    description: 'Les principales échéances fiscales fédérales et du Québec des douze prochains mois, et un calculateur pour la fin d’exercice de votre société.',
  },
  hero: {
    eyebrow: 'Dates fiscales',
    title: { lead: 'Dates fiscales importantes.', rest: 'Pour ne jamais être pris de court.' },
    lead: 'Les principales échéances fédérales et du Québec des douze prochains mois — et un calculateur pour la fin d’exercice de votre société.',
  },
  personal: {
    title: { lead: 'Particuliers.', rest: 'Les douze prochains mois.' },
    events: {
      rrsp: { title: 'Date limite de cotisation au REER', note: 'Dernier jour pour cotiser et déduire pour {year}.' },
      slips: { title: 'Feuillets T4 et relevés 1', note: 'Les employeurs produisent et remettent les feuillets de {year}.' },
      file: {
        title: 'Déclarations de revenus des particuliers',
        note: 'Déclarations de {year} et paiement de tout solde dû — fédéral et Québec.',
      },
      selfEmployed: {
        title: 'Déclarations des travailleurs autonomes',
        note: 'Déclarations de {year} des travailleurs autonomes et de leur conjoint. Tout solde dû devait quand même être payé le 30 avril.',
      },
      instalment: { title: 'Acompte provisionnel', note: 'Acompte trimestriel pour {year}, si vous êtes tenu d’en verser.' },
    },
    weekend: 'Tombe une fin de semaine\u00a0: dans les délais si fait au plus tard le {date}.',
  },
  corporate: {
    title: { lead: 'Sociétés.', rest: 'Entrez votre fin d’exercice.' },
    label: 'Fin d’exercice',
    hint: 'Le dernier jour de l’année d’imposition de votre société.',
    empty: 'Choisissez une date pour voir vos échéances.',
    balance: { title: 'Solde d’impôt à payer', note: 'Deux mois après la fin d’exercice.' },
    balanceCcpc: {
      title: 'Solde à payer — certaines SPCC',
      note: 'Trois mois après la fin d’exercice, pour les sociétés privées sous contrôle canadien admissibles.',
    },
    filing: { title: 'Déclarations de revenus des sociétés (T2 et CO-17)', note: 'Six mois après la fin d’exercice.' },
  },
  disclaimer:
    'Dates générales seulement. Vos propres échéances peuvent différer, et un jour férié peut déplacer une date — vérifiez auprès de l’Agence du revenu du Canada ou de Revenu Québec, ou demandez-nous.',
  cta: { title: 'Vous aimeriez qu’on s’en occupe pour vous?', link: { href: '/book', label: 'Réserver une consultation' } },
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
  serviceGroups,
  clientSegments,
  markParts,
  footer,
  home,
  approach,
  servicesPage,
  clientsPage,
  contactPage,
  bookingPage,
  aboutPage,
  taxDatesPage,
  notFoundPage,
};
