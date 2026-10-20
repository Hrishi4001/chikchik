'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Menu, 
  X, 
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { LEGAL } from '@/lib/legal';
import { COLLECTIONS } from '@/lib/collections';

const ANNOUNCEMENTS = [
  'Be kind, rewind',
  'FIRST15 for 15% off your first order',
  `Free shipping above ₹${LEGAL.freeShippingThreshold}`,
  'Every lighter comes gift-boxed',
  'Ships in 1–3 working days',
  'Designer lighters with a 90s soul'
];

export default function Header() {
  const pathname = usePathname();
  const { 
    cart, 
    setIsCartOpen, 
    wishlist, 
    setIsSearchOpen,
    products,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<'category' | 'product' | null>(null);

  // When transparent at the top of the homepage over the hero banner, header text is initially white.
  // On scroll (or on internal pages), header background is white and text is the default ink color.
  const isTransparent = pathname === '/' && !isScrolled;
  const headerTextColor = isTransparent ? '#FFFFFF' : '#111111';
  const badgeBgColor = 'var(--color-accent)';
  const badgeTextColor = '#111111';

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // While the drawer is open: lock page scroll and close on Escape
  useEffect(() => {
    if (!isMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [isMenuOpen]);

  const categories = [
    { label: 'All Lighters', href: '/shop' },
    ...COLLECTIONS.map((c) => ({ label: c.label, href: `/shop?category=${c.id}` })),
  ];

  const toggleSection = (section: 'category' | 'product') =>
    setOpenSection((current) => (current === section ? null : section));


  return (
    <>
      {/* 1. Announcement Bar: messages scroll right to left; the second copy makes the loop seamless */}
      <div className="announcement-bar" role="region" aria-label="Announcements">
        <div className="announcement-track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="announcement-group" aria-hidden={copy === 1 || undefined}>
              {ANNOUNCEMENTS.map((msg) => (
                <li key={msg}>
                  {msg}
                  <span className="announcement-sep" aria-hidden="true">★</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* 2. Main Navigation Header (65px height) */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 900,
          height: '65px',
          marginBottom: pathname === '/' ? '-65px' : 0,
          backgroundColor: isTransparent ? 'transparent' : '#FFFFFF',
          backdropFilter: isTransparent ? 'none' : 'blur(10px)',
          borderBottom: isTransparent ? '1px solid transparent' : '1px solid #EBEBEB',
          boxShadow: isTransparent ? 'none' : '0 2px 12px rgba(0, 0, 0, 0.06)',
          transition: 'background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          color: headerTextColor
        }}
      >
        <div
          className="container"
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          {/* Left: menu button opens the side drawer */}
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', flex: 1 }}>
            <button
              onClick={() => {
                setOpenSection(null);
                setIsMenuOpen(true);
              }}
              style={{ display: 'flex', alignItems: 'center', color: headerTextColor, transition: 'color 0.3s ease' }}
              className="menu-btn"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              aria-controls="nav-drawer"
            >
              <Menu size={22} color={headerTextColor} />
            </button>
          </div>

          {/* Center: Brand Logo */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center'
            }}
          >
            <Link 
              href="/" 
              style={{ 
                display: 'inline-block',
                textDecoration: 'none'
              }}
            >
              <img
                src="/images/logo.png"
                alt="Chikchik"
                className="header-logo-img"
                width={594}
                height={483}
                style={{ display: 'block', height: '54px', width: 'auto' }}
              />
            </Link>
          </div>

          {/* Right: Search, Account, Wishlist, Cart */}
          <div className="header-icons" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button
              onClick={() => setIsSearchOpen(true)}
              style={{ color: headerTextColor, display: 'flex', alignItems: 'center', transition: 'color 0.3s ease' }}
              aria-label="Search Catalog"
            >
              <Search size={19} strokeWidth={1.7} />
            </button>

            <Link
              href="/wishlist"
              className="header-icon-desktop"
              style={{ position: 'relative', color: headerTextColor, display: 'flex', alignItems: 'center', transition: 'color 0.3s ease' }}
              aria-label="Wishlist"
            >
              <Heart size={19} strokeWidth={1.7} />
              {wishlist.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: badgeBgColor,
                    color: badgeTextColor,
                    fontSize: '0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-button-family)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button with Bag icon and Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                position: 'relative',
                color: headerTextColor,
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease'
              }}
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.7} />
              {cartItemCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-9px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: badgeBgColor,
                    color: badgeTextColor,
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-button-family)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

      </header>

      {/* Side Navigation Drawer */}
      {isMenuOpen && (
        <>
          <div className="nav-drawer-backdrop" onClick={() => setIsMenuOpen(false)} />
          {/* Following any link closes the drawer */}
          <nav
            id="nav-drawer"
            className="nav-drawer"
            aria-label="Main menu"
            onClick={(e) => (e.target as HTMLElement).closest('a') && setIsMenuOpen(false)}
          >
            <button className="nav-drawer-close" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
              <X size={22} />
            </button>

            <Link href="/shop?sort=newest" className="nav-drawer-row">New Arrivals</Link>

            <button className="nav-drawer-row" aria-expanded={openSection === 'category'} onClick={() => toggleSection('category')}>
              Shop by Category <ChevronRight size={20} />
            </button>
            {openSection === 'category' && (
              <div className="nav-drawer-sub">
                {categories.map((c) => (
                  <Link key={c.href} href={c.href}>{c.label}</Link>
                ))}
              </div>
            )}

            <button className="nav-drawer-row" aria-expanded={openSection === 'product'} onClick={() => toggleSection('product')}>
              Shop by Product <ChevronRight size={20} />
            </button>
            {openSection === 'product' && (
              <div className="nav-drawer-sub">
                {products.map((p) => (
                  <Link key={p.id} href={`/product/${p.slug}`}>
                    {p.images[0] && <img src={p.images[0]} alt="" width={40} height={40} loading="lazy" />}
                    {p.title}
                  </Link>
                ))}
              </div>
            )}

            <Link href="/wishlist" className="nav-drawer-row">
              Wishlist{wishlist.length > 0 ? ` (${wishlist.length})` : ''}
            </Link>
            <Link href="/pages/about-us" className="nav-drawer-row">Curious? About Us</Link>
            <Link href="/pages/shipping-policy" className="nav-drawer-row">Shipping &amp; Delivery</Link>
            <Link href="/pages/return-exchange-policy" className="nav-drawer-row">Returns &amp; Exchanges</Link>
            <Link href="/pages/faq" className="nav-drawer-row">FAQ</Link>
            <Link href="/pages/contact-us" className="nav-drawer-row">Contact Us</Link>

            <a href={`https://wa.me/${LEGAL.whatsapp.replace(/\D/g, '')}`} className="nav-drawer-whatsapp">
              <MessageCircle size={18} strokeWidth={1.7} /> Chat on WhatsApp
            </a>
          </nav>
        </>
      )}
    </>
  );
}
