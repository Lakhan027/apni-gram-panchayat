'use client';

import { clampPercent } from '@/lib/format';
import { useLang } from '@/lib/i18n/LanguageProvider';

interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  tone?: 'green' | 'saffron';
}

export default function ProgressBar({ value, label: labelProp, showValue = true, tone = 'green' }: ProgressBarProps) {
  const { t } = useLang();
  const label = labelProp ?? t('common.progress');
  const pct = clampPercent(value);
  return (
    <div>
      {showValue && (
        <div className="mb-1 flex items-center justify-between text-[14px] text-muted">
          <span>{label}</span>
          <span className="font-semibold text-ink">{pct}%</span>
        </div>
      )}
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-green-50"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} ${pct}%`}
      >
        <div
          className={`h-full rounded-full ${tone === 'green' ? 'bg-green-700' : 'bg-saffron'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
