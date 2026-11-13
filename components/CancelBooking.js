'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BOOKING } from '@/lib/booking/config';

const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '');

/** Cancellation page opened from the link in the confirmation email (?token=…). */
export default function CancelBooking({ copy, locale, keepHref, bookHref }) {
  const [state, setState] = useState('loading'); // loading | active | cancelling | cancelled | done | invalid | past | error
  const [start, setStart] = useState(null);
  const [token, setToken] = useState('');
  const heading = useRef(null);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token') || '';
    setToken(t);
    if (!t) return setState('invalid');
    fetch(`/api/booking/cancel?token=${encodeURIComponent(t)}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!data?.ok) return setState('error');
        setStart(data.start ?? null);
        setState(data.status);
      })
      .catch(() => setState('error'));
  }, []);

  useEffect(() => {
    if (state !== 'loading') heading.current?.focus();
  }, [state]);

  async function cancel() {
    setState('cancelling');
    try {
      const res = await fetch('/api/booking/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) return setState('done');
      setState(data?.status && data.status !== 'active' ? data.status : 'error');
    } catch {
      setState('error');
    }
  }

  const when = start
    ? fill(copy.details, {
        date: new Intl.DateTimeFormat(locale, { timeZone: BOOKING.timeZone, weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(start)),
        time: new Intl.DateTimeFormat(locale, { timeZone: BOOKING.timeZone, hour: 'numeric', minute: '2-digit' }).format(new Date(start)),
      })
    : '';

  const messages = { invalid: copy.invalid, cancelled: copy.alreadyCancelled, past: copy.past, error: copy.failure };

  if (state === 'loading') return <p role="status">{copy.loading}</p>;

  if (state === 'done') {
    return (
      <div className="form-success">
        <h1 id="cancel-title" className="form-success__title" ref={heading} tabIndex={-1}>
          {copy.doneTitle}
        </h1>
        <p className="form-success__text">{copy.doneText}</p>
        <Link href={bookHref} className="pill pill--green">
          {copy.bookAgain.label}
        </Link>
      </div>
    );
  }

  if (state === 'active' || state === 'cancelling') {
    return (
      <div className="form-success">
        <h1 id="cancel-title" className="form-success__title" ref={heading} tabIndex={-1}>
          {copy.title}
        </h1>
        <p className="booking-done__when">{when}</p>
        <div className="form-actions form-actions--center">
          <button type="button" className="pill pill--black" onClick={cancel} aria-disabled={state === 'cancelling' ? 'true' : undefined}>
            {state === 'cancelling' ? copy.cancelling : copy.confirm}
          </button>
          <Link href={keepHref} className="more-link">
            {copy.keep.label}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="form-success">
      <h1 id="cancel-title" className="form-success__title" ref={heading} tabIndex={-1}>
        {copy.meta.title}
      </h1>
      <p className="form-success__text">{messages[state] ?? copy.failure}</p>
      <Link href={bookHref} className="more-link">
        {copy.bookAgain.label}
      </Link>
    </div>
  );
}
