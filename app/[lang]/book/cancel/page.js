import CancelBooking from '@/components/CancelBooking';
import { getContent, localePath } from '@/lib/i18n';

// Reads the admin portal's settings (services on/off, contact details) on every request.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { bookingPage } = await getContent(lang);
  // Personal links: keep them out of search engines.
  return { title: bookingPage.cancel.meta.title, robots: { index: false, follow: false } };
}

export default async function CancelPage({ params }) {
  const { lang } = await params;
  const { bookingPage, site } = await getContent(lang);
  return (
    <section className="hero" aria-labelledby="cancel-title">
      <div className="container booking-layout">
        <CancelBooking
          copy={bookingPage.cancel}
          locale={site.locale}
          keepHref={localePath(lang, bookingPage.cancel.keep.href)}
          bookHref={localePath(lang, bookingPage.cancel.bookAgain.href)}
        />
      </div>
    </section>
  );
}
