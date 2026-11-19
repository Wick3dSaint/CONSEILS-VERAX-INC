'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

const TABS = [
  ['services', 'Services'],
  ['bookings', 'Bookings'],
  ['availability', 'Availability'],
  ['contact', 'Contact details'],
  ['security', 'Security'],
];
const WEEKDAYS = [
  [1, 'Monday'],
  [2, 'Tuesday'],
  [3, 'Wednesday'],
  [4, 'Thursday'],
  [5, 'Friday'],
  [6, 'Saturday'],
  [7, 'Sunday'],
];
// Half-hour start times offered in the editor: 7:00 to 20:30.
const TIMES = Array.from({ length: 28 }, (_, i) => `${String(7 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`);
const TZ = 'America/Toronto';

const fmtDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
const fmtWhen = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
const dayLabel = (ymd) => fmtDay.format(new Date(`${ymd}T12:00:00Z`));
const timeLabel = (hm) => {
  const [h, m] = hm.split(':').map(Number);
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC', hour: 'numeric', minute: '2-digit' }).format(new Date(Date.UTC(2026, 0, 1, h, m)));
};
const clone = (o) => JSON.parse(JSON.stringify(o));
const datesBetween = (from, to) => {
  const out = [];
  const d = new Date(`${from}T12:00:00Z`);
  const end = new Date(`${to}T12:00:00Z`);
  while (d <= end && out.length < 366) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return out;
};

