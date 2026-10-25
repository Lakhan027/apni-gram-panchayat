'use client';

import { formatINRShort, percentOf } from '@/lib/format';
import { useLang } from '@/lib/i18n/LanguageProvider';

interface SchemeBarsProps {
  rows: { scheme: string; schemeEn?: string; approved: number; recorded: number }[];
}

/** Horizontal bars in plain CSS: approved (full track) vs recorded (filled). */
export default function SchemeBars({ rows }: SchemeBarsProps) {
  const { t, pick, lang } = useLang();
  const max = Math.max(1, ...rows.map((r) => r.approved));
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4 text-[14px] text-muted" aria-hidden="true">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-6 rounded bg-green-50 ring-1 ring-green-700/30" /> {t('budget.approved')}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-6 rounded bg-green-700" /> {t('budget.recorded')}
        </span>
      </div>
      <ul className="space-y-4">
        {rows.map((r) => {
          const width = percentOf(r.approved, max);
          const used = percentOf(r.recorded, r.approved);
          const name = pick(r.scheme, r.schemeEn);
          const approved = formatINRShort(r.approved, lang);
          const recorded = formatINRShort(r.recorded, lang);
          return (
            <li key={r.scheme}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 text-[15px]">
                <span className="font-semibold text-ink">{name}</span>
                <span className="text-muted">
                  {recorded} / {approved} ({used}%)
                </span>
              </div>
              <div
                className="h-4 rounded-md bg-green-50 ring-1 ring-green-700/20"
                style={{ width: `${Math.max(width, 4)}%` }}
                role="img"
                aria-label={`${name}: ${t('budget.approved')} ${approved}, ${t('budget.recorded')} ${recorded}, ${used}%`}
              >
                <div className="h-full rounded-md bg-green-700" style={{ width: `${used}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
