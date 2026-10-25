'use client';

import { AlertCircle, Paperclip } from 'lucide-react';
import DateTile from '@/components/ui/DateTile';
import { formatDate } from '@/lib/format';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { Notice } from '@/lib/types';

interface NoticeCardProps {
  notice: Notice;
  compact?: boolean;
}

export default function NoticeCard({ notice, compact = false }: NoticeCardProps) {
  const { t, pick, lang } = useLang();
  return (
    <article id={notice.id} className={`card flex gap-3 sm:gap-4 ${compact ? 'p-3.5' : 'p-4 sm:p-5'}`}>
      <DateTile date={notice.date} tone={notice.important ? 'saffron' : 'green'} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-semibold text-green-700">{t(`noticeCat.${notice.category}`)}</span>
          <span className="text-[13px] text-muted">
            <span className="sr-only">{t('common.date')}: </span>
            {formatDate(notice.date, lang)}
          </span>
          {notice.important && (
            <span className="inline-flex items-center gap-1 rounded-full bg-status-holdBg px-2 py-0.5 text-[13px] font-bold text-status-holdText">
              <AlertCircle size={13} aria-hidden="true" />
              {t('common.important')}
            </span>
          )}
        </div>
        <h3 className={`mt-1 font-bold leading-snug text-green-900 ${compact ? 'text-[16px]' : 'text-[17px] sm:text-[18px]'}`}>
          {pick(notice.title, notice.en?.title)}
        </h3>
        {!compact && <p className="mt-1 text-[15px] text-muted">{pick(notice.summary, notice.en?.summary)}</p>}
        {!compact && notice.attachment && (
          <button
            type="button"
            disabled
            title={t('common.downloadUnavailable')}
            className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-[10px] border border-line px-3 text-[14px] font-semibold text-muted disabled:cursor-not-allowed"
          >
            <Paperclip size={16} aria-hidden="true" />
            {pick(notice.attachment, notice.en?.attachment)} — {t('common.notAvailable')}
          </button>
        )}
      </div>
    </article>
  );
}
