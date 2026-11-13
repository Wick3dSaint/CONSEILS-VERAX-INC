import CancelBooking from '@/components/CancelBooking';
import { getDictionary, localePath } from '@/lib/i18n';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { bookingPage } = getDictionary(lang);
  // Personal links: keep them out of search engines.
  return { title: bookingPage.cancel.meta.title, robots: { index: false, follow: false } };
}

export default async function CancelPage({ params }) {
  const { lang } = await params;
  const { bookingPage, site } = getDictionary(lang);
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
