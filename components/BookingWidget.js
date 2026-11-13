'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { BOOKING_FIELD_ORDER, LIMITS, validateBooking } from '@/lib/validation';
import { LogoMark } from './Logo';

const EMPTY = { firstName: '', lastName: '', email: '', meetingType: '', phone: '', message: '', website: '' };
const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '');

/** 'YYYY-MM-DD' calendar date → Date at noon UTC (formatting it in UTC never shifts the day). */
const dayDate = (ymd) => new Date(`${ymd}T12:00:00Z`);
const addDays = (ymd, n) => {
  const d = dayDate(ymd);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const isoWeekday = (ymd) => dayDate(ymd).getUTCDay() || 7;

/**
 * Online booking: choose a day, then a time, then enter details.
 * Slots come from /api/booking/slots; times are shown in Eastern Time (Montréal).
 */
export default function BookingWidget({ copy, lang, locale, timeZone, homeHref }) {
  const [load, setLoad] = useState('loading'); // loading | ready | unavailable | error
  const [slots, setSlots] = useState([]);
  const [day, setDay] = useState(null);
  const [slot, setSlot] = useState(null);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [notice, setNotice] = useState('');
  const [booked, setBooked] = useState(null);

  const refs = {
    times: useRef(null),
    form: useRef(null),
    notice: useRef(null),
    done: useRef(null),
    firstName: useRef(null),
    lastName: useRef(null),
    email: useRef(null),
    meetingType: useRef(null),
    phone: useRef(null),
    message: useRef(null),
  };
  const pendingFocus = useRef(null);
  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    refs[target]?.current?.focus();
  });

  async function loadSlots() {
    try {
      const res = await fetch('/api/booking/slots', { cache: 'no-store' });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setLoad('unavailable');
        return [];
      }
      setSlots(data.slots);
      setLoad('ready');
      return data.slots;
    } catch {
      setLoad('unavailable');
      return [];
    }
  }

  useEffect(() => {
    loadSlots();
  }, []);

  /* ---------- formatting ---------- */
  const fmt = useMemo(
    () => ({
      longDay: new Intl.DateTimeFormat(locale, { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' }),
      month: new Intl.DateTimeFormat(locale, { timeZone: 'UTC', month: 'long', year: 'numeric' }),
      shortMonth: new Intl.DateTimeFormat(locale, { timeZone: 'UTC', month: 'short' }),
      weekday: new Intl.DateTimeFormat(locale, { timeZone: 'UTC', weekday: 'short' }),
      time: new Intl.DateTimeFormat(locale, { timeZone, hour: 'numeric', minute: '2-digit' }),
    }),
    [locale, timeZone],
  );

  /* ---------- calendar ---------- */
  const byDay = useMemo(() => {
    const map = new Map();
    for (const s of slots) {
      if (!map.has(s.date)) map.set(s.date, []);
      map.get(s.date).push(s);
    }
    return map;
  }, [slots]);

  const weeks = useMemo(() => {
    if (!slots.length) return [];
    const first = slots[0].date;
    const last = slots.at(-1).date;
    let cursor = addDays(first, 1 - isoWeekday(first)); // Monday of the first week
    const end = addDays(last, 7 - isoWeekday(last)); // Sunday of the last week
    const rows = [];
    while (cursor <= end) {
      rows.push(Array.from({ length: 7 }, (_, i) => addDays(cursor, i)));
      cursor = addDays(cursor, 7);
    }
    return rows;
  }, [slots]);

  const monthCaption = useMemo(() => {
    if (!slots.length) return '';
    const a = fmt.month.format(dayDate(slots[0].date));
    const b = fmt.month.format(dayDate(slots.at(-1).date));
    return a === b ? a : `${a} – ${b}`;
  }, [slots, fmt]);

  const weekdayNames = useMemo(
    () => Array.from({ length: 7 }, (_, i) => fmt.weekday.format(dayDate(addDays('2026-11-16', i)))), // a Monday
    [fmt],
  );

  function chooseDay(date) {
    setDay(date);
    setSlot(null);
    setNotice('');
    pendingFocus.current = 'times';
  }

  function chooseSlot(s) {
    setSlot(s);
    setNotice('');
    pendingFocus.current = 'form';
  }

  /* ---------- form ---------- */
  function handleChange(event) {
    const { name, value } = event.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (errors[name] || (name === 'meetingType' && errors.phone)) {
      const { errors: fresh } = validateBooking({ ...next, start: slot?.start });
      setErrors((prev) => {
        const updated = { ...prev };
        for (const key of [name, 'phone']) {
          if (fresh[key]) updated[key] = fresh[key];
          else delete updated[key];
        }
        return updated;
      });
    }
  }

  function showErrors(found) {
    setErrors(found);
    const first = BOOKING_FIELD_ORDER.find((f) => found[f]);
    if (first) pendingFocus.current = first;
  }

  function errorText(field) {
    const code = errors[field];
    if (!code) return null;
    return copy.form.errors[field]?.[code] ?? copy.form.errors[field]?.required ?? null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'sending' || !slot) return;
    const { values: clean, errors: found, isValid } = validateBooking({ ...values, start: slot.start });
    if (!isValid) {
      showErrors(found);
      return;
    }
    setErrors({});
    setNotice('');
    setStatus('sending');
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...clean, website: values.website, lang }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setBooked({ ...slot, meetingType: clean.meetingType, phone: clean.phone, email: clean.email });
        setStatus('done');
        pendingFocus.current = 'done';
        return;
      }
      setStatus('idle');
      if (res.status === 422 && data?.errors) return showErrors(data.errors);
      if (data?.error === 'slot_taken') {
        const fresh = await loadSlots();
        setSlot(null);
        if (!fresh.some((s) => s.date === day)) setDay(null);
        setNotice(copy.slotTaken);
      } else if (data?.error === 'already_booked') setNotice(copy.alreadyBooked);
      else if (res.status === 429) setNotice(copy.rateLimited);
      else if (res.status === 503) setNotice(copy.unavailable);
      else setNotice(copy.failure);
      pendingFocus.current = 'notice';
    } catch {
      setStatus('idle');
      setNotice(copy.failure);
      pendingFocus.current = 'notice';
    }
  }

  /* ---------- render ---------- */
  if (status === 'done' && booked) {
    return (
      <div className="form-success booking-done">
        <LogoMark width={64} height={32} />
        <h2 className="form-success__title" ref={refs.done} tabIndex={-1}>
          {copy.success.title}
        </h2>
        <p className="booking-done__when">
          {fill(copy.success.when, {
            date: fmt.longDay.format(dayDate(booked.date)),
            time: fmt.time.format(new Date(booked.start)),
          })}
        </p>
        <p className="form-success__text">
          {booked.meetingType === 'phone' ? fill(copy.success.phoneNext, { phone: booked.phone }) : copy.success.videoNext}{' '}
          {fill(copy.success.emailNote, { email: booked.email })}
        </p>
        <Link href={homeHref} className="more-link">
          {copy.success.home.label}
          <span className="chev" aria-hidden="true">
            {' ›'}
          </span>
        </Link>
      </div>
    );
  }

  if (load === 'loading') {
    return (
      <p className="booking-status" role="status">
        {copy.loading}
      </p>
    );
  }
  if (load === 'unavailable') {
    return (
      <p className="booking-status booking-status--warn" role="alert">
        {copy.unavailable}
      </p>
    );
  }
  if (!slots.length) {
    return <p className="booking-status">{copy.noSlots}</p>;
  }

  const daySlots = day ? (byDay.get(day) ?? []) : [];
  const sending = status === 'sending';

  return (
    <div className="booking">
      <p className="booking__tz">{copy.timeZoneNote}</p>

      {notice && (
        <p className="form-failure" role="alert" ref={refs.notice} tabIndex={-1}>
          {notice}
        </p>
      )}

      {/* Step 1: day */}
      <section className="booking-step" aria-labelledby="step-day">
        <h2 id="step-day" className="booking-step__title">
          <span className="booking-step__n" aria-hidden="true">1</span> {copy.steps.date}
        </h2>
        <table className="calendar">
          <caption className="calendar__caption">
            <span className="sr-only">{copy.calendarCaption}, </span>
            {monthCaption}
          </caption>
          <thead>
            <tr>
              {weekdayNames.map((name) => (
                <th key={name} scope="col" abbr={name}>
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={week[0]}>
                {week.map((date) => {
                  const open = byDay.has(date);
                  const d = dayDate(date);
                  const n = d.getUTCDate();
                  const label = fmt.longDay.format(d);
                  return (
                    <td key={date}>
                      {open ? (
                        <button
                          type="button"
                          className="calendar__day"
                          aria-pressed={day === date}
                          aria-label={`${label}, ${copy.available}`}
                          onClick={() => chooseDay(date)}
                        >
                          {n}
                          {n === 1 && <span className="calendar__month">{fmt.shortMonth.format(d)}</span>}
                        </button>
                      ) : (
                        <span className="calendar__day calendar__day--off" aria-hidden="true">
                          {n}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Step 2: time */}
      {day && (
        <section className="booking-step" aria-labelledby="step-time">
          <h2 id="step-time" className="booking-step__title" ref={refs.times} tabIndex={-1}>
            <span className="booking-step__n" aria-hidden="true">2</span>{' '}
            {fill(copy.timesFor, { date: fmt.longDay.format(dayDate(day)) })}
          </h2>
          <ul className="booking-times">
            {daySlots.map((s) => (
              <li key={s.start}>
                <button
                  type="button"
                  className="pill pill--outline booking-time"
                  aria-pressed={slot?.start === s.start}
                  onClick={() => chooseSlot(s)}
                >
                  {fmt.time.format(new Date(s.start))}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Step 3: details */}
      {slot && (
        <section className="booking-step" aria-labelledby="step-details">
          <h2 id="step-details" className="booking-step__title" ref={refs.form} tabIndex={-1}>
            <span className="booking-step__n" aria-hidden="true">3</span> {copy.steps.details}
          </h2>
          <p className="booking-selected">
            {copy.form.selected}{' '}
            <strong>
              {fill(copy.success.when, { date: fmt.longDay.format(dayDate(slot.date)), time: fmt.time.format(new Date(slot.start)) })}
            </strong>{' '}
            <button type="button" className="more-link button-reset" onClick={() => chooseDay(day)}>
              {copy.form.change}
            </button>
          </p>

          <form className="contact-form" onSubmit={handleSubmit} noValidate aria-label={copy.form.label}>
            <div className="field-row">
              {['firstName', 'lastName'].map((name) => (
                <div className="field" key={name}>
                  <label htmlFor={`bk-${name}`}>{copy.form[name]}</label>
                  <input
                    id={`bk-${name}`}
                    name={name}
                    ref={refs[name]}
                    value={values[name]}
                    onChange={handleChange}
                    type="text"
                    autoComplete={name === 'firstName' ? 'given-name' : 'family-name'}
                    required
                    maxLength={LIMITS.name}
                    aria-invalid={errors[name] ? 'true' : undefined}
                    aria-describedby={errors[name] ? `bk-${name}-error` : undefined}
                  />
                  {errors[name] && (
                    <p id={`bk-${name}-error`} className="field-error">
                      {errorText(name)}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="field">
              <label htmlFor="bk-email">{copy.form.email}</label>
              <input
                id="bk-email"
                name="email"
                ref={refs.email}
                value={values.email}
                onChange={handleChange}
                type="email"
                autoComplete="email"
                inputMode="email"
                spellCheck={false}
                required
                maxLength={LIMITS.email}
                aria-invalid={errors.email ? 'true' : undefined}
                aria-describedby={errors.email ? 'bk-email-error' : undefined}
              />
              {errors.email && (
                <p id="bk-email-error" className="field-error">
                  {errorText('email')}
                </p>
              )}
            </div>

            <fieldset
              className="field meeting-type"
              aria-invalid={errors.meetingType ? 'true' : undefined}
              aria-describedby={errors.meetingType ? 'bk-meetingType-error' : undefined}
            >
              <legend>{copy.form.meetingType}</legend>
              <div className="meeting-type__options">
                {[
                  ['phone', copy.form.phoneCall],
                  ['video', copy.form.videoCall],
                ].map(([value, label], i) => (
                  <label key={value} className="meeting-type__option">
                    <input
                      type="radio"
                      name="meetingType"
                      value={value}
                      checked={values.meetingType === value}
                      onChange={handleChange}
                      ref={i === 0 ? refs.meetingType : undefined}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              {errors.meetingType && (
                <p id="bk-meetingType-error" className="field-error">
                  {errorText('meetingType')}
                </p>
              )}
              {values.meetingType === 'video' && <p className="field__hint">{copy.form.videoHint}</p>}
            </fieldset>

            {values.meetingType === 'phone' && (
              <div className="field">
                <label htmlFor="bk-phone">{copy.form.phone}</label>
                <input
                  id="bk-phone"
                  name="phone"
                  ref={refs.phone}
                  value={values.phone}
                  onChange={handleChange}
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  maxLength={LIMITS.phone}
                  aria-invalid={errors.phone ? 'true' : undefined}
                  aria-describedby={`bk-phone-hint${errors.phone ? ' bk-phone-error' : ''}`}
                />
                <p id="bk-phone-hint" className="field__hint">
                  {copy.form.phoneHint}
                </p>
                {errors.phone && (
                  <p id="bk-phone-error" className="field-error">
                    {errorText('phone')}
                  </p>
                )}
              </div>
            )}

            <div className="field">
              <label htmlFor="bk-message">
                {copy.form.message} <span className="field__optional">{copy.form.optional}</span>
              </label>
              <textarea
                id="bk-message"
                name="message"
                ref={refs.message}
                value={values.message}
                onChange={handleChange}
                rows={4}
                maxLength={LIMITS.message}
                aria-invalid={errors.message ? 'true' : undefined}
                aria-describedby={errors.message ? 'bk-message-error' : undefined}
              />
              {errors.message && (
                <p id="bk-message-error" className="field-error">
                  {errorText('message')}
                </p>
              )}
            </div>

            {/* Honeypot for simple spam bots. Hidden from people and assistive technology. */}
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="bk-website">Website</label>
              <input id="bk-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={handleChange} />
            </div>

            <div className="form-actions">
              <button type="submit" className="pill pill--green" aria-disabled={sending ? 'true' : undefined}>
                {sending ? copy.form.sending : copy.form.submit}
              </button>
              <p className="form-actions__note">{copy.form.privacy}</p>
            </div>
            <p className="sr-only" role="status" aria-live="polite">
              {sending ? copy.form.sending : ''}
            </p>
          </form>
        </section>
      )}
    </div>
  );
}
