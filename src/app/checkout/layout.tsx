import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | Heva Elegance',
  description: 'Secure checkout at Heva Elegance.',
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
