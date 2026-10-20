'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import SearchModal from '@/components/ui/SearchModal';
import QuickViewModal from '@/components/product/QuickViewModal';
import CookieConsent from '@/components/privacy/CookieConsent';
import PageTracker from '@/components/privacy/PageTracker';
import PhoneCapture from '@/components/privacy/PhoneCapture';
import ScrollReveal from '@/components/layout/ScrollReveal';

/** Storefront header/footer and overlays; the admin console renders its own shell instead. */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Header />
      <main key={pathname} className="page-enter" style={{ minHeight: '80vh' }}>{children}</main>
      <ScrollReveal />
      {/* Phones get a distraction-free checkout without the full footer */}
      <div className={pathname.startsWith('/checkout') ? 'hide-on-mobile' : undefined}>
        <Footer />
      </div>
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <PageTracker />
      <CookieConsent />
      <PhoneCapture />
    </>
  );
}
