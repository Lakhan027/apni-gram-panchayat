'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, ClipboardList, Hammer, X } from 'lucide-react';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { MessageKey } from '@/lib/i18n/translate';
import type { SearchItem } from '@/lib/types';

interface HeaderSearchProps {
  open: boolean;
  onClose: () => void;
  items: SearchItem[];
}

const typeIcon = { work: Hammer, notice: Bell, scheme: ClipboardList };

export default function HeaderSearch({ open, onClose, items }: HeaderSearchProps) {
  const { t, pick } = useLang();
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const subtitle = (i: SearchItem) => {
    if (i.type === 'work') return `${i.id} · ${t('common.ward', { n: i.ward ?? '' })} · ${t(`cat.${i.category}` as MessageKey)}`;
    if (i.type === 'notice') return `${t('search.notice')} · ${t(`noticeCat.${i.category}` as MessageKey)}`;
    return `${t('search.scheme')} · ${t(`schemeCat.${i.category}` as MessageKey)}`;
  };

  // Matches either language, so a Hindi query works on the English UI and vice versa.
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    return items
      .filter((i) => `${i.title} ${i.titleEn ?? ''} ${i.id} ${i.ward ? `वार्ड ${i.ward} ward ${i.ward}` : ''}`.toLowerCase().includes(term))
      .slice(0, 8);
  }, [q, items]);

  if (!open) return null;

  return (
    <div id="header-search" className="border-t border-line bg-white shadow-card">
      <div className="container-page py-3">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
          <label htmlFor="site-search" className="sr-only">
            {t('search.label')}
          </label>
          <input
            ref={inputRef}
            id="site-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('search.placeholder')}
            className="input"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={t('search.close')}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-line hover:bg-green-50"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </form>

        <div aria-live="polite" className="mt-2">
          {q.trim().length >= 2 && results.length === 0 && (
            <p className="px-1 py-2 text-muted">{t('search.noResults', { q })}</p>
          )}
          {results.length > 0 && (
            <ul className="max-h-[60vh] divide-y divide-line overflow-y-auto rounded-[10px] border border-line">
              {results.map((r) => {
                const Icon = typeIcon[r.type];
                return (
                  <li key={`${r.type}-${r.id}`}>
                    <Link href={r.href} onClick={onClose} className="flex min-h-[52px] items-center gap-3 px-3 py-2 hover:bg-green-50">
                      <Icon size={18} className="shrink-0 text-green-700" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block break-words font-semibold text-ink">{pick(r.title, r.titleEn)}</span>
                        <span className="block break-words text-[13px] text-muted">{subtitle(r)}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
