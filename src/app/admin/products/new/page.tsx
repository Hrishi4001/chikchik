'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { PageHeader } from '@/components/admin/ui';
import styles from '../../admin.module.css';

export default function NewProductPage() {
  return (
    <>
      <Link href="/admin/products" className={styles.muted} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
        <ArrowLeft size={14} /> Products
      </Link>
      <PageHeader title="Add product" />
      <ProductForm />
    </>
  );
}
