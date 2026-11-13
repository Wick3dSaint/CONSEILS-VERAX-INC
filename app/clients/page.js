import Link from 'next/link';
import { clientSegments, clientsPage, serviceById } from '@/lib/content';
import { Icon } from '@/components/Icon';
import { Headline, PillLink } from '@/components/Text';

export const metadata = {
  title: clientsPage.meta.title,
  description: clientsPage.meta.description,
};

export default function ClientsPage() {
  const { hero, personal, closing } = clientsPage;

  return (
    <>
      {/* 1. Hero */}
      <section className="hero" aria-labelledby="clients-title">
        <div className="container fade-up">
          <p className="eyebrow hero__eyebrow">{hero.eyebrow}</p>
          <Headline as="h1" id="clients-title" title={hero.title} className="display" />
          <p className="hero__lead">{hero.lead}</p>
        </div>
      </section>

      {/* 2. Client segments */}
      <section className="section section--tight" aria-label={hero.eyebrow}>
        <div className="container">
          <ul className="tile-grid tile-grid--3 client-grid">
            {clientSegments.map((c) => (
              <li key={c.id} id={c.id} className="client-card anchor-target">
                <span className="icon-tile icon-tile--white">
                  <Icon name={c.icon} size={28} />
                </span>
                <h2 className="client-card__title">{c.title}</h2>
                <p className="client-card__text">{c.text}</p>
                <div className="client-card__pairs">
                  <p className="client-card__pairs-label" id={`${c.id}-pairs`}>
                    {clientsPage.pairedLabel}
                  </p>
                  <ul className="pill-list" aria-labelledby={`${c.id}-pairs`}>
                    {c.pairs.map((id) => (
                      <li key={id}>
                        <Link href={`/services#${id}`} className="pill pill--white">
                          {serviceById[id].shortLabel}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Personalised, always */}
      <section className="section section--tight" aria-labelledby="personal-title">
        <div className="container">
          <div className="panel panel--black on-dark panel--centred">
            <p className="eyebrow eyebrow--mint">{personal.eyebrow}</p>
            <Headline id="personal-title" title={personal.title} />
            <p className="panel__text">{personal.text}</p>
          </div>
        </div>
      </section>

      {/* 4. Closing */}
      <section className="section closing" aria-labelledby="clients-closing-title">
        <div className="container closing__inner">
          <h2 id="clients-closing-title" className="h2">
            {closing.title}
          </h2>
          <p className="closing__text">{closing.text}</p>
          <PillLink href={closing.cta.href}>{closing.cta.label}</PillLink>
        </div>
      </section>
    </>
  );
}
