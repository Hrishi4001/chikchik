import type { Metadata } from 'next';
import { getProductBySlug } from '@/lib/products.server';
import { LEGAL } from '@/lib/legal';
import ProductDetail from '@/components/product/ProductDetail';
import type { Product } from '@/lib/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = 'https://www.chikchik.in';
const absolute = (src: string) => (src.startsWith('http') ? src : `${SITE_URL}${src}`);

// Search snippets cut off around 160 characters; end on a whole word
function snippet(text: string, max = 158) {
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(' ', max - 1))}…`;
}

const lighterType = (p: Product) => (/flip-top/i.test(p.fabric + p.subtitle) ? 'Flip-Top Lighter' : 'Jet Flame Lighter');

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Lighter not found | Chikchik', robots: { index: false } };

  const title = `${product.title} | Designer ${lighterType(product)} | Chikchik`;
  const description = snippet(`${product.title}: designer ${lighterType(product).toLowerCase()} with vintage matchbox art. ${product.description}`);
  return {
    title,
    description,
    keywords: [product.title, `${product.title} price`, product.categoryLabel, 'designer lighter', lighterType(product).toLowerCase(), 'matchbox art lighter', 'gift lighter India'],
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `/product/${product.slug}`,
      images: product.images.slice(0, 4).map((src) => ({ url: src, width: 1200, height: 1200, alt: product.title }))
    },
    twitter: { card: 'summary_large_image', title, description, images: product.images.slice(0, 1) }
  };
}

function productJsonLd(product: Product) {
  const url = `${SITE_URL}/product/${product.slug}`;
  const inStock = product.inStock && product.stockCount > 0;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${url}#product`,
        name: product.title,
        description: product.description,
        image: product.images.map(absolute),
        sku: product.id,
        url,
        category: `Lighters > ${product.categoryLabel}`,
        color: product.color,
        material: product.fabric,
        brand: { '@type': 'Brand', name: LEGAL.brand },
        countryOfOrigin: product.origin,
        offers: {
          '@type': 'Offer',
          url,
          priceCurrency: 'INR',
          price: product.price,
          availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@id': `${SITE_URL}/#store` },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IN' },
            shippingRate: { '@type': 'MonetaryAmount', currency: 'INR', value: product.price >= LEGAL.freeShippingThreshold ? 0 : LEGAL.standardShippingFee },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
              transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 7, unitCode: 'DAY' }
            }
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'IN',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: LEGAL.returnWindowDays,
            returnMethod: 'https://schema.org/ReturnByMail'
          }
        },
        ...(product.reviewCount > 0 && {
          aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount }
        })
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Designer Lighters', item: `${SITE_URL}/shop` },
          { '@type': 'ListItem', position: 3, name: product.categoryLabel, item: `${SITE_URL}/shop?category=${product.category}` },
          { '@type': 'ListItem', position: 4, name: product.title, item: url }
        ]
      }
    ]
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return (
    <>
      {product && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }} />
      )}
      <ProductDetail slug={slug} />
    </>
  );
}
