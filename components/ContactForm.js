'use client';

import { useEffect, useRef, useState } from 'react';
import { FIELD_ORDER, LIMITS, validateEnquiry } from '@/lib/validation';
import { LogoMark } from './Logo';

const EMPTY = {
  firstName: '',
  lastName: '',
  email: '',
  clientType: '',
  service: '',
  message: '',
  website: '', // honeypot: real visitors never see or fill this
};

/**
 * Consultation request form.
 * - First name, last name and email are required.
 * - Errors appear inline, linked with aria-describedby; focus moves to the first invalid field.
 * - Submits JSON to POST /api/contact.
 * All copy arrives through props (from lib/content.js) so this bundle stays small.
 */
export default function ContactForm({ copy, serviceOptions }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | failure

  const fieldRefs = {
    firstName: useRef(null),
    lastName: useRef(null),
    email: useRef(null),
    clientType: useRef(null),
    service: useRef(null),
    message: useRef(null),
  };
  const successHeadingRef = useRef(null);
  // Focus is moved after React has rendered the new state (so error text is
  // already linked when a screen reader announces the field).
  const pendingFocus = useRef(null);

  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    const el = target === 'success' ? successHeadingRef.current : fieldRefs[target]?.current;
    el?.focus();
  });

  // Pre-select the service when arriving from a service page CTA (/contact?service=tax-prep).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('service');
    const match = serviceOptions.find((o) => o.id === id);
    if (match) setValues((v) => ({ ...v, service: match.value }));
  }, [serviceOptions]);

  function errorMessage(field) {
    const code = errors[field];
    if (!code) return null;
    return copy.errors[field]?.[code] ?? copy.errors[field]?.required ?? null;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    const next = { ...values, [name]: value };
    setValues(next);
    // Once a field has been flagged, clear its error as soon as it becomes valid.
    if (errors[name]) {
      const { errors: fresh } = validateEnquiry(next);
      setErrors((prev) => {
        const updated = { ...prev };
        if (fresh[name]) updated[name] = fresh[name];
        else delete updated[name];
        return updated;
      });
    }
  }

  function showErrors(found) {
    setErrors(found);
    const first = FIELD_ORDER.find((f) => found[f]);
    if (first) pendingFocus.current = first;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'sending') return;

    const { values: clean, errors: found, isValid } = validateEnquiry(values);
    if (!isValid) {
      showErrors(found);
      setStatus('idle');
      return;
    }

    setErrors({});
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...clean, website: values.website }),
      });

      if (response.ok) {
        pendingFocus.current = 'success';
        setStatus('success');
        return;
      }

      if (response.status === 422) {
        const data = await response.json().catch(() => null);
        if (data?.errors && Object.keys(data.errors).length > 0) {
          showErrors(data.errors);
          setStatus('idle');
          return;
        }
      }

      setStatus('failure');
    } catch {
      setStatus('failure');
    }
  }

  function startOver() {
    setValues(EMPTY);
    setErrors({});
    pendingFocus.current = 'firstName';
    setStatus('idle');
  }

  if (status === 'success') {
    return (
      <div className="form-success">
        <LogoMark width={64} height={32} />
        <h2 className="form-success__title" ref={successHeadingRef} tabIndex={-1}>
          {copy.success.title}
        </h2>
        <p className="form-success__text">{copy.success.text}</p>
        <button type="button" className="more-link button-reset" onClick={startOver}>
          {copy.success.again}
          <span className="chev" aria-hidden="true">
            {' ›'}
          </span>
        </button>
      </div>
    );
  }

  const sending = status === 'sending';

  function fieldProps(name) {
    const hasError = Boolean(errors[name]);
    return {
      id: `cf-${name}`,
      name,
      ref: fieldRefs[name],
      value: values[name],
      onChange: handleChange,
      'aria-invalid': hasError ? 'true' : undefined,
      'aria-describedby': hasError ? `cf-${name}-error` : undefined,
    };
  }

  function renderError(name) {
    const message = errorMessage(name);
    if (!message) return null;
    return (
      <p id={`cf-${name}-error`} className="field-error">
        {message}
      </p>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate aria-label={copy.label}>
      <div className="field-row">
        <div className="field">
          <label htmlFor="cf-firstName">{copy.fields.firstName}</label>
          <input
            {...fieldProps('firstName')}
            type="text"
            autoComplete="given-name"
            required
            maxLength={LIMITS.name}
          />
          {renderError('firstName')}
        </div>
        <div className="field">
          <label htmlFor="cf-lastName">{copy.fields.lastName}</label>
          <input
            {...fieldProps('lastName')}
            type="text"
            autoComplete="family-name"
            required
            maxLength={LIMITS.name}
          />
          {renderError('lastName')}
        </div>
      </div>

      <div className="field">
        <label htmlFor="cf-email">{copy.fields.email}</label>
        <input
          {...fieldProps('email')}
          type="email"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          required
          maxLength={LIMITS.email}
        />
        {renderError('email')}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="cf-clientType">{copy.fields.clientType}</label>
          <select {...fieldProps('clientType')}>
            <option value="">{copy.selectPrompt}</option>
            {copy.clientTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="cf-service">{copy.fields.service}</label>
          <select {...fieldProps('service')}>
            <option value="">{copy.selectPrompt}</option>
            {serviceOptions.map((o) => (
              <option key={o.id} value={o.value}>
                {o.value}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="cf-message">
          {copy.fields.message} <span className="field__optional">{copy.fields.optional}</span>
        </label>
        <textarea {...fieldProps('message')} rows={6} maxLength={LIMITS.message} />
        {renderError('message')}
      </div>

      {/* Honeypot for simple spam bots. Hidden from people and assistive technology. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="cf-website">{copy.fields.honeypot}</label>
        <input
          id="cf-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={handleChange}
        />
      </div>

      {status === 'failure' && (
        <p className="form-failure" role="alert">
          {copy.failure}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="pill pill--green" aria-disabled={sending ? 'true' : undefined}>
          {sending ? copy.sending : copy.submit}
        </button>
        <p className="form-actions__note">{copy.privacy}</p>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {sending ? copy.sending : ''}
      </p>
    </form>
  );
}
