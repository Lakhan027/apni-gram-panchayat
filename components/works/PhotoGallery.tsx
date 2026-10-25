'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ImageOff, X } from 'lucide-react';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { Work } from '@/lib/types';

const TABS = [
  { key: 'before', label: 'gallery.before' },
  { key: 'progress', label: 'gallery.progress' },
  { key: 'completed', label: 'gallery.completed' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function PhotoGallery({ photos, title }: { photos: Work['photos']; title: string }) {
  const { t } = useLang();
  const [tab, setTab] = useState<TabKey>('before');
  const [enlarged, setEnlarged] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const list = photos[tab];

  useEffect(() => {
    if (!enlarged) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setEnlarged(null);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [enlarged]);

  return (
    <div>
      <div role="tablist" aria-label={t('gallery.categories')} className="flex flex-wrap gap-2">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            role="tab"
            type="button"
            id={`tab-${tb.key}`}
            aria-selected={tab === tb.key}
            aria-controls="gallery-panel"
            onClick={() => setTab(tb.key)}
            className={`min-h-[44px] rounded-[10px] px-4 font-semibold ${
              tab === tb.key ? 'bg-green-700 text-white' : 'border border-line bg-white text-ink hover:bg-green-50'
            }`}
          >
            {t(tb.label)} ({photos[tb.key].length})
          </button>
        ))}
      </div>
      <div id="gallery-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mt-4">
        {list.length === 0 ? (
          <div className="flex flex-col items-center rounded-[14px] border border-dashed border-line bg-ground py-10 text-muted">
            <ImageOff size={28} aria-hidden="true" />
            <p className="mt-2">{t('gallery.empty')}</p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {list.map((src, i) => (
              <li key={`${src}-${i}`}>
                <button
                  type="button"
                  onClick={() => setEnlarged(src)}
                  className="relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-line bg-green-50"
                  aria-label={t('gallery.enlarge', { title, tab: t(TABS.find((tb) => tb.key === tab)!.label), n: i + 1 })}
                >
                  <Image src={src} alt="" fill sizes="(min-width: 640px) 33vw, 50vw" className="object-cover" loading="lazy" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-[13px] text-muted">{t('common.symbolicPhotos')}</p>
      </div>

      {enlarged && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('gallery.large')}
          className="fixed inset-0 z-50 flex items-center justify-center bg-green-900/80 p-4"
          onClick={() => setEnlarged(null)}
        >
          <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setEnlarged(null)}
              aria-label={t('gallery.close')}
              className="absolute -top-14 right-0 flex h-11 w-11 items-center justify-center rounded-[10px] bg-white text-ink"
            >
              <X size={22} aria-hidden="true" />
            </button>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white">
              <Image src={enlarged} alt={`${title} — ${t('work.photos')}`} fill sizes="90vw" className="object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
