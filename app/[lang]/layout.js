import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { SITE_URL, getContent, hasLocale, localePath, locales } from '@/lib/i18n';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});

// Pre-built and refreshed in the background at most once a minute; saving in the admin portal refreshes it at once.
export const revalidate = 60;

/** Both languages are pre-built. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { site } = await getContent(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: site.name, template: `%s · ${site.name}` },
    description: site.description,
    applicationName: site.name,
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: lang === 'fr' ? 'fr_CA' : 'en_CA',
      description: site.description,
    },
    twitter: { card: 'summary_large_image' },
  };
}

/**
 * Who the firm is, in the structured form search engines read (schema.org).
 * Only facts shown on the site; no street address, since none is published.
 */
function firmData(dict, lang) {
  const { site, services } = dict;
  return {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    '@id': `${SITE_URL}/#firm`,
    name: site.name,
    legalName: site.legalName,
    url: `${SITE_URL}${localePath(lang, '/')}`,
    image: `${SITE_URL}${localePath(lang, '/opengraph-image')}`,
    description: site.description,
    email: site.email,
    telephone: `+1-${site.phone}`,
    areaServed: { '@type': 'Country', name: 'Canada' },
    knowsLanguage: ['fr', 'en'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: dict.navigation.allServices.label,
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, url: `${SITE_URL}${localePath(lang, `/services#${s.id}`)}` },
      })),
    },
  };
}

export const viewport = {
  themeColor: '#ffffff',
};

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getContent(lang);

  return (
    <html lang={dict.site.locale} className={inter.variable}>
      <body>
        <a className="skip-link" href="#main">
          {dict.ui.skipLink}
        </a>
        <Header dict={dict} lang={lang} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer dict={dict} lang={lang} />
        <ScrollReveal />
        <script
          type="application/ld+json"
          // JSON with "<" escaped, so it can't close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(firmData(dict, lang)).replace(/</g, '\\u003c') }}
        />
      </body>
    </html>
  );
}
