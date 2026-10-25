'use client';

import { useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import FilterChips from '@/components/ui/FilterChips';
import SearchInput from '@/components/ui/SearchInput';
import SelectFilter from '@/components/ui/SelectFilter';
import { WARD_COUNT, WORK_CATEGORIES, WORK_STATUS_ORDER } from '@/lib/constants';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { WorkStatus } from '@/lib/types';

export type SortKey = 'newest' | 'budget' | 'progress';

export interface WorkFilterState {
  q: string;
  status: WorkStatus | 'all';
  category: string;
  ward: string;
  sort: SortKey;
  onlyDelayed: boolean;
}

export const DEFAULT_WORK_FILTERS: WorkFilterState = {
  q: '',
  status: 'all',
  category: 'all',
  ward: 'all',
  sort: 'newest',
  onlyDelayed: false,
};

interface WorkFiltersProps {
  value: WorkFilterState;
  onChange: (next: WorkFilterState) => void;
  /** Number of delayed works; the "only delayed" checkbox shows when this is provided. */
  delayedCount?: number;
}

export default function WorkFilters({ value, onChange, delayedCount }: WorkFiltersProps) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const set = <K extends keyof WorkFilterState>(k: K, v: WorkFilterState[K]) => onChange({ ...value, [k]: v });

  const statusOptions = [
    { value: 'all' as const, label: t('common.all') },
    ...WORK_STATUS_ORDER.map((s) => ({ value: s, label: t(`status.${s}`) })),
  ];

  return (
    <div className="card space-y-4 p-4 sm:p-5">
      <SearchInput id="works-search" label={t('works.search')} value={value.q} onChange={(v) => set('q', v)} placeholder={t('works.searchPh')} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="works-filter-panel"
        className="flex min-h-[44px] w-full items-center justify-between rounded-[10px] border border-line px-4 font-semibold text-green-900 md:hidden"
      >
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal size={18} aria-hidden="true" /> {t('common.filters')}
        </span>
        <ChevronDown size={18} className={`transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      <div id="works-filter-panel" className={`${open ? 'block' : 'hidden'} space-y-4 md:block`}>
        <FilterChips label={t('works.statusFilter')} options={statusOptions} value={value.status} onChange={(v) => set('status', v)} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SelectFilter
            id="works-category"
            label={t('common.category')}
            value={value.category}
            onChange={(v) => set('category', v)}
            options={[{ value: 'all', label: t('common.allCategories') }, ...WORK_CATEGORIES.map((k) => ({ value: k, label: t(`cat.${k}`) }))]}
          />
          <SelectFilter
            id="works-ward"
            label={t('common.ward.label')}
            value={value.ward}
            onChange={(v) => set('ward', v)}
            options={[
              { value: 'all', label: t('common.allWards') },
              ...Array.from({ length: WARD_COUNT }, (_, i) => ({ value: String(i + 1), label: t('common.ward', { n: i + 1 }) })),
            ]}
          />
          <SelectFilter
            id="works-sort"
            label={t('works.sort')}
            value={value.sort}
            onChange={(v) => set('sort', v as SortKey)}
            options={[
              { value: 'newest', label: t('works.sort.newest') },
              { value: 'budget', label: t('works.sort.budget') },
              { value: 'progress', label: t('works.sort.progress') },
            ]}
          />
        </div>
        {delayedCount !== undefined && (
          <label className="flex min-h-[44px] cursor-pointer items-center gap-3 font-semibold text-ink">
            <input
              type="checkbox"
              checked={value.onlyDelayed}
              onChange={(e) => set('onlyDelayed', e.target.checked)}
              className="h-5 w-5 accent-green-700"
            />
            {t('works.onlyDelayed', { n: delayedCount })}
          </label>
        )}
      </div>
    </div>
  );
}
