import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import sharp from 'sharp';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';

export const runtime = 'nodejs';

const MAX_BYTES = 15 * 1024 * 1024;
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 2133; // 3:4 portrait, matching product cards
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'images', 'products');

function slugify(s: string) {
  return s.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'image';
}

export async function POST(request: Request) {
  // Proxy already gates this route; re-check here since route handlers must not rely on proxy alone
  if (!(await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const files = form?.getAll('files').filter((f): f is File => f instanceof File) ?? [];
  if (!files.length) return NextResponse.json({ error: 'No files received' }, { status: 400 });

  const prefix = slugify(String(form?.get('name') || ''));
  await mkdir(UPLOAD_DIR, { recursive: true });

  const urls: string[] = [];
  const errors: string[] = [];
  for (const file of files) {
    if (file.size > MAX_BYTES) {
      errors.push(`${file.name}: larger than 15 MB`);
      continue;
    }
    try {
      const output = await sharp(Buffer.from(await file.arrayBuffer()), { failOn: 'error' })
        .rotate() // apply EXIF orientation, then strip metadata
        .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      const name = `${prefix !== 'image' ? prefix : slugify(file.name)}-${Date.now().toString(36)}${randomBytes(3).toString('hex')}.webp`;
      await writeFile(path.join(UPLOAD_DIR, name), output);
      urls.push(`/images/products/${name}`);
    } catch {
      errors.push(`${file.name}: not a supported image`);
    }
  }

  return NextResponse.json({ urls, errors }, { status: urls.length ? 200 : 400 });
}
