import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Sarees, Kurtis & Suits | Heva Elegance',
  description: 'Shop silk sarees, crepe sarees and cotton kurti suits from Heva Elegance. Free shipping in India on orders above ₹699.',
  alternates: { canonical: '/shop' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
