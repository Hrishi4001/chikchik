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
  ChevronDown
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Header() {
  const pathname = usePathname();
  const { 
    cart, 
    setIsCartOpen, 
    wishlist, 
    setIsSearchOpen,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // When transparent at the top of the homepage over the hero banner, header text is initially white.
  // On scroll (or on internal pages), header background is white and text is the default brand color #580F00.
  const isTransparent = pathname === '/' && !isScrolled;
  const headerTextColor = isTransparent ? '#FFFFFF' : '#580F00';
  const badgeBgColor = isTransparent ? '#FFFFFF' : '#580F00';
  const badgeTextColor = isTransparent ? '#580F00' : '#FFFFFF';

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const shopSubmenu = {
    categories: [
      { label: 'ALL CLOTHING', href: '/shop' },
      { label: 'SAREES', href: '/shop?category=sarees' },
      { label: 'KURTIS & SUITS', href: '/shop?category=kurti-suits' },
    ]
  };


  return (
    <>
      {/* 1. Announcement Bar */}
      <div 
        style={{
          height: '40px',
          backgroundColor: '#6D562C',
          color: '#FFFFFF',
          fontSize: '0.74rem',
          letterSpacing: '0.12em',
          fontWeight: 400,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-button-family)',
          zIndex: 950
        }}
      >
        <span className="announcement-text">FIRST15 FOR A 15% OFF ON YOUR FIRST ORDER</span>
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
          {/* Left: mobile menu button + desktop navigation */}
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', flex: 1 }}>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ display: 'flex', alignItems: 'center', color: headerTextColor, transition: 'color 0.3s ease' }}
            className="mobile-only-btn"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X size={22} color={headerTextColor} /> : <Menu size={22} color={headerTextColor} />}
          </button>

          {/* Desktop Left: Navigation links */}
          <nav 
            className="desktop-nav"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.8rem',
              height: '100%' 
            }}
          >
            <Link
              href="/shop"
              style={{
                fontFamily: 'var(--font-button-family)',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: headerTextColor,
                fontWeight: 500,
                transition: 'color 0.3s ease, opacity 0.2s'
              }}
            >
              NEW ARRIVALS
            </Link>

            {/* SHOP Megamenu dropdown trigger */}
            <div 
              style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
              onMouseEnter={() => setActiveDropdown('shop')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href="/shop"
                style={{
                  fontFamily: 'var(--font-button-family)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: headerTextColor,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'color 0.3s ease'
                }}
              >
                <span>SHOP</span>
                <ChevronDown size={11} style={{ opacity: 0.7 }} />
              </Link>

              {activeDropdown === 'shop' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '65px',
                    left: '-2rem',
                    width: '260px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EBEBEB',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.08)',
                    padding: '2.5rem 3rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '2.5rem',
                    zIndex: 1000,
                    animation: 'fadeIn 0.2s ease forwards'
                  }}
                >
                  {/* Col 1: Categories */}
                  <div>
                    <p style={{ fontFamily: 'var(--font-button-family)', fontSize: '0.72rem', letterSpacing: '0.12em', color: '#580F00', opacity: 0.75, textTransform: 'uppercase', marginBottom: '1.2rem', fontWeight: 600 }}>
                      CATEGORIES
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {shopSubmenu.categories.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          style={{
                            fontFamily: 'var(--font-body-family)',
                            fontSize: '0.88rem',
                            color: '#580F00',
                            letterSpacing: '0.02em',
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#580F00')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#580F00')}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

          </nav>
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
              <span
                className="header-logo"
                style={{
                  fontFamily: 'var(--font-heading-family)',
                  fontSize: '1.45rem',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: headerTextColor,
                  whiteSpace: 'nowrap',
                  transition: 'color 0.3s ease'
                }}
              >
                HEVA ELEGANCE
              </span>
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

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              height: 'calc(100dvh - 65px)',
              backgroundColor: '#FFFFFF',
              zIndex: 999,
              padding: '2rem 1.5rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              borderTop: '1px solid #EBEBEB'
            }}
          >
            <Link
              href="/shop"
              style={{
                fontFamily: 'var(--font-button-family)',
                fontSize: '1rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#580F00',
                fontWeight: 500
              }}
            >
              NEW ARRIVALS
            </Link>

            <div style={{ borderTop: '1px solid #EBEBEB', paddingTop: '1rem' }}>
              <p style={{ fontFamily: 'var(--font-button-family)', fontSize: '0.75rem', letterSpacing: '0.12em', color: '#580F00', opacity: 0.8, textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 600 }}>
                SHOP CATEGORIES
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '0.5rem' }}>
                {shopSubmenu.categories.map((c) => (
                  <Link key={c.label} href={c.href} style={{ fontSize: '0.92rem', color: '#580F00' }}>
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #EBEBEB', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <Link href="/wishlist" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem', color: '#580F00' }}>
                <Heart size={18} strokeWidth={1.7} /> Wishlist{wishlist.length > 0 ? ` (${wishlist.length})` : ''}
              </Link>
            </div>
          </div>
        )}
      </header>

    </>
  );
}
