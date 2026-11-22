import { getContent, localePath, pageMetadata } from '@/lib/i18n';
import ContactForm from '@/components/ContactForm';
import { EmailLink, PhoneLink } from '@/components/ContactDetails';
import BookingWidget from '@/components/BookingWidget';
import { Headline, MoreLink } from '@/components/Text';
import { BOOKING } from '@/lib/booking/config';

// Reads the admin portal's settings (services on/off, contact details) on every request.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { contactPage } = await getContent(lang);
  return pageMetadata(lang, '/contact', { title: contactPage.meta.title, description: contactPage.meta.description });
}

export default async function ContactPage({ params }) {
  const { lang } = await params;
  const dict = await getContent(lang);
  const { contactPage, bookingPage, services, site } = dict;
  const lp = (path) => localePath(lang, path);
  const { hero, form, sidebar } = contactPage;
  // The five services plus "Not sure yet". `id` is what the form sends, and matches
  // /contact?service=<id> links; the label is shown in the current language.
  const serviceOptions = [
    ...services.map((s) => ({ id: s.id, label: s.title })),
    { id: 'not-sure', label: form.notSure },
  ];

  return (
    <>
      {/* 1. Hero */}
      <section className="hero" aria-labelledby="contact-title">
        <div className="container fade-up">
          <p className="eyebrow hero__eyebrow">{hero.eyebrow}</p>
          <h1 id="contact-title" className="display">
            {hero.title}
          </h1>
          <p className="hero__lead">{hero.lead}</p>
          <ul className="contact-jump" aria-label={hero.eyebrow}>
            <li>
              <a href="#book" className="pill pill--green">
                {hero.jump.book}
              </a>
            </li>
            <li>
              <a href="#message" className="pill pill--outline">
                {hero.jump.message}
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* 2. Book a consultation (same calendar as the booking page) */}
      <section id="book" className="section section--tight" aria-labelledby="book-heading">
        <div className="container">
          <Headline id="book-heading" title={contactPage.bookingSection.title} />
          <div className="booking-layout booking-layout--inline">
            <BookingWidget
              copy={bookingPage}
              lang={lang}
              locale={site.locale}
              timeZone={BOOKING.timeZone}
              homeHref={lp(bookingPage.success.home.href)}
            />
          </div>
        </div>
      </section>

      {/* 3. Send a message */}
      <section id="message" className="section" aria-labelledby="message-heading">
        <div className="container">
          <Headline id="message-heading" title={contactPage.messageSection.title} />
        </div>
        <div className="container contact-layout">
          {/* 2–3. Form */}
          <div className="contact-layout__form">
            <ContactForm copy={form} serviceOptions={serviceOptions} lang={lang} />
          </div>

          {/* 4. Sidebar */}
          <aside className="contact-layout__aside" aria-label={sidebar.direct.title}>
            <div id="reach-us" className="side-card side-card--dark on-dark anchor-target">
              <h2 className="side-card__title">{sidebar.direct.title}</h2>
              <ul className="side-card__list">
                <li>
                  <EmailLink email={site.email} />
                </li>
                <li>
                  <PhoneLink phone={site.phone} />
                </li>
                <li className="muted">
                  {sidebar.direct.hoursLabel} {site.hours}
                </li>
              </ul>
            </div>

            <div className="side-card side-card--grey">
              <h2 className="side-card__title">{sidebar.where.title}</h2>
              <p className="side-card__text">{sidebar.where.text}</p>
            </div>

            <div className="side-card side-card--grey">
              <h2 className="side-card__title">{sidebar.next.title}</h2>
              <p className="side-card__text">{sidebar.next.text}</p>
              <MoreLink href={lp(sidebar.next.link.href)}>{sidebar.next.link.label}</MoreLink>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
