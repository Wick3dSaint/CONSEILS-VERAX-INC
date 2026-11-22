import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { SITE_URL, getContent, hasLocale } from '@/lib/i18n';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
});

// Reads the admin portal's settings (services on/off, contact details) on every request.
export const dynamic = 'force-dynamic';

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
      </body>
    </html>
  );
}
