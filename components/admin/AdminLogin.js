'use client';

import { useRef, useState } from 'react';

const MESSAGES = {
  invalid: 'That password isn’t right.',
  invalid_code: 'That code isn’t right. Use the current 6-digit code from your authenticator app.',
  locked: 'Too many attempts. Please wait 15 minutes and try again.',
  not_configured: 'The admin password isn’t set up yet.',
};

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [needCode, setNeedCode] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const codeRef = useRef(null);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, code: needCode ? code : undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.ok) return window.location.reload();
      if (data.error === 'code_required') {
        setNeedCode(true);
        setTimeout(() => codeRef.current?.focus(), 0);
      } else setError(MESSAGES[data.error] ?? 'Sign-in failed. Please try again.');
    } catch {
      setError('Sign-in failed. Please check your connection.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-card admin-login" onSubmit={submit}>
      <h1 className="admin-h1">Sign in</h1>
      <div className="field">
        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          readOnly={needCode}
        />
      </div>
      {needCode && (
        <div className="field">
          <label htmlFor="admin-code">6-digit code from your authenticator app</label>
          <input
            id="admin-code"
            ref={codeRef}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]*"
            maxLength={7}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
      )}
      {error && (
        <p className="form-failure" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="pill pill--green" aria-disabled={busy ? 'true' : undefined}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
