'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { getConsent, OPEN_PREFERENCES_EVENT, saveConsent } from '@/lib/consent';
import styles from './privacy.module.css';

/** Cookie banner (first visit or after a policy version bump) plus a reopenable preferences dialog. */
export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const current = getConsent();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- cookie is only readable after mount
    setShowBanner(!current);
    const open = () => {
      const c = getConsent();
      setAnalytics(!!c?.analytics);
      setMarketing(!!c?.marketing);
      setShowPrefs(true);
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, open);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, open);
  }, []);

  useEffect(() => {
    if (!showPrefs) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShowPrefs(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showPrefs]);

  const decide = (choice: { analytics: boolean; marketing: boolean }) => {
    saveConsent(choice);
    setShowBanner(false);
    setShowPrefs(false);
  };

  return (
    <>
      {showBanner && !showPrefs && (
        <div className={styles.banner} role="region" aria-label="Cookie consent">
          <h2>We value your privacy</h2>
          <p>
            We use essential cookies to run our store (cart, wishlist, checkout). With your permission we&rsquo;d also like to use analytics cookies to understand how visitors use our site, and marketing cookies to show you relevant offers. Read our <Link href="/pages/cookie-policy">Cookie Policy</Link>.
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.btn} onClick={() => decide({ analytics: false, marketing: false })}>
              Reject non-essential
            </button>
            <button type="button" className={styles.btn} onClick={() => setShowPrefs(true)}>
              Customise
            </button>
            <button type="button" className={styles.btnPrimary} onClick={() => decide({ analytics: true, marketing: true })}>
              Accept all
            </button>
          </div>
        </div>
      )}

      {showPrefs && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setShowPrefs(false)}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="cookie-prefs-title">
            <button type="button" className={styles.close} aria-label="Close" onClick={() => setShowPrefs(false)}>
              <X size={18} />
            </button>
            <h2 id="cookie-prefs-title">Cookie preferences</h2>
            <p>Choose which cookies we may use. You can change this any time from &ldquo;Cookie preferences&rdquo; in the footer.</p>

            <div className={styles.category}>
              <div>
                <strong>Strictly necessary</strong>
                <span>Cart, wishlist, checkout, security and remembering this choice. Always on.</span>
              </div>
              <input type="checkbox" className={styles.toggle} checked disabled aria-label="Strictly necessary cookies (always on)" />
            </div>
            <label className={styles.category}>
              <div>
                <strong>Analytics</strong>
                <span>A random visitor ID so we can count returning visitors and improve the site.</span>
              </div>
              <input type="checkbox" className={styles.toggle} checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
            </label>
            <label className={styles.category}>
              <div>
                <strong>Marketing</strong>
                <span>Lets us show you relevant offers, such as our WhatsApp updates sign-up.</span>
              </div>
              <input type="checkbox" className={styles.toggle} checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
            </label>

            <div className={styles.actions} style={{ marginTop: '0.75rem' }}>
              <button type="button" className={styles.btn} onClick={() => decide({ analytics: false, marketing: false })}>
                Reject all
              </button>
              <button type="button" className={styles.btnPrimary} onClick={() => decide({ analytics, marketing })}>
                Save choices
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
