import { getDictionary, localePath, pageMetadata } from '@/lib/i18n';
import { Level } from '@/components/Level';
import { LogoMark } from '@/components/Logo';
import { Headline, PillLink, RichText } from '@/components/Text';

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { approach } = getDictionary(lang);
  return pageMetadata(lang, '/approach', { title: approach.meta.title, description: approach.meta.description });
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

export default async function ApproachPage({ params }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  const { approach, markParts, ui } = dict;
  const lp = (path) => localePath(lang, path);
  const { hero, dictionary, level, commitments, steps, pledge } = approach;

  return (
    <>
      {/* 1. Hero */}
      <section className="hero" aria-labelledby="approach-title">
        <div className="container fade-up">
          <p className="eyebrow hero__eyebrow">{hero.eyebrow}</p>
          <Headline as="h1" id="approach-title" title={hero.title} className="display" />
        </div>
      </section>

      {/* 2. Dictionary panel */}
      <section className="section section--tight" aria-labelledby="dict-word">
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

      {/* 3. On the level */}
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

      {/* 4. Six commitments */}
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

      {/* 5. How we work */}
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

      {/* 6. Closing pledge */}
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
