/** Cookie consent shared by the banner, tracker and API routes. Bump the version when the cookie policy changes materially. */
export const CONSENT_COOKIE = 'he_consent';
export const VISITOR_COOKIE = 'he_vid';
export const CONSENT_VERSION = '2026-10';
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180; // re-ask every 6 months

export interface Consent {
  v: string;
  analytics: boolean;
  marketing: boolean;
}

export function parseConsent(raw?: string | null): Consent | null {
  if (!raw) return null;
  try {
    const c = JSON.parse(decodeURIComponent(raw)) as Consent;
    return c.v === CONSENT_VERSION ? { v: c.v, analytics: !!c.analytics, marketing: !!c.marketing } : null;
  } catch {
    return null;
  }
}

function readCookie(name: string) {
  return document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))?.slice(name.length + 1) ?? null;
}

function writeCookie(name: string, value: string, maxAge: number) {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function getConsent() {
  return parseConsent(readCookie(CONSENT_COOKIE));
}

export const CONSENT_EVENT = 'he:consent';
export const OPEN_PREFERENCES_EVENT = 'he:cookie-preferences';

export function saveConsent(choice: { analytics: boolean; marketing: boolean }) {
  const consent: Consent = { v: CONSENT_VERSION, ...choice };
  writeCookie(CONSENT_COOKIE, encodeURIComponent(JSON.stringify(consent)), CONSENT_MAX_AGE);
  if (choice.analytics) {
    if (!readCookie(VISITOR_COOKIE)) writeCookie(VISITOR_COOKIE, crypto.randomUUID(), 60 * 60 * 24 * 365);
  } else {
    writeCookie(VISITOR_COOKIE, '', 0);
  }
  fetch('/api/consent', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(choice), keepalive: true }).catch(() => {});
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }));
}

export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
