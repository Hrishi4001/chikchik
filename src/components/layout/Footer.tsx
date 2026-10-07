'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { INFO_PAGES, LEGAL_PAGES } from '@/lib/legal';
import { openCookiePreferences } from '@/lib/consent';

export default function Footer() {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    showToast('Thank you for subscribing to Heva Elegance.', 'success');
    setEmail('');
  };

  return (
    <footer
      style={{
        backgroundColor: '#580F00',
        color: '#FFFFFF',
        paddingTop: '4rem',
        paddingBottom: '2.5rem',
        marginTop: '0'
      }}
    >
      <div className="container">
        {/* Main Footer 4-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3rem',
            paddingBottom: '3.5rem'
          }}
        >
          {/* Col 1: Brand Philosophy (spans 2 cols on wide screens) */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link 
              href="/" 
              style={{
                fontFamily: 'var(--font-heading-family)',
                fontSize: '1.25rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                fontWeight: 500,
                display: 'inline-block',
                marginBottom: '1.2rem',
                textDecoration: 'none'
              }}
            >
              Heva Elegance
            </Link>
            <p
              style={{
                fontFamily: 'var(--font-body-family)',
                fontSize: '0.88rem',
                lineHeight: 1.65,
                color: 'rgba(255, 255, 255, 0.88)',
                maxWidth: '440px'
              }}
            >
              Heva Elegance is a clothing brand crafted for women who believe in expressing confidence with comfort. We blend modern styles with timeless elegance, creating outfits that suit every mood — from casual days to special moments. At Heva Elegance, fashion isn’t just about wearing clothes; it’s about feeling empowered in your own skin.
            </p>
          </div>

          {/* Col 2: Company Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading-family)',
                fontSize: '0.95rem',
                fontWeight: 500,
                letterSpacing: '0.02em',
                color: '#FFFFFF',
                marginBottom: '1.2rem'
              }}
            >
              Company
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {INFO_PAGES.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} style={{ fontFamily: 'var(--font-body-family)', fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Policy Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading-family)',
                fontSize: '0.95rem',
                fontWeight: 500,
                letterSpacing: '0.02em',
                color: '#FFFFFF',
                marginBottom: '1.2rem'
              }}
            >
              Policy
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {LEGAL_PAGES.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} style={{ fontFamily: 'var(--font-body-family)', fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                    {p.label}
                  </Link>
                </li>
              ))}
              <li>
                <button type="button" onClick={openCookiePreferences} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-body-family)', fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                  Cookie Preferences
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter Subscription */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-heading-family)',
                fontSize: '0.95rem',
                fontWeight: 500,
                letterSpacing: '0.02em',
                color: '#FFFFFF',
                marginBottom: '1.2rem'
              }}
            >
              Newsletter
            </h4>
            <p
              style={{
                fontFamily: 'var(--font-body-family)',
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '1.2rem',
                lineHeight: 1.5
              }}
            >
              Subscribe to receive updates on new collections and exhibitions.
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
                    padding: '0.6rem 0',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-body-family)',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>
              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#FFFFFF',
                  fontFamily: 'var(--font-button-family)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  paddingTop: '0.4rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #FFFFFF'
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body-family)',
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.75)'
            }}
          >
            Copyright © 2026 Heva Elegance. All rights reserved.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontFamily: 'var(--font-button-family)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.6)' }}>
              100% Secure Checkout
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
