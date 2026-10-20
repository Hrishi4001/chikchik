'use client';

import { useEffect, useState } from 'react';

const cache = new Map<string, string | null>();

/** Most common colour in an image, ignoring transparent and near-white pixels (usually the photo backdrop). */
function computeDominantColor(img: HTMLImageElement): string | null {
  const size = 48;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  // Bucket by 4 bits per channel, then average the pixels in the biggest bucket
  const buckets = new Map<number, { n: number; r: number; g: number; b: number }>();
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 128 || Math.min(r, g, b) > 235) continue;
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const bucket = buckets.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    bucket.n++;
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    buckets.set(key, bucket);
  }
  let top: { n: number; r: number; g: number; b: number } | undefined;
  for (const bucket of buckets.values()) if (!top || bucket.n > top.n) top = bucket;
  if (!top) return null;
  return `rgb(${Math.round(top.r / top.n)}, ${Math.round(top.g / top.n)}, ${Math.round(top.b / top.n)})`;
}

export function useDominantColor(src?: string) {
  const [computed, setComputed] = useState<{ src: string; color: string | null } | null>(null);

  useEffect(() => {
    if (!src || cache.has(src)) return;
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let color: string | null = null;
      try {
        color = computeDominantColor(img);
      } catch {
        // cross-origin image without CORS headers; keep the default background
      }
      cache.set(src, color);
      if (!cancelled) setComputed({ src, color });
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!src) return null;
  if (cache.has(src)) return cache.get(src) ?? null;
  return computed?.src === src ? computed.color : null;
}
