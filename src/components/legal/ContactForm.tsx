'use client';

import React, { useState } from 'react';
import { LEGAL } from '@/lib/legal';

const field = {
  width: '100%',
  padding: '0.75rem 0.9rem',
  border: '1px solid var(--border-medium)',
  borderRadius: '4px',
  backgroundColor: '#FFFFFF',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  outline: 'none',
} as const;
const label = { display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 500 } as const;

/** No backend inbox yet: the form opens WhatsApp with the message pre-filled. */
export default function ContactForm() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', subject: '', message: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      `Hi ${LEGAL.brand}, I'm ${form.firstName} ${form.lastName} (${form.email}).`,
      form.subject && `Subject: ${form.subject}`,
      form.message,
    ].filter(Boolean).join('\n');
    const phone = LEGAL.whatsapp.replace(/\D/g, '');
    window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
      <label style={label}>First name *<input required value={form.firstName} onChange={set('firstName')} style={field} autoComplete="given-name" /></label>
      <label style={label}>Last name *<input required value={form.lastName} onChange={set('lastName')} style={field} autoComplete="family-name" /></label>
      <label style={{ ...label, gridColumn: '1 / -1' }}>Email *<input required type="email" value={form.email} onChange={set('email')} style={field} autoComplete="email" /></label>
      <label style={{ ...label, gridColumn: '1 / -1' }}>Subject<input value={form.subject} onChange={set('subject')} style={field} /></label>
      <label style={{ ...label, gridColumn: '1 / -1' }}>Message *<textarea required rows={5} value={form.message} onChange={set('message')} style={{ ...field, resize: 'vertical' }} /></label>
      <div style={{ gridColumn: '1 / -1' }}>
        <button type="submit" className="btn-primary">Send on WhatsApp</button>
      </div>
    </form>
  );
}
