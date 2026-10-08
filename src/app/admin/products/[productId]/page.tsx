'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import ProductForm from '@/components/admin/ProductForm';
import { PageHeader } from '@/components/admin/ui';
import styles from '../../admin.module.css';

export default function EditProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const { products } = useStore();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className={styles.empty}>
        Product not found. <Link href="/admin/products">Back to products</Link>
      </div>
    );
  }

  return (
    <>
      <Link href="/admin/products" className={styles.muted} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
        <ArrowLeft size={14} /> Products
      </Link>
      <PageHeader
        title={product.title}
        subtitle={product.categoryLabel}
        actions={
          <Link href={`/product/${product.slug}`} className={styles.btn}>
            View in store <ExternalLink size={14} />
          </Link>
        }
      />
      <ProductForm key={product.id} product={product} />
    </>
  );
}
