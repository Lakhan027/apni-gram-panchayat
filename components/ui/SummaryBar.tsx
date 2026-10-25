'use client';

import type { ReactNode } from 'react';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { MessageKey } from '@/lib/i18n/translate';

export interface SummaryItem {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
}

/** Row of headline numbers shown at the top of list pages. */
export default function SummaryBar({ items, labelKey }: { items: SummaryItem[]; labelKey: MessageKey }) {
  const { t } = useLang();
  return (
    <dl aria-label={t(labelKey)} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {items.map((i, idx) => (
        <div key={idx} className="card flex flex-col-reverse p-4 sm:p-5">
          {i.hint && <p className="mt-1 text-[13px] text-muted">{i.hint}</p>}
          <dt className="mt-1 text-[14px] font-medium text-muted sm:text-[15px]">{i.label}</dt>
          <dd className="break-words text-[22px] font-extrabold leading-tight text-green-900 sm:text-[26px]">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
