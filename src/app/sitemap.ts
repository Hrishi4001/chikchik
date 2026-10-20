import { MetadataRoute } from 'next';
import { listProducts } from '@/lib/products.server';
import { COLLECTIONS } from '@/lib/collections';
import { INFO_PAGES, LEGAL_PAGES } from '@/lib/legal';

const baseUrl = 'https://www.chikchik.in';
const absolute = (src: string) => (src.startsWith('http') ? src : `${baseUrl}${src}`);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const products = await listProducts();

  // Product pages carry their photos so lighters can surface in image search
  const productUrls = products.map((prod) => ({
    url: `${baseUrl}/product/${prod.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
    images: prod.images.map(absolute),
  }));

  // Matches each collection's canonical URL on the shop page
  const collectionUrls = COLLECTIONS.map((c) => ({
    url: `${baseUrl}/shop?category=${c.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    ...collectionUrls,
    ...productUrls,
    ...[...INFO_PAGES, ...LEGAL_PAGES].map((p) => ({
      url: `${baseUrl}${p.href}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: p.href === '/pages/faq' || p.href === '/pages/about-us' ? 0.5 : 0.3,
    })),
  ];
}
