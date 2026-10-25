'use client';

import { ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatNumber } from '@/lib/format';
import { useLang } from '@/lib/i18n/LanguageProvider';

interface MgnregaSummaryCardProps {
  headingId?: string;
  activeWorks: number;
  personDays: number;
  activeJobCards: number;
  musterRollsInProcessing: number;
}

export default function MgnregaSummaryCard(props: MgnregaSummaryCardProps) {
  const { t } = useLang();
  const items = [
    { label: t('mgSummary.activeWorks'), value: props.activeWorks },
    { label: t('mgSummary.personDays'), value: props.personDays },
    { label: t('mgSummary.jobCards'), value: props.activeJobCards },
    { label: t('mgSummary.processing'), value: props.musterRollsInProcessing },
  ];
  return (
    <div className="h-full rounded-[14px] bg-green-900 p-5 text-white shadow-card sm:rounded-card sm:p-6">
      <h2 id={props.headingId} className="text-[22px] font-bold md:text-[26px]">
        {t('mgSummary.title')}
      </h2>
      <p className="mt-1 text-white/80">{t('mgSummary.full')}</p>
      <dl className="mt-5 grid grid-cols-2 gap-3">
        {items.map((i) => (
          <div key={i.label} className="flex flex-col-reverse rounded-xl bg-white/10 p-3 sm:p-4">
            <dt className="mt-1 text-[14px] text-white/85">{i.label}</dt>
            <dd className="text-[24px] font-extrabold leading-tight sm:text-[28px]">{formatNumber(i.value)}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-[14px] text-white/80">{t('mgSummary.wageNote')}</p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button href="/schemes/mgnrega-job-card" variant="light" className="w-full sm:w-auto">
          {t('mgSummary.register')}
          <ArrowRight size={18} aria-hidden="true" />
        </Button>
        <Button href="/mgnrega" variant="onDark" className="w-full sm:w-auto">
          {t('mgSummary.more')}
        </Button>
      </div>
    </div>
  );
}
