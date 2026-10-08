'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { CONSENT_EVENT, getConsent } from '@/lib/consent';
import styles from './privacy.module.css';

const DISMISS_KEY = 'he_phone_prompt';
const DELAY_MS = 45000;
const SNOOZE_DAYS = 14;
const WELCOME_CODE = 'FIRST15';
const HIDDEN_ON = ['/checkout', '/order-success', '/admin', '/pages/privacy-policy', '/pages/cookie-policy'];

function snoozed() {
  try {
    const t = Number(localStorage.getItem(DISMISS_KEY));
    return t === -1 || (t > 0 && Date.now() - t < SNOOZE_DAYS * 86400000);
  } catch {
    return false;
  }
}

function remember(value: number) {
  try {
    localStorage.setItem(DISMISS_KEY, String(value));
  } catch {}
}

/** WhatsApp/SMS sign-up prompt; shown only to visitors who allowed marketing cookies. */
export default function PhoneCapture() {
  const pathname = usePathname();
  const { applyPromoCode, isCartOpen } = useStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [whatsapp, setWhatsapp] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const hidden = HIDDEN_ON.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (hidden || snoozed()) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    // Shown after a long browse, or when a desktop visitor heads for the address bar — never mid-tap on a phone
    const show = () => {
      // On phones, never cover a product page mid-decision; wait for a browsing page instead
      const onPhonePdp = window.matchMedia('(pointer: coarse)').matches && window.location.pathname.startsWith('/product');
      if (getConsent()?.marketing && !snoozed() && !onPhonePdp) setOpen(true);
    };
    const schedule = () => {
      clearTimeout(timer);
      if (getConsent()?.marketing) timer = setTimeout(show, DELAY_MS);
    };
    const onExitIntent = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) show();
    };
    schedule();
    window.addEventListener(CONSENT_EVENT, schedule);
    document.addEventListener('mouseout', onExitIntent);
    return () => {
      clearTimeout(timer);
      window.removeEventListener(CONSENT_EVENT, schedule);
      document.removeEventListener('mouseout', onExitIntent);
    };
  }, [hidden]);

  if (!open || hidden || isCartOpen) return null;

  const close = () => {
    remember(Date.now());
    setOpen(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '').length !== 10) return setError('Enter a 10-digit mobile number');
    if (!agree) return setError('Please tick the box to agree to be contacted');
    setBusy(true);
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, consent: agree, whatsapp, source: 'popup' }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) return setError((await res?.json().catch(() => null))?.error || 'Something went wrong, please try again');
    remember(-1);
    setOpen(false);
    applyPromoCode(WELCOME_CODE);
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && close()}>
      <form className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="phone-capture-title" onSubmit={submit} noValidate>
        <button type="button" className={styles.close} aria-label="Close" onClick={close}>
          <X size={18} />
        </button>
        <h2 id="phone-capture-title">15% off your first order</h2>
        <p>Join for new arrivals and festive drops on WhatsApp or SMS. Your code is applied to your bag right away.</p>

        <div className={styles.field}>
          <label htmlFor="lead-name">Name (optional)</label>
          <input id="lead-name" className={styles.input} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label htmlFor="lead-phone">Mobile number *</label>
          <input id="lead-phone" className={styles.input} type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98XXX XXXXX" value={phone} onChange={(e) => { setPhone(e.target.value); setError(''); }} />
        </div>

        <label className={styles.check}>
          <input type="checkbox" checked={agree} onChange={(e) => { setAgree(e.target.checked); setError(''); }} />
          <span>
            I agree to receive promotional messages from Heva Elegance on this number. I can withdraw consent at any time by replying STOP or contacting support. See our <Link href="/pages/privacy-policy">Privacy Policy</Link>.
          </span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" checked={whatsapp} onChange={(e) => setWhatsapp(e.target.checked)} />
          <span>Send updates on WhatsApp (otherwise SMS only).</span>
        </label>
        {error && <p className={styles.error} role="alert">{error}</p>}

        <div className={styles.actions}>
          <button type="submit" className={styles.btnPrimary} disabled={busy}>
            {busy ? 'Saving…' : 'Get 15% off'}
          </button>
        </div>
        <p className={styles.fine}>We&rsquo;ll only use your number for updates you agreed to, never sell it, and you can ask us to delete it any time.</p>
      </form>
    </div>
  );
}
