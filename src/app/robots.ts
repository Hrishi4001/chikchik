import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Private, transactional and per-visitor pages stay out of search
      disallow: ['/admin', '/api/', '/checkout', '/order-success', '/wishlist'],
    },
    sitemap: 'https://www.chikchik.in/sitemap.xml',
    host: 'https://www.chikchik.in',
  };
}
