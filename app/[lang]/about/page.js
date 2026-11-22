import { LogoMark } from '@/components/Logo';
import { Headline, MoreLink, PillLink } from '@/components/Text';
import { getContent, localePath, pageMetadata } from '@/lib/i18n';

// Reads the admin portal's settings on every request.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { aboutPage } = await getContent(lang);
  const meta = pageMetadata(lang, '/about', { title: aboutPage.meta.title, description: aboutPage.meta.description });
  // While the page is preliminary, keep it out of search engines.
  return aboutPage.draft ? { ...meta, robots: { index: false, follow: false } } : meta;
}

export default async function AboutPage({ params }) {
  const { lang } = await params;
  const { aboutPage, home } = await getContent(lang);
  const { hero, story, team, values, cta } = aboutPage;
  const lp = (path) => localePath(lang, path);

  return (
    <>
      {/* 1. Hero */}
      <section className="hero" aria-labelledby="about-title">
        <div className="container fade-up">
          <p className="eyebrow hero__eyebrow">{hero.eyebrow}</p>
          <Headline as="h1" id="about-title" title={hero.title} className="display" />
          <p className="hero__lead">{hero.lead}</p>
        </div>
      </section>

      {/* 2. Story */}
      <section className="section section--tight" aria-labelledby="story-title">
        <div className="container">
          <div className="panel panel--paper about-story">
            <Headline id="story-title" title={story.title} />
            {story.paragraphs.map((p) => (
              <p key={p} className="about-story__text">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Team */}
      <section className="section" aria-labelledby="team-title">
        <div className="container">
          <Headline id="team-title" title={team.title} />
          <ul className="about-team">
            {team.people.map((person) => (
              <li key={person.name} className="about-person">
                <div className="about-person__photo" aria-hidden="true">
                  <LogoMark width={72} height={36} frame="#f5f5f7" bubble="#5fd3b3" />
                </div>
                <div>
                  <h3 className="about-person__name">{person.name}</h3>
                  <p className="about-person__role">
                    {[person.role, person.credentials].filter(Boolean).join(' · ')}
                  </p>
                  <p className="about-person__bio">{person.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Values (the same promise as the home page) */}
      <section className="section section--flush-top" aria-labelledby="values-title">
        <div className="container">
          <Headline id="values-title" title={values.title} />
          <ol className="tile-grid tile-grid--3">
            {home.promise.items.map((item) => (
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
            <MoreLink href={lp(values.link.href)}>{values.link.label}</MoreLink>
          </p>
        </div>
      </section>

      {/* 5. Call to action */}
      <section className="section closing" aria-labelledby="about-cta">
        <div className="container closing__inner">
          <h2 id="about-cta" className="h2">
            {cta.title}
          </h2>
          <p className="closing__text">{cta.text}</p>
          <PillLink href={lp(cta.link.href)}>{cta.link.label}</PillLink>
        </div>
      </section>
    </>
  );
}
