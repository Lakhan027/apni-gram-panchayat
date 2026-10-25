'use client';

import { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import FilterChips from '@/components/ui/FilterChips';
import SearchInput from '@/components/ui/SearchInput';
import { NOTICE_CATEGORIES } from '@/lib/constants';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { Notice, NoticeCategory } from '@/lib/types';
import NoticeCard from './NoticeCard';

type Cat = NoticeCategory | 'all';
const PAGE = 10;

export default function NoticesExplorer({ notices }: { notices: Notice[] }) {
  const { t } = useLang();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<Cat>('all');
  const [visible, setVisible] = useState(PAGE);

  // Search matches both languages.
  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return notices
      .filter((n) => cat === 'all' || n.category === cat)
      .filter((n) => !term || `${n.title} ${n.summary} ${n.en?.title ?? ''} ${n.en?.summary ?? ''}`.toLowerCase().includes(term))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [notices, q, cat]);

  // A header-search link like /notices#N-013 should reveal that notice even beyond the first page.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const idx = notices.findIndex((n) => n.id === id);
    if (idx >= PAGE) setVisible(Math.ceil((idx + 1) / PAGE) * PAGE);
    if (idx >= 0) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, [notices]);

  const update = (fn: () => void) => {
    fn();
    setVisible(PAGE);
  };
  const options = [
    { value: 'all' as Cat, label: t('common.all') },
    ...NOTICE_CATEGORIES.map((value) => ({ value: value as Cat, label: t(`noticeCat.${value}`) })),
  ];

  return (
    <div className="space-y-5">
      <div className="card space-y-4 p-4 sm:p-5">
        <SearchInput id="notice-search" label={t('notices.search')} value={q} onChange={(v) => update(() => setQ(v))} placeholder={t('notices.searchPh')} />
        <FilterChips label={t('common.category')} options={options} value={cat} onChange={(v) => update(() => setCat(v))} />
      </div>
      <p className="font-semibold" aria-live="polite">
        {t('notices.count', { n: rows.length })}
      </p>
      {rows.length === 0 ? (
        <EmptyState
          title={t('notices.none')}
          action={<Button onClick={() => update(() => { setQ(''); setCat('all'); })}>{t('common.resetFilters')}</Button>}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {rows.slice(0, visible).map((n) => (
              <NoticeCard key={n.id} notice={n} />
            ))}
          </div>
          {visible < rows.length && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setVisible((v) => v + PAGE)}>
                {t('common.loadMore', { n: rows.length - visible })}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
