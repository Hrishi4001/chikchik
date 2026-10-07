import type { Metadata } from 'next';
import { INITIAL_PRODUCTS } from '@/lib/data';
import ProductDetail from '@/components/product/ProductDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: 'Product not found | Heva Elegance', robots: { index: false } };

  return {
    title: `${product.title} | Heva Elegance`,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images.slice(0, 1)
    }
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
