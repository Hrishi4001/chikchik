'use client';

import React, { useRef, useState } from 'react';
import { ImagePlus, Loader2, X, ArrowLeft, ArrowRight } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  /** Used to name saved files, e.g. the product title. */
  nameHint?: string;
}

export default function ImageDropzone({ images, onChange, nameHint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pending, setPending] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const upload = async (fileList: FileList | File[]) => {
    const files = [...fileList].filter((f) => f.type.startsWith('image/'));
    if (!files.length) {
      setErrors(['Drop image files (JPG, PNG, WebP, AVIF, GIF, TIFF)']);
      return;
    }
    setErrors([]);
    setPending((n) => n + files.length);

    // One request per file keeps each body under the proxy's buffer limit
    const results = await Promise.all(
      files.map(async (file) => {
        const body = new FormData();
        body.append('files', file);
        if (nameHint) body.append('name', nameHint);
        try {
          const res = await fetch('/api/admin/upload', { method: 'POST', body });
          const data = (await res.json().catch(() => ({}))) as { urls?: string[]; errors?: string[]; error?: string };
          if (res.status === 401) return { urls: [], errors: ['Session expired — sign in again'] };
          return { urls: data.urls || [], errors: data.errors || (data.error ? [data.error] : []) };
        } catch {
          return { urls: [], errors: [`${file.name}: upload failed`] };
        } finally {
          setPending((n) => n - 1);
        }
      })
    );

    const urls = results.flatMap((r) => r.urls);
    if (urls.length) onChange([...images, ...urls]);
    setErrors(results.flatMap((r) => r.errors));
  };

  const move = (i: number, dir: -1 | 1) => {
    const next = [...images];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    onChange(next);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        className={`${styles.dropzone} ${dragging ? styles.dropzoneActive : ''}`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), inputRef.current?.click())}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          upload(e.dataTransfer.files);
        }}
      >
        {pending > 0 ? <Loader2 size={22} className={styles.spin} /> : <ImagePlus size={22} />}
        <span>{pending > 0 ? `Uploading ${pending} image${pending > 1 ? 's' : ''}…` : 'Drag & drop images, or click to browse'}</span>
        <span className={styles.fieldHint}>Converted to WebP and resized to max 1600px wide</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) upload(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {errors.map((err) => (
        <span key={err} className={styles.fieldError} style={{ display: 'block', marginTop: '0.4rem' }}>
          {err}
        </span>
      ))}

      {images.length > 0 && (
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className={styles.dropThumb}>
              <img src={src} alt={`Image ${i + 1}`} className={styles.thumb} style={{ width: 72, height: 96 }} />
              {i === 0 && <span className={styles.coverTag}>Cover</span>}
              <div className={styles.dropThumbActions}>
                <button type="button" aria-label="Move left" disabled={i === 0} onClick={() => move(i, -1)}>
                  <ArrowLeft size={12} />
                </button>
                <button type="button" aria-label="Remove" onClick={() => onChange(images.filter((_, j) => j !== i))}>
                  <X size={12} />
                </button>
                <button type="button" aria-label="Move right" disabled={i === images.length - 1} onClick={() => move(i, 1)}>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
