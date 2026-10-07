'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/** Sends one anonymous page view per route change to /api/track. */
export default function PageTracker() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    // Guards against the dev-mode double effect counting a view twice
    if (last.current === pathname) return;
    const referrer = last.current === null ? document.referrer : '';
    last.current = pathname;
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, referrer }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
