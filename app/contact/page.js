import { contactPage, services, site } from '@/lib/content';
import ContactForm from '@/components/ContactForm';
import { EmailLink, PhoneLink } from '@/components/ContactDetails';
import { MoreLink } from '@/components/Text';

export const metadata = {
  title: contactPage.meta.title,
  description: contactPage.meta.description,
};

// The five services plus "Not sure yet". `id` matches /contact?service=<id> links.
const serviceOptions = [
  ...services.map((s) => ({ id: s.id, value: s.title })),
  { id: 'not-sure', value: contactPage.form.notSure },
];

export default function ContactPage() {
  const { hero, form, sidebar } = contactPage;

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
        </div>
      </section>

      <section className="section section--tight" aria-label={form.label}>
        <div className="container contact-layout">
          {/* 2–3. Form */}
          <div className="contact-layout__form">
            <ContactForm copy={form} serviceOptions={serviceOptions} />
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
              <MoreLink href={sidebar.next.link.href}>{sidebar.next.link.label}</MoreLink>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
