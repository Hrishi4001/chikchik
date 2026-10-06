import { MetadataRoute } from 'next';
import { INITIAL_PRODUCTS } from '@/lib/data';
import { INFO_PAGES, LEGAL_PAGES } from '@/lib/legal';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.hevaelegance.com';

  const productUrls = INITIAL_PRODUCTS.map((prod) => ({
    url: `${baseUrl}/product/${prod.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const categoryUrls = ['sarees', 'kurti-suits'].map((cat) => ({
    url: `${baseUrl}/shop?category=${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...categoryUrls,
    ...productUrls,
    ...[...INFO_PAGES, ...LEGAL_PAGES].map((p) => ({
      url: `${baseUrl}${p.href}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ];
}
