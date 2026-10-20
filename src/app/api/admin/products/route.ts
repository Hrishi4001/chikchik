import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { createProduct, ProductError } from '@/lib/products.server';
import type { Product } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!(await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as Omit<Product, 'id' | 'slug'> | null;
  if (!body) return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
  try {
    return NextResponse.json({ product: await createProduct(body) }, { status: 201 });
  } catch (e) {
    if (e instanceof ProductError) return NextResponse.json({ error: e.message }, { status: 400 });
    throw e;
  }
}
