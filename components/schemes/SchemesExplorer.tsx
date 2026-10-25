'use client';

import { useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import FilterChips from '@/components/ui/FilterChips';
import { SCHEME_CATEGORIES } from '@/lib/constants';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { Scheme, SchemeCategory } from '@/lib/types';
import SchemeCard from './SchemeCard';

type Cat = SchemeCategory | 'all';

export default function SchemesExplorer({ schemes }: { schemes: Scheme[] }) {
  const { t } = useLang();
  const [cat, setCat] = useState<Cat>('all');
  const rows = useMemo(() => schemes.filter((s) => cat === 'all' || s.category === cat), [schemes, cat]);
  const options = [
    { value: 'all' as Cat, label: t('common.all') },
    ...SCHEME_CATEGORIES.map((value) => ({ value: value as Cat, label: t(`schemeCat.${value}`) })),
  ];

  return (
    <div className="space-y-5">
      <FilterChips label={t('common.category')} options={options} value={cat} onChange={setCat} />
      <p className="font-semibold" aria-live="polite">
        {t('schemes.count', { n: rows.length })}
      </p>
      {rows.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((s) => (
            <SchemeCard key={s.id} scheme={s} />
          ))}
        </div>
      ) : (
        <EmptyState title={t('schemes.none')} action={<Button onClick={() => setCat('all')}>{t('schemes.showAll')}</Button>} />
      )}
    </div>
  );
}
