import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Wishlist | Chikchik',
  description: 'Designer lighters you have saved at Chikchik.',
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
