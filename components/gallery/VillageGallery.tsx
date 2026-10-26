'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { GalleryPhoto } from '@/lib/types';

/** Village photo grid with captions; tap a photo for a large preview (Esc closes, arrow keys move). */
export default function VillageGallery({ photos }: { photos: GalleryPhoto[] }) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const caption = (p: GalleryPhoto) => (lang === 'en' ? p.captionEn : p.caption);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, step]);

  const current = open === null ? null : photos[open];

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3">
        {photos.map((p, i) => (
          <li key={p.id}>
            <figure className="card h-full overflow-hidden">
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={t('gallery.open', { caption: caption(p) })}
                className="relative block aspect-[4/3] w-full overflow-hidden bg-green-50"
              >
                <Image src={p.src} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 420px) 50vw, 100vw" className="object-cover transition-transform hover:scale-[1.03]" loading="lazy" />
              </button>
              <figcaption className="px-4 py-3 text-[16px] font-semibold text-green-900">{caption(p)}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13px] text-muted">{t('common.symbolicPhotos')}</p>

      {current && open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={caption(current)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-green-900/85 p-3 sm:p-6"
          onClick={() => setOpen(null)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 flex items-center justify-between gap-3 text-white">
              <span className="text-[14px]">{t('gallery.counter', { n: open + 1, total: photos.length })}</span>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(null)}
                aria-label={t('gallery.close')}
                className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-white text-ink"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white">
              <Image src={current.src} alt={caption(current)} fill sizes="90vw" className="object-contain" />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <button type="button" onClick={() => step(-1)} aria-label={t('gallery.prev')} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-white text-ink">
                <ChevronLeft size={24} aria-hidden="true" />
              </button>
              <p className="text-center text-[16px] font-semibold text-white">{caption(current)}</p>
              <button type="button" onClick={() => step(1)} aria-label={t('gallery.next')} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-white text-ink">
                <ChevronRight size={24} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
