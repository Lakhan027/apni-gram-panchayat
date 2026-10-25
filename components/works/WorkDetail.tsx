'use client';

import { CalendarDays } from 'lucide-react';
import Card from '@/components/ui/Card';
import DownloadList from '@/components/ui/DownloadList';
import ProgressBar from '@/components/ui/ProgressBar';
import { useLang } from '@/lib/i18n/LanguageProvider';
import { formatDate, formatINR, remainingBudget } from '@/lib/format';
import type { Work } from '@/lib/types';
import PhotoGallery from './PhotoGallery';
import ScheduleBadge from './ScheduleBadge';

export default function WorkDetail({ work, today }: { work: Work; today?: string }) {
  const { t, pick, lang } = useLang();
  const remaining = remainingBudget(work.approvedBudget, work.recordedExpenditure);
  const facts = [
    { label: t('works.scheme'), value: pick(work.scheme, work.en?.scheme) },
    { label: t('work.approvalRef'), value: work.approvalRef ?? t('ph.verify') },
    { label: t('works.approvedBudget'), value: formatINR(work.approvedBudget) },
    { label: t('works.recorded'), value: formatINR(work.recordedExpenditure) },
    ...(remaining !== null ? [{ label: t('work.remaining'), value: formatINR(remaining) }] : []),
    { label: t('work.start'), value: formatDate(work.startDate, lang) },
    { label: t('work.expected'), value: formatDate(work.expectedCompletion, lang) },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
      <div className="min-w-0 space-y-6">
        <Card className="p-5 sm:p-6">
          <h2 className="text-[20px] font-bold text-green-900">{t('work.about')}</h2>
          <p className="mt-2 text-ink">{pick(work.description, work.en?.description)}</p>
        </Card>
        <Card className="p-5 sm:p-6">
          <h2 className="mb-4 text-[20px] font-bold text-green-900">{t('work.photos')}</h2>
          <PhotoGallery photos={work.photos} title={pick(work.name, work.en?.name)} />
        </Card>
        <Card className="p-5 sm:p-6">
          <h2 className="mb-4 text-[20px] font-bold text-green-900">{t('work.timeline')}</h2>
          <ol className="relative space-y-5 border-l-2 border-green-50 pl-6">
            {work.updates.map((u, i) => (
              <li key={`${u.date}-${i}`} className="relative">
                <span className="absolute -left-[33px] top-1 h-4 w-4 rounded-full border-[3px] border-white bg-green-700 ring-2 ring-green-50" aria-hidden="true" />
                <p className="flex items-center gap-1.5 text-[14px] font-semibold text-green-700">
                  <CalendarDays size={14} aria-hidden="true" /> {formatDate(u.date, lang)}
                </p>
                <p className="text-ink">{pick(u.text, work.en?.updates?.[i])}</p>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <aside className="min-w-0 space-y-6">
        <Card className="p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[20px] font-bold text-green-900">{t('work.keyFacts')}</h2>
            {today && <ScheduleBadge work={work} today={today} />}
          </div>
          <dl className="divide-y divide-line">
            {facts.map((f) => (
              <div key={f.label} className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 py-2.5">
                <dt className="text-muted">{f.label}</dt>
                <dd className="break-words text-right font-semibold text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4">
            <ProgressBar value={work.progress} />
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <h2 className="mb-2 text-[20px] font-bold text-green-900">{t('work.documents')}</h2>
          <DownloadList items={work.documents.map((d, i) => ({ ...d, nameEn: work.en?.documents?.[i] }))} />
        </Card>
      </aside>
    </div>
  );
}