export default function AdminApp({ initialSettings, services, holidays, wording, twoStepEnabled }) {
  const [tab, setTab] = useState('services');
  const [saved, setSaved] = useState(initialSettings);
  const [draft, setDraft] = useState(clone(initialSettings));
  const [status, setStatus] = useState(null); // { kind: 'ok' | 'error', text, outside? }
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);

  useEffect(() => {
    const warn = (e) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const update = (fn) => {
    setDraft((d) => {
      const next = clone(d);
      fn(next);
      return next;
    });
    setStatus(null);
  };

  async function save() {
    setSaving(true);
    setStatus(null);
    setErrors({});
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: draft }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) return window.location.reload();
      if (data.ok) {
        setSaved(data.settings);
        setDraft(clone(data.settings));
        setStatus({ kind: 'ok', text: 'Saved. The website shows the change within a few seconds.', outside: data.outside ?? [] });
      } else if (data.errors) {
        setErrors(data.errors);
        setStatus({ kind: 'error', text: 'Please fix the highlighted fields.' });
      } else setStatus({ kind: 'error', text: 'Could not save. Please try again.' });
    } catch {
      setStatus({ kind: 'error', text: 'Could not save. Please check your connection.' });
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    window.location.reload();
  }

  const saveBar = (
    <div className="admin-savebar">
      <button type="button" className="pill pill--green" onClick={save} aria-disabled={!dirty || saving ? 'true' : undefined} disabled={!dirty || saving}>
        {saving ? 'Saving…' : 'Save changes'}
      </button>
      {dirty && (
        <button type="button" className="more-link button-reset" onClick={() => { setDraft(clone(saved)); setErrors({}); }}>
          Undo changes
        </button>
      )}
      {status && (
        <div role={status.kind === 'error' ? 'alert' : 'status'} className={status.kind === 'error' ? 'form-failure' : 'admin-ok'}>
          <p>{status.text}</p>
          {status.outside?.length > 0 && (
            <>
              <p>
                <strong>Note:</strong> these existing bookings are outside your new availability. They were not cancelled — cancel them
                in the Bookings tab if needed:
              </p>
              <ul>
                {status.outside.map((b) => (
                  <li key={b.id}>
                    {fmtWhen.format(new Date(b.start))} — {b.firstName} {b.lastName}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <main className="admin-main">
      <div className="admin-head">
        <h1 className="admin-h1">Website settings</h1>
        <button type="button" className="pill pill--outline" onClick={signOut}>
          Sign out
        </button>
      </div>

      <div className="admin-tabs" role="tablist" aria-label="Settings sections">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            className="admin-tab"
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="admin-card" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'services' && (
          <ServicesTab draft={draft} update={update} services={services} wording={wording} errors={errors} saveBar={saveBar} />
        )}
        {tab === 'bookings' && <BookingsTab />}
        {tab === 'availability' && <AvailabilityTab draft={draft} update={update} holidays={holidays} errors={errors} saveBar={saveBar} />}
        {tab === 'contact' && <ContactTab draft={draft} update={update} errors={errors} saveBar={saveBar} />}
        {tab === 'security' && <SecurityTab initiallyEnabled={twoStepEnabled} />}
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* Services                                                             */
/* ------------------------------------------------------------------ */

function ServicesTab({ draft, update, services, wording, errors, saveBar }) {
  const disabled = new Set(draft.services.disabled);
  const count = services.length - disabled.size;
  const heading = (lang) => {
    const w = wording.heading[lang];
    return (count === 1 ? w.one : w.other).replace('[[Count]]', wording.numberWords[lang][count] ?? String(count));
  };
  return (
    <>
      <h2 className="admin-h2">Services shown on the website</h2>
      <p className="admin-help">
        Switch a service off to hide it everywhere: home page, Services page, footer, contact form and “Often paired with”. Its text is kept, so
        switching it back on restores it. Sentences that count or list the services update automatically.
      </p>
      <ul className="admin-list">
        {services.map((s) => {
          const on = !disabled.has(s.id);
          const lastOne = on && count === 1;
          return (
            <li key={s.id} className="admin-row">
              <label className="admin-switch">
                <input
                  type="checkbox"
                  role="switch"
                  checked={on}
                  disabled={lastOne}
                  onChange={(e) =>
                    update((d) => {
                      const set = new Set(d.services.disabled);
                      if (e.target.checked) set.delete(s.id);
                      else set.add(s.id);
                      d.services.disabled = [...set];
                    })
                  }
                />
                <span className="admin-switch__track" aria-hidden="true" />
                <span>
                  <strong>{s.en}</strong> <span className="admin-muted" lang="fr">· {s.fr}</span>
                  <span className="admin-muted admin-state">{on ? 'Shown' : 'Hidden'}</span>
                </span>
              </label>
              {lastOne && <span className="admin-muted">At least one service must stay on.</span>}
            </li>
          );
        })}
      </ul>
      {errors.services && <p className="field-error">{errors.services}</p>}
      <div className="admin-preview">
        <p className="admin-muted">Home page heading after saving:</p>
        <p>
          <strong>Services.</strong> {heading('en')}
        </p>
        <p lang="fr">
          <strong>Services.</strong> {heading('fr')}
        </p>
      </div>
      {saveBar}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Bookings                                                             */
/* ------------------------------------------------------------------ */

function BookingsTab() {
  const [state, setState] = useState({ loading: true });
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/bookings', { cache: 'no-store' });
      if (res.status === 401) return window.location.reload();
      const data = await res.json();
      setState(data.ok ? { bookings: data.bookings } : { error: true });
    } catch {
      setState({ error: true });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function cancel(b) {
    if (!window.confirm(`Cancel ${b.firstName} ${b.lastName}’s consultation on ${fmtWhen.format(new Date(b.start))}? They will be emailed.`)) return;
    setBusyId(b.id);
    setMessage('');
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: b.id }),
      });
      const data = await res.json().catch(() => ({}));
      setMessage(data.ok ? `Cancelled. ${b.firstName} ${b.lastName} has been emailed, and the time is free again.` : 'Could not cancel this booking.');
      await load();
    } finally {
      setBusyId(null);
    }
  }

  if (state.loading) return <p role="status">Loading bookings…</p>;
  if (state.error) return <p className="form-failure">Could not load bookings. Please refresh.</p>;

  const now = Date.now();
  const upcoming = state.bookings.filter((b) => b.active && new Date(b.start) > now);
  const past = state.bookings.filter((b) => b.active && new Date(b.start) <= now).reverse();
  const cancelled = state.bookings.filter((b) => !b.active).reverse();

  const table = (rows, { withCancel }) => (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th scope="col">When (Eastern)</th>
            <th scope="col">Client</th>
            <th scope="col">How</th>
            <th scope="col">Message</th>
            {withCancel && <th scope="col"><span className="sr-only">Actions</span></th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.id}>
              <td>{fmtWhen.format(new Date(b.start))}</td>
              <td>
                <strong>
                  {b.firstName} {b.lastName}
                </strong>
                <br />
                <a href={`mailto:${b.email}`}>{b.email}</a>
                {b.phone && (
                  <>
                    <br />
                    <a href={`tel:${b.phone.replace(/[^\d+]/g, '')}`}>{b.phone}</a>
                  </>
                )}
                <br />
                <span className="admin-muted">{b.lang === 'fr' ? 'French' : 'English'} site</span>
              </td>
              <td>{b.meetingType === 'phone' ? 'Phone call' : 'Video call'}</td>
              <td className="admin-message">{b.message || <span className="admin-muted">—</span>}</td>
              {withCancel && (
                <td>
                  <button type="button" className="pill pill--outline" onClick={() => cancel(b)} disabled={busyId === b.id}>
                    {busyId === b.id ? 'Cancelling…' : 'Cancel'}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <h2 className="admin-h2">Upcoming consultations ({upcoming.length})</h2>
      {message && (
        <p className="admin-ok" role="status">
          {message}
        </p>
      )}
      {upcoming.length ? table(upcoming, { withCancel: true }) : <p className="admin-muted">No upcoming bookings.</p>}
      {past.length > 0 && (
        <>
          <h2 className="admin-h2">Past 30 days</h2>
          {table(past, { withCancel: false })}
        </>
      )}
      {cancelled.length > 0 && (
        <>
          <h2 className="admin-h2">Cancelled</h2>
          {table(cancelled, { withCancel: false })}
        </>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Availability                                                         */
/* ------------------------------------------------------------------ */

function AvailabilityTab({ draft, update, holidays, errors, saveBar }) {
  const b = draft.booking;
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const today = new Date().toISOString().slice(0, 10);

  const addClosed = () => {
    if (!from) return;
    const dates = datesBetween(from, to && to >= from ? to : from).filter((d) => d >= today);
    update((d) => {
      d.booking.closedDates = [...new Set([...d.booking.closedDates, ...dates])].sort();
    });
    setFrom('');
    setTo('');
  };

  const sorted = useMemo(() => [...b.dailySlots].sort(), [b.dailySlots]);

  return (
    <>
      <h2 className="admin-h2">Consultation availability</h2>
      <p className="admin-help">All times are Eastern Time (Montréal). Each consultation is 30 minutes. Québec public holidays are always closed.</p>

      <fieldset className="admin-fieldset">
        <legend>Days</legend>
        <div className="admin-checks">
          {WEEKDAYS.map(([n, label]) => (
            <label key={n} className="admin-check">
              <input
                type="checkbox"
                checked={b.weekdays.includes(n)}
                onChange={(e) =>
                  update((d) => {
                    const set = new Set(d.booking.weekdays);
                    if (e.target.checked) set.add(n);
                    else set.delete(n);
                    d.booking.weekdays = [...set].sort();
                  })
                }
              />
              {label}
            </label>
          ))}
        </div>
        {errors.weekdays && <p className="field-error">{errors.weekdays}</p>}
      </fieldset>

      <fieldset className="admin-fieldset">
        <legend>Start times</legend>
        <p className="admin-help">Currently: {sorted.map(timeLabel).join(', ') || 'none'}.</p>
        <div className="admin-checks admin-checks--times">
          {TIMES.map((t) => (
            <label key={t} className="admin-check">
              <input
                type="checkbox"
                checked={b.dailySlots.includes(t)}
                onChange={(e) =>
                  update((d) => {
                    const set = new Set(d.booking.dailySlots);
                    if (e.target.checked) set.add(t);
                    else set.delete(t);
                    d.booking.dailySlots = [...set].sort();
                  })
                }
              />
              {timeLabel(t)}
            </label>
          ))}
        </div>
        {errors.dailySlots && <p className="field-error">{errors.dailySlots}</p>}
      </fieldset>

      <div className="field-row">
        <div className="field">
          <label htmlFor="adm-min">Minimum notice</label>
          <select
            id="adm-min"
            value={b.minDaysAhead}
            onChange={(e) => update((d) => { d.booking.minDaysAhead = Number(e.target.value); })}
          >
            <option value={0}>Same day allowed</option>
            {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n === 1 ? 'From tomorrow (1 day)' : `${n} days`}
              </option>
            ))}
          </select>
          {errors.minDaysAhead && <p className="field-error">{errors.minDaysAhead}</p>}
        </div>
        <div className="field">
          <label htmlFor="adm-max">How far ahead people can book (days)</label>
          <input
            id="adm-max"
            type="number"
            min={1}
            max={365}
            value={b.maxDaysAhead}
            onChange={(e) => update((d) => { d.booking.maxDaysAhead = Number(e.target.value); })}
          />
          <p className="field__hint">{b.maxDaysAhead % 7 === 0 ? `${b.maxDaysAhead / 7} weeks` : `about ${Math.round(b.maxDaysAhead / 7)} weeks`}</p>
          {errors.maxDaysAhead && <p className="field-error">{errors.maxDaysAhead}</p>}
        </div>
      </div>

      <fieldset className="admin-fieldset">
        <legend>Closed days (vacations)</legend>
        <div className="admin-inline">
          <div className="field">
            <label htmlFor="adm-from">From</label>
            <input id="adm-from" type="date" min={today} value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="adm-to">To (optional)</label>
            <input id="adm-to" type="date" min={from || today} value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <button type="button" className="pill pill--outline" onClick={addClosed} disabled={!from}>
            Add
          </button>
        </div>
        {b.closedDates.length ? (
          <ul className="admin-chips">
            {b.closedDates.map((d) => (
              <li key={d}>
                {dayLabel(d)}
                <button
                  type="button"
                  className="button-reset admin-chip-x"
                  aria-label={`Reopen ${dayLabel(d)}`}
                  onClick={() => update((x) => { x.booking.closedDates = x.booking.closedDates.filter((y) => y !== d); })}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="admin-muted">No closed days.</p>
        )}
        {errors.closedDates && <p className="field-error">{errors.closedDates}</p>}
      </fieldset>

      <details className="admin-details">
        <summary>Québec public holidays (closed automatically)</summary>
        <ul>
          {holidays.map((h) => (
            <li key={h.date}>
              {dayLabel(h.date)} — {h.name}
            </li>
          ))}
        </ul>
      </details>
      {saveBar}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Contact details                                                      */
/* ------------------------------------------------------------------ */

function ContactTab({ draft, update, errors, saveBar }) {
  const c = draft.contact;
  const field = (id, label, value, onChange, hint, lang) => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        lang={lang}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={errors[id.replace('adm-', '')] ? 'true' : undefined}
        maxLength={254}
      />
      {hint && <p className="field__hint">{hint}</p>}
      {errors[id.replace('adm-', '')] && <p className="field-error">{errors[id.replace('adm-', '')]}</p>}
    </div>
  );
  return (
    <>
      <h2 className="admin-h2">Contact details shown on the website</h2>
      <p className="admin-help">
        Used in the footer, contact page, home page, booking pages and emails. The email address here is only what visitors see — the mailbox that
        sends emails is set in hPanel (SMTP_USER).
      </p>
      <div className="field-row">
        {field('adm-email', 'Email address', c.email, (v) => update((d) => { d.contact.email = v; }))}
        {field('adm-phone', 'Phone number', c.phone, (v) => update((d) => { d.contact.phone = v; }))}
      </div>
      <div className="field-row">
        {field('adm-hours.en', 'Office hours (English)', c.hours.en, (v) => update((d) => { d.contact.hours.en = v; }), `Office hours: ${c.hours.en}`)}
        {field('adm-hours.fr', 'Office hours (French)', c.hours.fr, (v) => update((d) => { d.contact.hours.fr = v; }), `Heures d’ouverture : ${c.hours.fr}`, 'fr')}
      </div>
      <div className="field-row">
        {field(
          'adm-responseTime.en',
          'Reply time (English)',
          c.responseTime.en,
          (v) => update((d) => { d.contact.responseTime.en = v; }),
          `“We’ll reply within ${c.responseTime.en} — that’s a promise, not an estimate.”`,
        )}
        {field(
          'adm-responseTime.fr',
          'Reply time (French)',
          c.responseTime.fr,
          (v) => update((d) => { d.contact.responseTime.fr = v; }),
          `« Nous vous répondrons d’ici ${c.responseTime.fr} — c’est une promesse, pas une estimation. »`,
          'fr',
        )}
      </div>
      {saveBar}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Security                                                             */
/* ------------------------------------------------------------------ */

function SecurityTab({ initiallyEnabled }) {
  const [enabled, setEnabled] = useState(initiallyEnabled);
  const [setup, setSetup] = useState(null); // { secret, qr }
  const [code, setCode] = useState('');
  const [message, setMessage] = useState(null);

  async function call(body) {
    const res = await fetch('/api/admin/two-step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.status === 401) window.location.reload();
    return res.json().catch(() => ({}));
  }

  async function start() {
    setMessage(null);
    const data = await call({ action: 'start' });
    if (data.ok) setSetup({ secret: data.secret, qr: data.qr });
    else setMessage({ kind: 'error', text: 'Could not start the setup. Please try again.' });
  }

  async function confirm(event) {
    event.preventDefault();
    const data = await call({ action: 'confirm', code });
    if (data.ok) {
      setEnabled(true);
      setSetup(null);
      setCode('');
      setMessage({ kind: 'ok', text: 'Two-step verification is on. From now on, signing in asks for a code from your app.' });
    } else setMessage({ kind: 'error', text: 'That code didn’t match. Check the time on your phone and use the newest code.' });
  }

  async function disable(event) {
    event.preventDefault();
    const data = await call({ action: 'disable', code });
    if (data.ok) {
      setEnabled(false);
      setCode('');
      setMessage({ kind: 'ok', text: 'Two-step verification is off.' });
    } else setMessage({ kind: 'error', text: 'That code didn’t match.' });
  }

  return (
    <>
      <h2 className="admin-h2">Sign-in security</h2>
      <p className="admin-help">
        <strong>Password:</strong> change it in hPanel (Websites → conseilsverax.ca → Node.js → Environment variables → <code>ADMIN_PASSWORD</code>
        , at least 12 characters). Changing it signs everyone out.
      </p>
      <h3 className="admin-h3">Two-step verification: {enabled ? 'on' : 'off'}</h3>
      <p className="admin-help">
        Adds a 6-digit code from an authenticator app (Microsoft Authenticator, Google Authenticator, 1Password…) to every sign-in.
      </p>
      {message && (
        <p className={message.kind === 'error' ? 'form-failure' : 'admin-ok'} role={message.kind === 'error' ? 'alert' : 'status'}>
          {message.text}
        </p>
      )}
      {!enabled && !setup && (
        <button type="button" className="pill pill--green" onClick={start}>
          Turn on two-step verification
        </button>
      )}
      {setup && (
        <form className="admin-twostep" onSubmit={confirm}>
          <p>1. In your authenticator app, add an account and scan this code:</p>
          <div className="admin-qr" dangerouslySetInnerHTML={{ __html: setup.qr }} role="img" aria-label="QR code for your authenticator app" />
          <p>
            Or enter this key by hand: <code className="admin-secret">{setup.secret.replace(/(.{4})/g, '$1 ').trim()}</code>
          </p>
          <div className="field">
            <label htmlFor="adm-confirm">2. Enter the 6-digit code the app shows</label>
            <input id="adm-confirm" inputMode="numeric" autoComplete="one-time-code" maxLength={7} value={code} onChange={(e) => setCode(e.target.value)} required />
          </div>
          <button type="submit" className="pill pill--green">
            Confirm and turn on
          </button>
        </form>
      )}
      {enabled && (
        <form className="admin-twostep" onSubmit={disable}>
          <div className="field">
            <label htmlFor="adm-disable">To turn it off, enter a current code from your app</label>
            <input id="adm-disable" inputMode="numeric" autoComplete="one-time-code" maxLength={7} value={code} onChange={(e) => setCode(e.target.value)} required />
          </div>
          <button type="submit" className="pill pill--outline">
            Turn off two-step verification
          </button>
        </form>
      )}
    </>
  );
}
