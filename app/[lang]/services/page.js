import { getDictionary, localePath, pageMetadata } from '@/lib/i18n';
import { Icon } from '@/components/Icon';
import { Headline, PillLink } from '@/components/Text';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { servicesPage } = getDictionary(lang);
  return pageMetadata(lang, '/services', { title: servicesPage.meta.title, description: servicesPage.meta.description });
}

export default async function ServicesPage({ params }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const { services, servicesPage } = dict;
  const lp = (path) => localePath(lang, path);
  const { hero, closing } = servicesPage;

  return (
    <>
      {/* 1. Hero */}
      <section className="hero" aria-labelledby="services-title">
        <div className="container fade-up">
          <p className="eyebrow hero__eyebrow">{hero.eyebrow}</p>
          <Headline as="h1" id="services-title" title={hero.title} className="display" />
          <p className="hero__lead">{hero.lead}</p>
        </div>
      </section>

      {/* 2. Jump links */}
      <nav className="container jump-links" aria-label={servicesPage.jumpLabel}>
        <ul>
          {services.map((s) => (
            <li key={s.id}>
              <a href={lp(`#${s.id}`)} className="pill pill--outline">
                {s.shortLabel}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 3. One large section per service, alternating light and dark */}
      <div className="container service-stack">
        {services.map((s, i) => {
          const dark = i % 2 === 1;
          return (
            <section
              key={s.id}
              id={s.id}
              className={`panel service-panel ${dark ? 'panel--black on-dark' : 'panel--paper'}`}
              aria-labelledby={`${s.id}-title`}
            >
              <div className="service-panel__main">
                <span className="icon-tile">
                  <Icon name={s.icon} size={32} />
                </span>
                <p className="eyebrow">{s.eyebrow}</p>
                <h2 id={`${s.id}-title`} className="h2 service-panel__title">
                  {s.title}
                </h2>
                <p className="service-panel__body">{s.body}</p>
                <PillLink href={lp(`/contact?service=${s.id}`)}>{s.cta}</PillLink>
              </div>

              <div className="service-panel__aside">
                <div className="included">
                  <h3 className="included__title">{servicesPage.includedHeading}</h3>
                  <ul className="check-list">
                    {s.included.map((item) => (
                      <li key={item}>
                        <Icon name="check" size={18} strokeWidth={2} className="check-list__icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="best-for">
                  <strong>{servicesPage.bestForLabel}</strong> {s.bestFor}
                </p>
              </div>
            </section>
          );
        })}
      </div>

      {/* 4. Closing */}
      <section className="section closing" aria-labelledby="services-closing-title">
        <div className="container closing__inner">
          <h2 id="services-closing-title" className="h2">
            {closing.title}
          </h2>
          <p className="closing__text">{closing.text}</p>
          <PillLink href={lp(closing.cta.href)}>{closing.cta.label}</PillLink>
        </div>
      </section>
    </>
  );
}
