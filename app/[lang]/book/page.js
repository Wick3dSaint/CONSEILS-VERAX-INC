import BookingWidget from '@/components/BookingWidget';
import { MoreLink, Headline } from '@/components/Text';
import { BOOKING } from '@/lib/booking/config';
import { getDictionary, localePath, pageMetadata } from '@/lib/i18n';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { bookingPage } = getDictionary(lang);
  return pageMetadata(lang, '/book', { title: bookingPage.meta.title, description: bookingPage.meta.description });
}

export default async function BookPage({ params }) {
  const { lang } = await params;
  const { bookingPage, site } = getDictionary(lang);
  const { hero, contactAlt } = bookingPage;

  return (
    <>
      <section className="hero" aria-labelledby="book-title">
        <div className="container fade-up">
          <p className="eyebrow hero__eyebrow">{hero.eyebrow}</p>
          <Headline as="h1" id="book-title" title={hero.title} className="display" />
          <p className="hero__lead">{hero.lead}</p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container booking-layout">
          <BookingWidget
            copy={bookingPage}
            lang={lang}
            locale={site.locale}
            timeZone={BOOKING.timeZone}
            homeHref={localePath(lang, bookingPage.success.home.href)}
          />
          <p className="booking-alt">
            {contactAlt.text} <MoreLink href={localePath(lang, contactAlt.link.href)}>{contactAlt.link.label}</MoreLink>
          </p>
        </div>
      </section>
    </>
  );
}
