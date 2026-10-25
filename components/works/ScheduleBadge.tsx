'use client';

import { AlarmClock, CalendarClock } from 'lucide-react';
import { Pill } from '@/components/ui/StatusBadge';
import { useLang } from '@/lib/i18n/LanguageProvider';
import { daysBetween, getScheduleStatus } from '@/lib/schedule';
import type { Work } from '@/lib/types';

type Props = { work: Pick<Work, 'status' | 'expectedCompletion' | 'progress'>; today: string };

/** Flags only works that need attention: behind schedule or close to the deadline. */
export default function ScheduleBadge({ work, today }: Props) {
  const { t } = useLang();
  const status = getScheduleStatus(work, today);
  if (status === 'delayed') {
    const overdue = daysBetween(work.expectedCompletion!, today);
    return (
      <Pill
        className="bg-status-holdBg text-status-holdText"
        icon={AlarmClock}
        label={
          <>
            <span>{t('schedule.delayed')}</span> <span>{t('schedule.days', { n: overdue })}</span>
          </>
        }
      />
    );
  }
  if (status === 'due-soon') {
    return <Pill className="bg-status-progressBg text-status-progressText" icon={CalendarClock} label={t('schedule.due-soon')} />;
  }
  return null;
}
