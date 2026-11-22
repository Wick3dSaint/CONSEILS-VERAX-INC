import YearEndCalculator from '@/components/YearEndCalculator';
import { Headline, PillLink } from '@/components/Text';
import { BOOKING } from '@/lib/booking/config';
import { todayInZone } from '@/lib/booking/time';
import { getContent, localePath, pageMetadata } from '@/lib/i18n';
import { formatLongDate, personalDates } from '@/lib/taxDates';

// Rebuilt at least hourly, so "the next twelve months" always starts today.
export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { taxDatesPage } = await getContent(lang);
  const meta = pageMetadata(lang, '/tax-dates', { title: taxDatesPage.meta.title, description: taxDatesPage.meta.description });
  // While a draft (dates not yet confirmed by the firm), keep it out of search engines.
  return taxDatesPage.draft ? { ...meta, robots: { index: false, follow: false } } : meta;
}

export default async function TaxDatesPage({ params }) {
  const { lang } = await params;
  const { taxDatesPage, site } = await getContent(lang);
  const { hero, personal, corporate, disclaimer, cta } = taxDatesPage;
  const today = todayInZone(BOOKING.timeZone);
  const events = personalDates(today);
  const show = (date) => formatLongDate(site.locale, date);
  const day = new Intl.DateTimeFormat(site.locale, { day: 'numeric', timeZone: 'UTC' });
  const month = new Intl.DateTimeFormat(site.locale, { month: 'short', timeZone: 'UTC' });

  return (
    <>
      {/* 1. Hero */}
      <section className="hero" aria-labelledby="tax-dates-title">
        <div className="container fade-up">
          <p className="eyebrow hero__eyebrow">{hero.eyebrow}</p>
          <Headline as="h1" id="tax-dates-title" title={hero.title} className="display" />
          <p className="hero__lead">{hero.lead}</p>
        </div>
      </section>

      {/* 2. Individuals: the next twelve months */}
      <section className="section section--tight" aria-labelledby="personal-title">
        <div className="container">
          <Headline id="personal-title" title={personal.title} />
          <ol className="tax-dates">
            {events.map((e) => {
              const text = personal.events[e.id];
              const d = new Date(`${e.date}T00:00:00Z`);
              return (
                <li key={`${e.id}-${e.date}`} className="tax-date">
                  <p className="tax-date__badge" aria-hidden="true">
                    <span className="tax-date__day">{day.format(d)}</span>
                    <span className="tax-date__month">{month.format(d)}</span>
                  </p>
                  <div>
                    <p className="tax-date__when">
                      <time dateTime={e.date}>{show(e.date)}</time>
                    </p>
                    <h3 className="tax-date__title">{text.title}</h3>
                    <p className="tax-date__note">{text.note.replace('{year}', e.taxYear)}</p>
                    {e.shiftedTo && <p className="tax-date__shift">{personal.weekend.replace('{date}', show(e.shiftedTo))}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 3. Corporations: year-end calculator */}
      <section className="section section--flush-top" aria-labelledby="corporate-title">
        <div className="container">
          <div className="panel panel--paper">
            <Headline id="corporate-title" title={corporate.title} />
            <YearEndCalculator
              copy={corporate}
              locale={site.locale}
              defaultYearEnd={`${today.slice(0, 4)}-12-31`}
              weekendNote={personal.weekend}
            />
          </div>
          <p className="tax-dates__disclaimer">{disclaimer}</p>
        </div>
      </section>

      {/* 4. Call to action */}
      <section className="section closing" aria-labelledby="tax-dates-cta">
        <div className="container closing__inner">
          <h2 id="tax-dates-cta" className="h2">
            {cta.title}
          </h2>
          <PillLink href={localePath(lang, cta.link.href)}>{cta.link.label}</PillLink>
        </div>
      </section>
    </>
  );
}
