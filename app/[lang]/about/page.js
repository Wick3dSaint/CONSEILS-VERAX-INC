import { Level } from '@/components/Level';
import { LogoMark } from '@/components/Logo';
import { Headline, PillLink, RichText } from '@/components/Text';
import { getContent, localePath, pageMetadata } from '@/lib/i18n';

// Pre-built and refreshed in the background at most once a minute; saving in the admin portal refreshes it at once.
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { aboutPage } = await getContent(lang);
  const meta = pageMetadata(lang, '/about', { title: aboutPage.meta.title, description: aboutPage.meta.description });
  // Set aboutPage.draft to true to keep the page out of search engines.
  return aboutPage.draft ? { ...meta, robots: { index: false, follow: false } } : meta;
}

const MINT = '#5fd3b3';
const DIM = '#48484a';

function MarkPart({ part }) {
  return (
    <LogoMark
      width={96}
      height={48}
      frame={part === 'vial' ? MINT : DIM}
      lines={part === 'lines' ? MINT : DIM}
      bubble={part === 'bubble' ? MINT : DIM}
    />
  );
}

/** About us, including our approach (the old /approach page redirects here). */
export default async function AboutPage({ params }) {
  const { lang } = await params;
  const { aboutPage, approach, markParts, ui } = await getContent(lang);
  const { hero, story, team } = aboutPage;
  const { dictionary, level, commitments, steps, pledge } = approach;
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
                  <p className="about-person__role">{[person.role, person.credentials].filter(Boolean).join(' · ')}</p>
                  <p className="about-person__bio">{person.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. The word: dictionary panel */}
      <section id="approach" className="section section--tight" aria-labelledby="dict-word">
        <div className="container">
          <div className="panel panel--paper dictionary">
            <p className="dictionary__label">{dictionary.label}</p>
            <h2 id="dict-word" className="dictionary__word" lang="la">
              {dictionary.word}
            </h2>
            <p className="dictionary__forms" lang="la">
              <em>{dictionary.forms}</em>
            </p>
            <ol className="dictionary__senses">
              {dictionary.senses.map((sense) => (
                <li key={sense}>{sense}</li>
              ))}
            </ol>
            <p className="dictionary__etymology">
              <RichText value={dictionary.etymology} />
            </p>
          </div>
        </div>
      </section>

      {/* 5. On the level */}
      <section className="section section--tight" aria-labelledby="level-title">
        <div className="container">
          <div className="panel panel--black on-dark on-the-level">
            <h2 id="level-title" className="h2 on-the-level__title">
              {level.title}
            </h2>
            <Level size="large" label={ui.levelLabel} className="on-the-level__level" />

            <ul className="perspectives">
              {level.perspectives.map((p) => (
                <li key={p.label}>
                  <h3 className="perspectives__label">{p.label}</h3>
                  <p className="perspectives__text">{p.text}</p>
                </li>
              ))}
            </ul>

            <p className="on-the-level__intro">{level.markIntro}</p>

            <ul className="mark-parts">
              {markParts.map((m) => (
                <li key={m.part} className="mark-part">
                  <MarkPart part={m.part} />
                  <h3 className="mark-part__title">{m.title}</h3>
                  <p className="mark-part__text">{m.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 6. Six commitments */}
      <section className="section" aria-labelledby="commitments-title">
        <div className="container">
          <Headline id="commitments-title" title={commitments.title} />
          <p className="section-intro">{commitments.intro}</p>
          <ol className="tile-grid tile-grid--3">
            {commitments.items.map((item) => (
              <li key={item.numeral} className="tile">
                <span className="numeral" aria-hidden="true">
                  {item.numeral}
                </span>
                <h3 className="tile__title" lang={item.titleLang}>
                  {item.title}
                </h3>
                {item.subtitle && <p className="tile__subtitle">{item.subtitle}</p>}
                <p className="tile__text">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7. How we work */}
      <section id="how-we-work" className="section section--flush-top" aria-labelledby="steps-title">
        <div className="container">
          <Headline id="steps-title" title={steps.title} />
          <ol className="steps">
            {steps.items.map((step, i) => (
              <li key={step.title} className="step">
                <span className="step__number" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="step__title">{step.title}</h3>
                <p className="step__text">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. Closing pledge */}
      <section className="section closing" aria-labelledby="pledge-title">
        <div className="container closing__inner">
          <h2 id="pledge-title" className="eyebrow closing__eyebrow">
            {pledge.eyebrow}
          </h2>
          <p className="pledge">{pledge.text}</p>
          <PillLink href={lp(pledge.cta.href)}>{pledge.cta.label}</PillLink>
        </div>
      </section>
    </>
  );
}
