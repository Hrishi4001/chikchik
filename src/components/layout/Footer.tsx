'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { INFO_PAGES, LEGAL_PAGES } from '@/lib/legal';
import { openCookiePreferences } from '@/lib/consent';
import styles from './footer.module.css';

export default function Footer() {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    showToast('You’re on the mailing list. Stay tuned!', 'success');
    setEmail('');
  };

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.wrapper}`}>
        <div className={styles.blocks}>
          <div className={styles.block}>
            <p className={styles.heading}>Explore</p>
            <ul className={styles.menu}>
              {INFO_PAGES.map((p) => (
                <li key={p.href}>
                  <Link href={p.href}>{p.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.block}>
            <p className={styles.heading}>Terms &amp; Conditions</p>
            <ul className={styles.menu}>
              {LEGAL_PAGES.map((p) => (
                <li key={p.href}>
                  <Link href={p.href}>{p.label}</Link>
                </li>
              ))}
              <li>
                <button type="button" onClick={openCookiePreferences}>
                  Cookie Preferences
                </button>
              </li>
            </ul>
          </div>

          <div className={styles.block}>
            <ul className={styles.menu}>
              <li>
                <Link href="#footer-email">Join the Chikchik mailing list to get updates on new launches, drops and sales.</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.subscribe}>
          <form onSubmit={handleSubscribe} className={styles.form} noValidate>
            <label htmlFor="footer-email" className={styles.srOnly}>
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <button type="submit" aria-label="Subscribe" className={styles.submit}>
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
