'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { LayoutGrid, Table2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import DataTable, { type Column } from '@/components/ui/DataTable';
import EmptyState from '@/components/ui/EmptyState';
import ProgressBar from '@/components/ui/ProgressBar';
import StatusBadge from '@/components/ui/StatusBadge';
import { useLang } from '@/lib/i18n/LanguageProvider';
import { formatINR } from '@/lib/format';
import { countDelayed, getScheduleStatus } from '@/lib/schedule';
import type { Work } from '@/lib/types';
import WorkCard from './WorkCard';
import WorkFilters, { DEFAULT_WORK_FILTERS, type WorkFilterState } from './WorkFilters';

/** `today` (YYYY-MM-DD) enables schedule badges and the "only delayed" filter. */
export default function WorksExplorer({ works, today }: { works: Work[]; today?: string }) {
  const { t, pick } = useLang();
  const [filters, setFilters] = useState<WorkFilterState>(DEFAULT_WORK_FILTERS);
  const [view, setView] = useState<'cards' | 'table'>('cards');

  const rows = useMemo(() => {
    const term = filters.q.trim().toLowerCase();
    const list = works.filter((w) => {
      if (filters.status !== 'all' && w.status !== filters.status) return false;
      if (filters.category !== 'all' && w.category !== filters.category) return false;
      if (filters.ward !== 'all' && String(w.ward) !== filters.ward) return false;
      if (filters.onlyDelayed && today && getScheduleStatus(w, today) !== 'delayed') return false;
      if (term && !`${w.name} ${w.en?.name ?? ''} ${w.id} वार्ड ${w.ward} ward ${w.ward}`.toLowerCase().includes(term)) return false;
      return true;
    });
    const sorted = [...list];
    if (filters.sort === 'budget') sorted.sort((a, b) => (b.approvedBudget ?? 0) - (a.approvedBudget ?? 0));
    else if (filters.sort === 'progress') sorted.sort((a, b) => b.progress - a.progress);
    else sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return sorted;
  }, [works, filters, today]);

  const columns: Column<Work>[] = [
    { key: 'id', header: 'ID', render: (w) => <span className="whitespace-nowrap text-[14px] text-muted">{w.id}</span>, hideOnCard: true },
    {
      key: 'name',
      header: t('works.col.work'),
      primary: true,
      render: (w) => (
        <Link href={`/works/${w.id}`} className="font-semibold text-green-900 hover:underline">
          {pick(w.name, w.en?.name)}
        </Link>
      ),
    },
    { key: 'ward', header: t('common.ward.label'), render: (w) => w.ward },
    { key: 'cat', header: t('common.category'), render: (w) => t(`cat.${w.category}`) },
    { key: 'status', header: t('works.status'), render: (w) => <StatusBadge status={w.status} /> },
    { key: 'budget', header: t('works.approvedBudget'), align: 'right', render: (w) => formatINR(w.approvedBudget) },
    { key: 'exp', header: t('works.recorded'), align: 'right', render: (w) => formatINR(w.recordedExpenditure) },
    { key: 'progress', header: t('common.progress'), render: (w) => <div className="min-w-[120px]"><ProgressBar value={w.progress} /></div> },
  ];

  const cards = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((w) => (
        <WorkCard key={w.id} work={w} today={today} />
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      <WorkFilters value={filters} onChange={setFilters} delayedCount={today ? countDelayed(works, today) : undefined} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-ink" aria-live="polite">
          {t('works.found', { n: rows.length })}
        </p>
        <div className="hidden gap-2 md:flex" role="group" aria-label={t('works.view')}>
          <Button variant={view === 'cards' ? 'primary' : 'outline'} onClick={() => setView('cards')} aria-pressed={view === 'cards'}>
            <LayoutGrid size={18} aria-hidden="true" /> {t('works.cards')}
          </Button>
          <Button variant={view === 'table' ? 'primary' : 'outline'} onClick={() => setView('table')} aria-pressed={view === 'table'}>
            <Table2 size={18} aria-hidden="true" /> {t('works.table')}
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={t('works.none')}
          message={t('works.noneHint')}
          action={<Button onClick={() => setFilters(DEFAULT_WORK_FILTERS)}>{t('common.resetFilters')}</Button>}
        />
      ) : view === 'table' ? (
        <>
          <div className="md:hidden">{cards}</div>
          <div className="hidden md:block">
            <DataTable rows={rows} columns={columns} getKey={(w) => w.id} caption={t('works.tableCaption')} />
          </div>
        </>
      ) : (
        cards
      )}
    </div>
  );
}
