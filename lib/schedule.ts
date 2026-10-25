// Whether a development work is keeping to its expected completion date.
import { translate } from './i18n/translate';
import type { Work } from './types';

export type ScheduleStatus = 'on-track' | 'due-soon' | 'delayed' | 'done' | 'no-date';

const STATUSES: ScheduleStatus[] = ['on-track', 'due-soon', 'delayed', 'done', 'no-date'];

/** Hindi labels, taken from the dictionary so there is one source of truth. */
export const SCHEDULE_LABEL = Object.fromEntries(STATUSES.map((s) => [s, translate('hi', `schedule.${s}`)])) as Record<ScheduleStatus, string>;

/** Works due within this many days and under NEARLY_DONE % are flagged as due-soon. */
export const DUE_SOON_DAYS = 30;
export const NEARLY_DONE = 90;

const DAY_MS = 24 * 60 * 60 * 1000;

function toUTC(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Whole calendar days from `from` to `to` (negative when `to` is earlier). */
export function daysBetween(from: string, to: string): number {
  return Math.round((toUTC(to) - toUTC(from)) / DAY_MS);
}

/** Today's date as YYYY-MM-DD in India time, for the build or the browser. */
export function todayISO(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(now);
}

type Schedulable = Pick<Work, 'status' | 'expectedCompletion' | 'progress'>;

export function getScheduleStatus(work: Schedulable, today: string): ScheduleStatus {
  if (work.status === 'completed') return 'done';
  if (!work.expectedCompletion) return 'no-date';
  const daysLeft = daysBetween(today, work.expectedCompletion);
  if (daysLeft < 0) return 'delayed';
  if (daysLeft <= DUE_SOON_DAYS && work.progress < NEARLY_DONE) return 'due-soon';
  return 'on-track';
}

export function countDelayed(works: Schedulable[], today: string): number {
  return works.filter((w) => getScheduleStatus(w, today) === 'delayed').length;
}
