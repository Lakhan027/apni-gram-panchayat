'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import { useLang } from '@/lib/i18n/LanguageProvider';
import { formatINR } from '@/lib/format';
import type { Work } from '@/lib/types';
import ScheduleBadge from './ScheduleBadge';

/** `today` (YYYY-MM-DD) turns on the schedule badge; omit it to hide schedule info. */
export default function WorkCard({ work, today }: { work: Work; today?: string }) {
  const { t, pick } = useLang();
  return (
    <article className="card flex h-full flex-col p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="break-all text-[13px] font-semibold text-muted">{work.id}</span>
        <span className="flex flex-wrap gap-1.5">
          {today && <ScheduleBadge work={work} today={today} />}
          <StatusBadge status={work.status} />
        </span>
      </div>
      <h3 className="mt-2 text-[17px] font-bold leading-snug text-green-900 sm:text-[19px]">
        <Link href={`/works/${work.id}`} className="hover:underline">
          {pick(work.name, work.en?.name)}
        </Link>
      </h3>
      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-muted">
        <span className="inline-flex items-center gap-1">
          <MapPin size={14} aria-hidden="true" />
          {t('common.ward', { n: work.ward })}
        </span>
        <span>{t(`cat.${work.category}`)}</span>
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-[14px]">
        <div>
          <dt className="text-muted">{t('works.approvedBudget')}</dt>
          <dd className="font-bold text-ink">{formatINR(work.approvedBudget)}</dd>
        </div>
        <div>
          <dt className="text-muted">{t('works.recorded')}</dt>
          <dd className="font-bold text-ink">{formatINR(work.recordedExpenditure)}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-muted">{t('works.scheme')}</dt>
          <dd className="break-words font-medium text-ink">{pick(work.scheme, work.en?.scheme)}</dd>
        </div>
      </dl>
      <div className="mt-auto pt-4">
        <ProgressBar value={work.progress} />
      </div>
    </article>
  );
}
