import { NextResponse, userAgent } from 'next/server';
import type { NextRequest } from 'next/server';
import { CONSENT_COOKIE, VISITOR_COOKIE, parseConsent } from '@/lib/consent';
import { clientIp, geoFromHeaders, recordVisit } from '@/lib/visitors.server';

export const runtime = 'nodejs';

/** Records one page view. Runs for every visitor; the persistent visitor id is only kept with analytics consent. */
export async function POST(request: NextRequest) {
  const ua = userAgent(request);
  if (ua.isBot || ua.browser.name?.includes('Headless')) return new NextResponse(null, { status: 204 });

  const body = (await request.json().catch(() => null)) as { path?: unknown; referrer?: unknown } | null;
  const pagePath = typeof body?.path === 'string' ? body.path.slice(0, 200) : '';
  if (!pagePath.startsWith('/') || pagePath.startsWith('/admin')) return new NextResponse(null, { status: 204 });

  let referrer: string | undefined;
  if (typeof body?.referrer === 'string' && body.referrer) {
    try {
      const host = new URL(body.referrer).hostname.replace(/^www\./, '');
      if (host !== request.nextUrl.hostname.replace(/^www\./, '')) referrer = host;
    } catch {}
  }

  const consent = parseConsent(request.cookies.get(CONSENT_COOKIE)?.value);
  const vid = consent?.analytics ? request.cookies.get(VISITOR_COOKIE)?.value?.slice(0, 64) : undefined;

  await recordVisit({
    ...geoFromHeaders(request.headers),
    path: pagePath.split('?')[0],
    vid,
    device: ua.device.type || 'desktop',
    browser: ua.browser.name,
    referrer,
    ip: clientIp(request.headers),
    ua: ua.ua,
  });
  return new NextResponse(null, { status: 204 });
}
