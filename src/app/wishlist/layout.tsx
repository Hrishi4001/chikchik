import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Wishlist | Heva Elegance',
  description: 'Pieces you have saved at Heva Elegance.',
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
