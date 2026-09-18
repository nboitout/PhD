'use client';

import { useState, FormEvent } from 'react';
import BrandMark from '@/components/admin/BrandMark';
import '../admin.css';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = '/admin';
      } else {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? 'Incorrect password');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="adm-login-wrap">
      <div className="adm-login-card">
        <p className="adm-login-brand">
          <BrandMark size={24} />
          <span>Doctoral dissertation</span>
        </p>
        <h1 className="adm-login-title">Admin</h1>
        <p className="adm-login-sub">Visitor analytics for nicolas-boitout.phd</p>
        <form onSubmit={handleSubmit} className="adm-login-form">
          <label className="adm-login-label" htmlFor="password">
            Password
          </label>
          <div className="adm-login-input-wrap">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="adm-login-input"
              placeholder="Enter admin password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="adm-login-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {error && <p className="adm-login-error">{error}</p>}
          <button type="submit" className="adm-login-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
      <p className="adm-login-back">
        <a href="/">&larr; back to the dissertation</a>
      </p>
    </div>
  );
}
