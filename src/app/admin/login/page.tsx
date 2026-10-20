'use client';

import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import styles from '../admin.module.css';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        setError((await res.json().catch(() => null))?.error || 'Sign in failed');
        return;
      }
      const next = new URLSearchParams(window.location.search).get('next');
      // Only follow same-site admin paths
      window.location.assign(next && next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin');
    } catch {
      setError('Network error — try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className={`${styles.card} ${styles.loginCard}`}>
      <div className={styles.brand} style={{ marginBottom: '1rem' }}>
        <strong>Chikchik</strong>
        <span>Admin</span>
      </div>
      <h1 className={styles.loginTitle}>
        <Lock size={18} /> Sign in
      </h1>
      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="username" required className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" required className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && (
          <span className={styles.fieldError} role="alert">
            {error}
          </span>
        )}
        <button type="submit" className={styles.btnPrimary} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </div>
    </form>
  );
}
