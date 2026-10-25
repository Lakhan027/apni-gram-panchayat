// TDD: written before lib/schedule.ts existed.
import { describe, expect, it } from 'vitest';
import { countDelayed, daysBetween, getScheduleStatus, SCHEDULE_LABEL } from '@/lib/schedule';
import type { Work } from '@/lib/types';

type W = Pick<Work, 'status' | 'expectedCompletion' | 'progress'>;
const w = (status: Work['status'], expectedCompletion: string | null, progress = 50): W => ({ status, expectedCompletion, progress });
const TODAY = '2026-10-25';

describe('daysBetween', () => {
  it('counts whole calendar days, negative when the target is in the past', () => {
    expect(daysBetween('2026-10-25', '2026-10-25')).toBe(0);
    expect(daysBetween('2026-10-25', '2026-11-24')).toBe(30);
    expect(daysBetween('2026-10-25', '2026-10-20')).toBe(-5);
  });
  it('crosses month, year and leap-day boundaries correctly', () => {
    expect(daysBetween('2026-12-31', '2027-01-01')).toBe(1);
    expect(daysBetween('2028-02-28', '2028-03-01')).toBe(2);
  });
});

describe('getScheduleStatus', () => {
  it('completed works are done, whatever the date', () => {
    expect(getScheduleStatus(w('completed', '2020-01-01', 100), TODAY)).toBe('done');
  });

  it('works without an expected completion date have no schedule', () => {
    expect(getScheduleStatus(w('proposed', null, 0), TODAY)).toBe('no-date');
    expect(getScheduleStatus(w('on-hold', null), TODAY)).toBe('no-date');
  });

  it('is delayed once the expected date has passed and the work is not complete', () => {
    expect(getScheduleStatus(w('in-progress', '2026-10-24'), TODAY)).toBe('delayed');
    expect(getScheduleStatus(w('on-hold', '2026-06-30', 25), TODAY)).toBe('delayed');
    expect(getScheduleStatus(w('approved', '2026-09-01', 0), TODAY)).toBe('delayed');
  });

  it('the due date itself is not yet delayed', () => {
    expect(getScheduleStatus(w('in-progress', TODAY, 95), TODAY)).not.toBe('delayed');
  });

  it('is due-soon within 30 days when less than 90% is done', () => {
    expect(getScheduleStatus(w('in-progress', '2026-11-24', 50), TODAY)).toBe('due-soon');
    expect(getScheduleStatus(w('in-progress', TODAY, 10), TODAY)).toBe('due-soon');
  });

  it('is on track when the date is far away or the work is nearly finished', () => {
    expect(getScheduleStatus(w('in-progress', '2026-11-25', 10), TODAY)).toBe('on-track');
    expect(getScheduleStatus(w('in-progress', '2026-11-01', 90), TODAY)).toBe('on-track');
  });
});

describe('countDelayed', () => {
  it('counts only delayed works', () => {
    const works = [w('in-progress', '2026-01-01'), w('completed', '2026-01-01', 100), w('on-hold', '2026-02-01'), w('proposed', null)];
    expect(countDelayed(works, TODAY)).toBe(2);
  });
});

describe('SCHEDULE_LABEL', () => {
  it('has a Hindi label for every status', () => {
    expect(SCHEDULE_LABEL).toEqual({
      'on-track': 'समय पर',
      'due-soon': 'समय सीमा निकट',
      delayed: 'समय से पीछे',
      done: 'समय पर पूर्ण',
      'no-date': 'तिथि तय नहीं',
    });
  });
});
