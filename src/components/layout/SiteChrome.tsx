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

/** Storefront header/footer and overlays; the admin console renders its own shell instead. */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const isAdmin = usePathname().startsWith('/admin');
  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh' }}>{children}</main>
      <Footer />
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <PageTracker />
      <CookieConsent />
      <PhoneCapture />
    </>
  );
}
