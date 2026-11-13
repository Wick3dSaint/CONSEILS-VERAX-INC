import Link from 'next/link';
import { clientSegments, home, services, site, ui } from '@/lib/content';
import { Icon } from '@/components/Icon';
import { Level } from '@/components/Level';
import { Chevron, Headline, MoreLink } from '@/components/Text';
import { EmailLink, PhoneLink } from '@/components/ContactDetails';

export const metadata = {
  // The root layout's title template does not apply to the root page, so give the full title.
  title: { absolute: home.meta.title },
  description: home.meta.description,
};

export default function HomePage() {
  const { hero, feature, servicesBand, promise, serve, help } = home;

  return (
    <>
      {/* 1. Hero */}
      <section className="hero hero--home" aria-labelledby="home-title">
        <div className="container hero-home fade-up">
          <Headline as="h1" id="home-title" title={hero.title} className="display" />
          <ul className="hero-rows">
            {hero.rows.map((row) => (
              <li key={row.link.label} className="hero-row">
                <span className="round-icon">
                  <Icon name={row.icon} size={20} />
                </span>
                <p>
                  {row.text}{' '}
                  <MoreLink href={row.link.href} className="more-link--strong">
                    {row.link.label}
                  </MoreLink>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 2. Service icon row */}
      <nav className="container service-row" aria-label={home.serviceRowLabel}>
        <ul>
          {services.map((s) => (
            <li key={s.id}>
              <Link href={`/services#${s.id}`} className="service-tile">
                <span className="service-tile__icon">
                  <Icon name={s.icon} size={34} />
                </span>
                <span className="service-tile__label">{s.shortLabel}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 3. Black feature panel */}
      <section className="section section--tight" aria-labelledby="feature-title">
        <div className="container">
          <div className="panel panel--black on-dark feature">
            <p className="eyebrow eyebrow--mint">{feature.label}</p>
            <h2 id="feature-title" className="feature__word">
              <span lang="la">{feature.word}</span> <em className="hl-rest">{feature.partOfSpeech}</em>
            </h2>
            <p className="feature__line">
              <span className="hl-lead">{feature.line.lead}</span> <span className="hl-rest">{feature.line.rest}</span>
            </p>
            <Level size="small" label={ui.levelLabel} className="feature__level" />
            <p className="feature__caption">{feature.caption}</p>
            <MoreLink href={feature.link.href}>{feature.link.label}</MoreLink>
          </div>
        </div>
      </section>

      {/* 4. Grey band with horizontal card scroller */}
      <section className="band" aria-labelledby="services-band-title">
        <div className="container">
          <Headline id="services-band-title" title={servicesBand.title} />
        </div>
        <ul className="scroller" aria-label={servicesBand.scrollerLabel}>
          {services.map((s) => (
            <li key={s.id} className="card card--scroll">
              <span className="card__icon">
                <Icon name={s.icon} size={28} />
              </span>
              <p className="eyebrow">{s.eyebrow}</p>
              <h3 className="card__title">
                <Link href={`/services#${s.id}`} className="stretched-link">
                  {s.shortLabel}
                </Link>
              </h3>
              <p className="card__text">{s.summary}</p>
              <span className="more-link card__more" aria-hidden="true">
                {ui.learnMore}
                <Chevron />
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. The Verax promise */}
      <section className="section" aria-labelledby="promise-title">
        <div className="container">
          <Headline id="promise-title" title={promise.title} />
          <ol className="tile-grid tile-grid--3">
            {promise.items.map((item) => (
              <li key={item.numeral} className="tile">
                <span className="numeral" aria-hidden="true">
                  {item.numeral}
                </span>
                <h3 className="tile__title">{item.title}</h3>
                <p className="tile__text">{item.text}</p>
              </li>
            ))}
          </ol>
          <p className="section-link">
            <MoreLink href={promise.link.href}>{promise.link.label}</MoreLink>
          </p>
        </div>
      </section>

      {/* 6. Who we serve */}
      <section className="section section--flush-top" aria-labelledby="serve-title">
        <div className="container">
          <Headline id="serve-title" title={serve.title} />
          <ul className="tile-grid tile-grid--3">
            {clientSegments.map((c) => (
              <li key={c.id} className="tile tile--link card-hover">
                <span className="tile__icon">
                  <Icon name={c.icon} size={28} />
                </span>
                <h3 className="tile__title">
                  <Link href={`/clients#${c.id}`} className="stretched-link">
                    {c.title}
                  </Link>
                </h3>
                <span className="more-link tile__more" aria-hidden="true">
                  {ui.learnMore}
                  <Chevron />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. Help is here */}
      <section className="section section--flush-top" aria-labelledby="help-title">
        <div className="container">
          <Headline id="help-title" title={help.title} />
          <div className="help-grid">
            <div className="help-card help-card--dark on-dark">
              <p className="eyebrow eyebrow--mint">{help.consult.eyebrow}</p>
              <h3 className="help-card__title">{help.consult.title}</h3>
              <p className="help-card__text">{help.consult.text}</p>
              <MoreLink href={help.consult.link.href}>{help.consult.link.label}</MoreLink>
            </div>
            <div className="help-card help-card--grey">
              <p className="eyebrow">{help.direct.eyebrow}</p>
              <h3 className="help-card__title">{help.direct.title}</h3>
              <ul className="help-card__list">
                <li>
                  <EmailLink email={site.email} />
                </li>
                <li>
                  <PhoneLink phone={site.phone} />
                </li>
                <li>{site.area}</li>
              </ul>
              <MoreLink href={help.direct.link.href}>{help.direct.link.label}</MoreLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
