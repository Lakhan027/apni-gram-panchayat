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
import digitalServices from '@/data/digital-services.json';
import serviceGuides from '@/data/service-guides.json';
import members from '@/data/members.json';
import gallery from '@/data/gallery.json';
import sarpanch from '@/data/sarpanch.json';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { dictionary } from '@/lib/i18n/dictionary';
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
  const all = JSON.stringify([works, mgnregaWorks, wages, budget, gramSabha, schemes, notices, panchayat, members, gallery]);
  it('has no worker, Aadhaar, bank or phone fields', () => {
    // Panchayat members may list an official mobile (masked — see the members test); nobody else may.
    const notMembers = JSON.stringify([works, mgnregaWorks, wages, budget, gramSabha, schemes, notices, panchayat, gallery]);
    expect(notMembers).not.toMatch(/"(aadhaar|aadhar|bankAccount|accountNumber|ifsc|workerName|phoneNumber|mobile)"/i);
    expect(JSON.stringify(members)).not.toMatch(/"(aadhaar|aadhar|bankAccount|accountNumber|ifsc)"/i);
  });
  it('has no 12-digit Aadhaar-like or 10-digit phone-like numbers', () => {
    expect(all).not.toMatch(/(?<!\d)\d{12}(?!\d)/);
    expect(all).not.toMatch(/(?<![\d-])[6-9]\d{9}(?!\d)/);
  });
  it('member mobile numbers are masked so no real person can be called by mistake', () => {
    for (const m of members) expect(m.mobile, m.id).toMatch(/^\+91 [6-9]\dXXX XX\d{3}$/);
  });
});

describe('notices, schemes, Gram Sabha', () => {
  it('use known categories and unique ids', () => {
    expect(unique(notices.map((n) => n.id))).toBe(true);
    for (const n of notices) expect(NOTICE_CATEGORIES).toContain(n.category);
    expect(unique(schemes.map((s) => s.id))).toBe(true);
    for (const s of schemes) expect(SCHEME_CATEGORIES).toContain(s.category);
  });
  it('uses the new scheme name VB—G RAM G (NREGA) everywhere, not MGNREGA / मनरेगा', () => {
    // URLs are excluded: the official portal path itself contains "MGNREGA_new".
    const text = (v: unknown): string[] =>
      typeof v === 'string' ? (v.startsWith('http') ? [] : [v]) : Array.isArray(v) ? v.flatMap(text) : v && typeof v === 'object' ? Object.values(v).flatMap(text) : [];
    const all = text([works, mgnregaWorks, wages, budget, gramSabha, schemes, notices, panchayat, dictionary]).join(' | ');
    expect(all).not.toMatch(/मनरेगा|MGNREGA|Mahatma Gandhi|महात्मा गांधी/);
  });

  it('digital services: unique ids, Hindi + English names, https government links', () => {
    expect(unique(digitalServices.map((d) => d.id))).toBe(true);
    for (const d of digitalServices) {
      expect(d.name.trim(), d.id).not.toBe('');
      expect(d.nameEn, d.id).not.toMatch(/[ऀ-ॿ]/);
      const url = new URL(d.url);
      expect(url.protocol, d.id).toBe('https:');
      // .gov.in, or the .भारत government IDN domain (xn--h2brj9c)
      expect(url.hostname, d.id).toMatch(/\.gov\.in$|\.xn--h2brj9c$/);
      expect(d.url, d.id).not.toMatch(/utm_/);
    }
  });

  it('service guides: every guide has matching Hindi and English lists', () => {
    expect(Object.keys(serviceGuides).sort()).toEqual(['house-patta', 'light-file', 'noc', 'ration-card']);
    for (const [id, g] of Object.entries(serviceGuides)) {
      expect(g.about.trim(), id).not.toBe('');
      expect(g.aboutEn, id).not.toMatch(/[ऀ-ॿ]/);
      expect(g.documents.length, id).toBeGreaterThan(1);
      expect(g.documentsEn, id).toHaveLength(g.documents.length);
      expect(g.steps.length, id).toBeGreaterThan(2);
      expect(g.stepsEn, id).toHaveLength(g.steps.length);
      expect(g.where.length, id).toBeGreaterThan(0);
      expect(g.whereEn, id).toHaveLength(g.where.length);
      for (const t of [...g.documentsEn, ...g.stepsEn, ...g.whereEn]) expect(t, id).not.toMatch(/[ऀ-ॿ]/);
    }
  });

  it('members: all positions in order, one ward panch for every ward', () => {
    const roles = [...new Set(members.map((m) => m.role))];
    expect(roles).toEqual(['sarpanch', 'up-sarpanch', 'vdo', 'assistant-secretary', 'patwari', 'krishi-paryavekshak', 'sahakari-samiti', 'ward-panch']);
    const wards = members.filter((m) => m.role === 'ward-panch').map((m) => m.ward);
    expect(wards).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(unique(members.map((m) => m.id))).toBe(true);
    for (const m of members) {
      expect(m.name.trim(), m.id).not.toBe('');
      expect(m.nameEn, m.id).not.toMatch(/[\u0900-\u097F]/);
      if (m.photo) expect(existsSync(join(process.cwd(), 'public', m.photo)), m.photo).toBe(true);
    }
  });

  it('gallery: every photo exists in public/ and has Hindi + English captions', () => {
    expect(gallery.length).toBeGreaterThanOrEqual(8);
    expect(unique(gallery.map((g) => g.id))).toBe(true);
    for (const g of gallery) {
      expect(existsSync(join(process.cwd(), 'public', g.src)), g.src).toBe(true);
      expect(g.caption.trim(), g.id).not.toBe('');
      expect(g.captionEn, g.id).not.toMatch(/[\u0900-\u097F]/);
    }
  });

  it('sarpanch: 21 numbered goals with English, photo exists, matches the members list', () => {
    const goals = sarpanch.goalGroups.flatMap((g) => g.goals);
    expect(goals.map((g) => g.n).sort((a, b) => a - b)).toEqual(Array.from({ length: 21 }, (_, i) => i + 1));
    for (const g of goals) {
      expect(g.text.trim(), String(g.n)).not.toBe('');
      expect(g.textEn, String(g.n)).not.toMatch(/[\u0900-\u097F]/);
    }
    expect(existsSync(join(process.cwd(), 'public', sarpanch.photo))).toBe(true);
    expect(existsSync(join(process.cwd(), 'public', sarpanch.poster))).toBe(true);
    const m = members.find((x) => x.role === 'sarpanch')!;
    expect(m.name).toBe(sarpanch.name);
    expect(m.photo).toBe(sarpanch.photo);
    expect(JSON.stringify(sarpanch)).not.toMatch(/प्रत्याशी|विजयी|मत एवं समर्थन/);
  });

  it('uses the new name पंचायत बैठक (कोरम), not ग्राम सभा / Gram Sabha', () => {
    const text = JSON.stringify([works, gramSabha, notices, panchayat, dictionary]);
    expect(text).not.toMatch(/ग्राम सभा|Gram Sabha/);
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
