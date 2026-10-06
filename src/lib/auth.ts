/**
 * Stateless admin session: an HMAC-signed cookie. Uses Web Crypto so it works in both proxy and route handlers.
 * Configure ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET in .env.local.
 */

export const SESSION_COOKIE = 'admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const enc = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array) {
  let s = '';
  for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s: string) {
  return atob(s.replace(/-/g, '+').replace(/_/g, '/'));
}

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) throw new Error('ADMIN_SESSION_SECRET must be set (32+ characters)');
  return s;
}

async function hmac(data: string) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(email: string) {
  const payload = b64url(enc.encode(JSON.stringify({ sub: email, exp: Date.now() + SESSION_MAX_AGE * 1000 })));
  return `${payload}.${await hmac(payload)}`;
}

export async function verifySessionToken(token?: string) {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  try {
    if (!safeEqual(sig, await hmac(payload))) return null;
    const data = JSON.parse(fromB64url(payload)) as { sub: string; exp: number };
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

/** Compares SHA-256 digests so the comparison time doesn't leak input length. */
export async function checkCredentials(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedEmail || !expectedPassword) return false;
  const digest = async (s: string) => b64url(await crypto.subtle.digest('SHA-256', enc.encode(s)));
  const [a, b, c, d] = await Promise.all([digest(email.trim().toLowerCase()), digest(expectedEmail.trim().toLowerCase()), digest(password), digest(expectedPassword)]);
  return safeEqual(a, b) && safeEqual(c, d);
}
