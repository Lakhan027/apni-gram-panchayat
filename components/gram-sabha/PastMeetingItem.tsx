'use client';

import { ChevronDown, Users } from 'lucide-react';
import DownloadList from '@/components/ui/DownloadList';
import { Pill } from '@/components/ui/StatusBadge';
import { DECISION } from '@/lib/constants';
import { formatDate, formatNumber } from '@/lib/format';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { GramSabhaMeeting } from '@/lib/types';

/** Accordion row using native <details> — keyboard and screen-reader friendly without JS. */
export default function PastMeetingItem({ meeting }: { meeting: GramSabhaMeeting }) {
  const { t, pick, lang } = useLang();
  const date = formatDate(meeting.date, lang);
  return (
    <details className="card group overflow-hidden">
      <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 hover:bg-green-50 sm:px-5 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="block text-[17px] font-bold text-green-900 sm:text-[18px]">{date}</span>
          <span className="block text-[14px] text-muted">
            {pick(meeting.venue, meeting.en?.venue)} · {t('gs.resolutionsCount', { n: meeting.resolutions.length })}
          </span>
        </span>
        <ChevronDown size={22} className="shrink-0 text-green-700 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="space-y-5 border-t border-line px-4 py-4 sm:px-5">
        {meeting.attendance && (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[15px]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
              <Users size={18} className="text-green-700" aria-hidden="true" /> {t('gs.attendance')}
            </span>
            <span>{t('gs.total', { n: formatNumber(meeting.attendance.total) })}</span>
            <span>{t('gs.women', { n: formatNumber(meeting.attendance.women) })}</span>
            <span>{t(meeting.attendance.quorumMet ? 'gs.quorumMet' : 'gs.quorumNotMet')}</span>
          </div>
        )}
        <div>
          <p className="mb-2 font-bold text-ink">{t('gs.decisions')}</p>
          <ul className="space-y-2">
            {meeting.resolutions.map((r) => (
              <li key={r.number} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-ground px-3 py-2.5">
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-muted">{r.number}</span>
                  <span className="block text-ink">{pick(r.title, r.en?.title)}</span>
                </span>
                <Pill label={t(`decision.${r.decision}`)} className={DECISION[r.decision].className} />
              </li>
            ))}
          </ul>
        </div>
        <DownloadList items={[{ name: t('gs.minutes', { date }), type: 'PDF' }]} />
      </div>
    </details>
  );
}
