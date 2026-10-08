'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, CreditCard, BarChart3, Users, ExternalLink, LogOut, Star } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import styles from './admin.module.css';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/visitors', label: 'Visitors', icon: Users }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { orders, hydrated, syncAdminOrders } = useStore();
  const isLogin = pathname === '/admin/login';

  // Orders live on the server; refresh them whenever staff open or return to the admin
  useEffect(() => {
    if (!hydrated || isLogin) return;
    syncAdminOrders();
    const onFocus = () => syncAdminOrders();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, isLogin]);

  const toFulfil = orders.filter((o) => o.fulfillmentStatus === 'Processing' && (o.paymentStatus === 'Paid' || o.paymentMethod === 'COD')).length;

  if (isLogin) {
    return <div className={`${styles.shell} ${styles.loginShell}`}>{children}</div>;
  }

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.assign('/admin/login');
  };

  const isActive = (href: string) => (href === '/admin' ? pathname === href : pathname.startsWith(href));

  const links = NAV.map(({ href, label, icon: Icon }) => (
    <Link key={href} href={href} className={`${styles.navLink} ${isActive(href) ? styles.navActive : ''}`} aria-current={isActive(href) ? 'page' : undefined}>
      <Icon size={17} />
      <span>{label}</span>
      {href === '/admin/orders' && toFulfil > 0 && <span className={styles.navBadge}>{toFulfil}</span>}
    </Link>
  ));

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <strong>Heva Elegance</strong>
          <span>Admin</span>
        </div>
        <nav aria-label="Admin">{links}</nav>
        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.navLink}>
            <ExternalLink size={16} />
            <span>View storefront</span>
          </Link>
          <button type="button" onClick={logout} className={styles.navLink} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
      <nav className={styles.mobileNav} aria-label="Admin">
        {links}
      </nav>
      <main className={styles.main}>{hydrated ? children : <div className={styles.empty}>Loading…</div>}</main>
    </div>
  );
}
