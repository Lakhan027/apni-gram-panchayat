// Guards the JSON files in data/: shapes, cross-references and privacy rules.
import { describe, expect, it } from 'vitest';
import works from '@/data/works.json';
import mgnregaWorks from '@/data/mgnrega-works.json';
import wages from '@/data/mgnrega-wages.json';
import budget from '@/data/budget.json';
import gramSabha from '@/data/gram-sabha.json';
import schemes from '@/data/schemes.json';
import notices from '@/data/notices.json';
import panchayat from '@/data/panchayat.json';
import {
  NOTICE_CATEGORIES,
  PAYMENT_STATUS,
  SCHEME_CATEGORIES,
  WAGE_STATUS,
  WARD_COUNT,
  WORK_CATEGORIES,
  WORK_STATUS,
} from '@/lib/constants';

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const unique = (ids: string[]) => new Set(ids).size === ids.length;

describe('works.json', () => {
  it('has unique ids and valid enums', () => {
    expect(unique(works.map((w) => w.id))).toBe(true);
    for (const w of works) {
      expect(Object.keys(WORK_STATUS)).toContain(w.status);
      expect(WORK_CATEGORIES).toContain(w.category);
      expect(w.ward).toBeGreaterThanOrEqual(1);
      expect(w.ward).toBeLessThanOrEqual(WARD_COUNT);
    }
  });
  it('has sane progress and dates', () => {
    for (const w of works) {
      expect(w.progress).toBeGreaterThanOrEqual(0);
      expect(w.progress).toBeLessThanOrEqual(100);
      if (w.status === 'completed') expect(w.progress).toBe(100);
      if (w.status === 'proposed' || w.status === 'approved') expect(w.progress).toBe(0);
      expect(w.createdAt).toMatch(ISO);
      for (const u of w.updates) expect(u.date).toMatch(ISO);
    }
  });
  it('never records more spend than approved', () => {
    for (const w of works) {
      if (w.approvedBudget !== null && w.recordedExpenditure !== null) {
        expect(w.recordedExpenditure).toBeLessThanOrEqual(w.approvedBudget);
      }
    }
  });
  it('only references photos that exist in public/images', () => {
    const known = ['/images/work-before.svg', '/images/work-progress.svg', '/images/work-completed.svg'];
    for (const w of works) for (const src of [...w.photos.before, ...w.photos.progress, ...w.photos.completed]) expect(known).toContain(src);
  });
});

describe('budget.json', () => {
  it('has unique line and payment ids with known statuses', () => {
    expect(unique(budget.lines.map((l) => l.id))).toBe(true);
    expect(unique(budget.payments.map((p) => p.id))).toBe(true);
    for (const p of budget.payments) {
      expect(Object.keys(PAYMENT_STATUS)).toContain(p.status);
      expect(p.date).toMatch(ISO);
      expect(p.amount).toBeGreaterThan(0);
    }
  });
  it('every payment belongs to a budget line of the same year', () => {
    for (const p of budget.payments) {
      expect(budget.lines.some((l) => l.workId === p.workId && l.financialYear === p.financialYear)).toBe(true);
    }
  });
  it('payments never exceed the approved amount of their line', () => {
    for (const l of budget.lines) {
      const spent = budget.payments
        .filter((p) => p.workId === l.workId && p.financialYear === l.financialYear)
        .reduce((a, p) => a + p.amount, 0);
      expect(spent).toBeLessThanOrEqual(l.approved);
    }
  });
  it('lists every financial year used by the rows', () => {
    for (const row of [...budget.lines, ...budget.payments]) expect(budget.financialYears).toContain(row.financialYear);
  });
});

describe('MGNREGA data', () => {
  it('wage rows point at known MGNREGA works', () => {
    const ids = mgnregaWorks.works.map((w) => w.id);
    for (const w of wages) expect(ids).toContain(w.workId);
  });
  it('shows a reference number only for verified wages', () => {
    for (const w of wages) {
      expect(Object.keys(WAGE_STATUS)).toContain(w.status);
      if (w.status !== 'verified') expect(w.referenceNo).toBeNull();
    }
  });
});

describe('privacy rules', () => {
  const all = JSON.stringify([works, mgnregaWorks, wages, budget, gramSabha, schemes, notices, panchayat]);
  it('has no worker, Aadhaar, bank or phone fields', () => {
    expect(all).not.toMatch(/"(aadhaar|aadhar|bankAccount|accountNumber|ifsc|workerName|phoneNumber|mobile)"/i);
  });
  it('has no 12-digit Aadhaar-like or 10-digit phone-like numbers', () => {
    expect(all).not.toMatch(/(?<!\d)\d{12}(?!\d)/);
    expect(all).not.toMatch(/(?<![\d-])[6-9]\d{9}(?!\d)/);
  });
  it('keeps representative names as verification placeholders', () => {
    for (const r of panchayat.representatives) expect(r.name).toMatch(/सत्यापन हेतु/);
  });
});

describe('notices, schemes, Gram Sabha', () => {
  it('use known categories and unique ids', () => {
    expect(unique(notices.map((n) => n.id))).toBe(true);
    for (const n of notices) expect(NOTICE_CATEGORIES).toContain(n.category);
    expect(unique(schemes.map((s) => s.id))).toBe(true);
    for (const s of schemes) expect(SCHEME_CATEGORIES).toContain(s.category);
  });
  it('schemes contain no "to be verified" placeholder lines', () => {
    expect(JSON.stringify(schemes)).not.toMatch(/सत्यापन हेतु|to be verified/);
  });

  it('official links are https government sites without tracking parameters', () => {
    for (const s of schemes) {
      if (s.officialLink === null) continue;
      const url = new URL(s.officialLink);
      expect(url.protocol, s.id).toBe('https:');
      expect(url.hostname, s.id).toMatch(/\.gov\.in$/);
      expect(s.officialLink, s.id).not.toMatch(/utm_|fbclid|gclid/);
    }
  });
  it('the home page service links point at real schemes', () => {
    const ids = schemes.map((s) => s.id);
    for (const id of ['birth-death', 'property-records', 'mgnrega-job-card']) expect(ids).toContain(id);
  });
  it('past meetings record attendance as counts only', () => {
    for (const m of gramSabha) {
      if (m.upcoming) expect(m.attendance).toBeNull();
      else expect(m.attendance).toEqual(expect.objectContaining({ total: expect.any(Number), women: expect.any(Number) }));
    }
  });
});
