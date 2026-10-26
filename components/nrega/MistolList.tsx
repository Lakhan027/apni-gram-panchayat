'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, Users } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import SearchInput from '@/components/ui/SearchInput';
import SelectFilter from '@/components/ui/SelectFilter';
import SummaryBar from '@/components/ui/SummaryBar';
import { Pill } from '@/components/ui/StatusBadge';
import { WAGE_STATUS } from '@/lib/constants';
import { formatDate, formatNumber } from '@/lib/format';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { MgnregaWork, WagePayment } from '@/lib/types';

/** मिसटोल records: period, person-days and wage status per work. No worker names, Aadhaar or bank details. */
export default function MistolList({ rows, works }: { rows: WagePayment[]; works: MgnregaWork[] }) {
  const { t, pick, lang } = useLang();
  const [work, setWork] = useState('all');
  const [q, setQ] = useState('');
  const workName = (id: string) => {
    const w = works.find((x) => x.id === id);
    return w ? pick(w.name, w.en?.name) : id;
  };

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows
      .filter((r) => (work === 'all' || r.workId === work) && (!term || r.musterRoll.toLowerCase().includes(term)))
      .sort((a, b) => b.periodFrom.localeCompare(a.periodFrom));
  }, [rows, work, q]);

  return (
    <div className="space-y-5">
      <SummaryBar
        labelKey="mistol.count"
        items={[
          { label: t('mistol.count', { n: '' }).trim(), value: shown.length },
          { label: t('mistol.totalDays'), value: formatNumber(shown.reduce((a, r) => a + r.personDays, 0)) },
          { label: t('mistol.verified'), value: shown.filter((r) => r.status === 'verified').length },
          { label: t('mistol.pending'), value: shown.filter((r) => r.status !== 'verified').length },
        ]}
      />
      <div className="card grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5">
        <div className="sm:pt-[30px]">
          <SearchInput id="mistol-search" label={t('mistol.search')} value={q} onChange={setQ} placeholder={t('mistol.searchPh')} />
        </div>
        <SelectFilter
          id="mistol-work"
          label={t('mistol.work')}
          value={work}
          onChange={setWork}
          options={[{ value: 'all', label: t('mistol.allWorks') }, ...works.map((w) => ({ value: w.id, label: pick(w.name, w.en?.name) }))]}
        />
      </div>

      {shown.length === 0 ? (
        <EmptyState title={t('mistol.none')} />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {shown.map((r) => (
            <article key={r.musterRoll} className="card p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-[18px] font-bold text-green-900">{r.musterRoll}</h3>
                <Pill label={t(`wage.${r.status}`)} className={WAGE_STATUS[r.status].className} />
              </div>
              <p className="mt-1 break-words font-medium text-ink">
                {workName(r.workId)} <span className="text-[13px] text-muted">({r.workId})</span>
              </p>
              <dl className="mt-3 grid grid-cols-1 gap-2 text-[15px] min-[400px]:grid-cols-2">
                <div className="flex items-start gap-2">
                  <CalendarDays size={16} className="mt-1 shrink-0 text-green-700" aria-hidden="true" />
                  <span>
                    <dt className="text-[13px] text-muted">{t('mg.col.period')}</dt>
                    <dd>
                      {formatDate(r.periodFrom, lang)} – {formatDate(r.periodTo, lang)}
                    </dd>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Users size={16} className="mt-1 shrink-0 text-green-700" aria-hidden="true" />
                  <span>
                    <dt className="text-[13px] text-muted">{t('mg.col.days')}</dt>
                    <dd className="font-semibold">{formatNumber(r.personDays)}</dd>
                  </span>
                </div>
                {r.status === 'verified' && r.referenceNo && (
                  <div className="min-[400px]:col-span-2">
                    <dt className="text-[13px] text-muted">{t('mg.col.refNo')}</dt>
                    <dd className="break-all font-semibold">{r.referenceNo}</dd>
                  </div>
                )}
              </dl>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
