'use client';

import { Clock, MapPin } from 'lucide-react';
import DateTile from '@/components/ui/DateTile';
import { formatDate } from '@/lib/format';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { GramSabhaMeeting } from '@/lib/types';

interface UpcomingMeetingCardProps {
  meeting: GramSabhaMeeting;
  agendaLimit?: number;
  headingLevel?: 'h2' | 'h3';
}

export default function UpcomingMeetingCard({ meeting, agendaLimit, headingLevel = 'h3' }: UpcomingMeetingCardProps) {
  const { t, pick, lang } = useLang();
  const H = headingLevel;
  const agenda = meeting.agenda.map((a, i) => pick(a, meeting.en?.agenda?.[i]));
  const shown = agendaLimit ? agenda.slice(0, agendaLimit) : agenda;
  return (
    <div className="card h-full p-5 sm:p-6">
      <div className="flex gap-4">
        <DateTile date={meeting.date} tone="saffron" />
        <div className="min-w-0">
          <H className="text-[18px] font-bold text-green-900 sm:text-[19px]">{formatDate(meeting.date, lang)}</H>
          <p className="mt-1 flex items-center gap-1.5 text-[15px] text-muted">
            <Clock size={16} aria-hidden="true" /> {pick(meeting.time, meeting.en?.time)}
          </p>
          <p className="mt-0.5 flex items-start gap-1.5 text-[15px] text-muted">
            <MapPin size={16} className="mt-1 shrink-0" aria-hidden="true" /> {pick(meeting.venue, meeting.en?.venue)}
          </p>
        </div>
      </div>
      <p className="mt-5 text-[15px] font-bold text-ink">{t('meeting.agenda')}</p>
      <ol className="mt-2 space-y-2">
        {shown.map((item, i) => (
          <li key={i} className="flex gap-3 text-[15px] text-ink">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50 text-[13px] font-bold text-green-700">
              {i + 1}
            </span>
            {item}
          </li>
        ))}
      </ol>
    </div>
  );
}
