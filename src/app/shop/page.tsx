import type { Metadata } from 'next';
import { getCollection } from '@/lib/collections';
import ShopClient from './ShopClient';

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

// Each collection gets its own title, description and canonical URL; sort order does not
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category } = await searchParams;
  const collection = getCollection(typeof category === 'string' ? category : null);
  const canonical = collection.id === 'all' ? '/shop' : `/shop?category=${collection.id}`;
  return {
    title: `${collection.seoTitle} | Chikchik`,
    description: collection.description,
    alternates: { canonical },
    openGraph: { title: `${collection.seoTitle} | Chikchik`, description: collection.description, url: canonical, images: [{ url: '/images/og.jpg', width: 1200, height: 630, alt: 'Chikchik designer lighters' }] }
  };
}

export default function ShopPage() {
  return <ShopClient />;
}
