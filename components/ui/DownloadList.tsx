'use client';

import { Download, FileText } from 'lucide-react';
import { useLang } from '@/lib/i18n/LanguageProvider';

interface DownloadItem {
  name: string;
  nameEn?: string;
  type: string;
  meta?: string;
  metaEn?: string;
}

/** Document list; download buttons stay disabled until files are hosted. */
export default function DownloadList({ items }: { items: DownloadItem[] }) {
  const { t, pick } = useLang();
  if (items.length === 0) return <p className="text-muted">{t('common.noDocs')}</p>;
  return (
    <ul className="divide-y divide-line">
      {items.map((d) => (
        <li key={d.name} className="flex flex-wrap items-center justify-between gap-3 py-3">
          <span className="flex min-w-0 items-start gap-3">
            <FileText size={20} className="mt-0.5 shrink-0 text-green-700" aria-hidden="true" />
            <span className="min-w-0">
              <span className="block break-words font-semibold text-ink">{pick(d.name, d.nameEn)}</span>
              <span className="block text-[13px] text-muted">
                {d.type}
                {d.meta ? ` · ${pick(d.meta, d.metaEn)}` : ''}
              </span>
            </span>
          </span>
          <button
            type="button"
            disabled
            title={t('common.downloadUnavailable')}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] border border-line px-3 text-[14px] font-semibold text-muted disabled:cursor-not-allowed"
          >
            <Download size={16} aria-hidden="true" />
            {t('common.download')} <span className="sr-only">({t('common.notAvailable')})</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
