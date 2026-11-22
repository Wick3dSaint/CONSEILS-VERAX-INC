'use client';

import { useId, useState } from 'react';
import { corporateDates, formatLongDate } from '@/lib/taxDates';

/** Corporate deadlines for a fiscal year-end the visitor enters. */
export default function YearEndCalculator({ copy, locale, defaultYearEnd, weekendNote }) {
  const [yearEnd, setYearEnd] = useState(defaultYearEnd);
  const id = useId();
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(yearEnd);
  const dates = valid ? corporateDates(yearEnd) : null;
  const show = (date) => formatLongDate(locale, date);

  return (
    <div className="year-end">
      <div className="field year-end__field">
        <label htmlFor={id} className="field__label">
          {copy.label}
        </label>
        <input
          id={id}
          type="date"
          className="field__input"
          value={yearEnd}
          aria-describedby={`${id}-hint`}
          onChange={(e) => setYearEnd(e.target.value)}
        />
        <p id={`${id}-hint`} className="field__hint">
          {copy.hint}
        </p>
      </div>

      <div aria-live="polite">
        {dates ? (
          <ul className="tax-dates tax-dates--compact">
            {['balance', 'balanceCcpc', 'filing'].map((key) => (
              <li key={key} className="tax-date">
                <p className="tax-date__when">{show(dates[key].date)}</p>
                <div>
                  <h3 className="tax-date__title">{copy[key].title}</h3>
                  <p className="tax-date__note">{copy[key].note}</p>
                  {dates[key].shiftedTo && <p className="tax-date__shift">{weekendNote.replace('{date}', show(dates[key].shiftedTo))}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">{copy.empty}</p>
        )}
      </div>
    </div>
  );
}
