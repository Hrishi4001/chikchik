'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Blocks that glide in as they scroll into view; nested matches ride along with their parent
const TARGETS = [
  'h1', 'h2', 'h3',
  'section p',
  'picture',
  '.hero-copy > *',
  '.product-card',
  '.review-card',
  '.story-card',
  '.cat-banner-frame',
  '.cat-banner-images',
  '.label-gallery-section figure',
  'section > .container > a',
  'details'
].map((s) => `main ${s}`).join(',');

const STAGGER_MS = 70;
const MAX_STAGGER_MS = 420;

/** Apple-style reveal: content fades, lifts and sharpens into place as it enters the viewport. */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const root = document.documentElement;
    root.classList.add('motion-ready');

    const io = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((e) => e.isIntersecting);
        entering.forEach((entry, i) => {
          const el = entry.target as HTMLElement;
          el.style.setProperty('--reveal-delay', `${Math.min(i * STAGGER_MS, MAX_STAGGER_MS)}ms`);
          el.dataset.reveal = 'in';
          io.unobserve(el);
          // Drop the stagger once settled so hover effects respond instantly
          el.addEventListener('transitionend', () => el.style.removeProperty('--reveal-delay'), { once: true });
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>(TARGETS).forEach((el) => {
        // 'pending' elements are re-observed: a previous run's observer (StrictMode re-run, route change) was disconnected
        if (el.dataset.reveal === 'in') return;
        if (el.parentElement?.closest('[data-reveal]')) return;
        el.dataset.reveal = 'pending';
        io.observe(el);
      });
    };

    scan();

    // Products and reviews render after data loads, so catch them as they appear
    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    const main = document.querySelector('main');
    if (main) mo.observe(main, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
