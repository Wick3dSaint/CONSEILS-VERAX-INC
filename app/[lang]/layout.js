import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL, getDictionary, hasLocale, locales } from '@/lib/i18n';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});

// Only /fr and /en exist; both are built ahead of time.
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { site } = getDictionary(lang);
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
  };
}

export const viewport = {
  themeColor: '#ffffff',
};

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

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
      </body>
    </html>
  );
}
