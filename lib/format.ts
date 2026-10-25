// Formatting and money math. All totals on every page are computed here from the same rows.
import type { BudgetLine, PaymentRecord, Work } from './types';

type Lang = 'hi' | 'en';

const MONTHS: Record<Lang, string[]> = {
  hi: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

const UNITS: Record<Lang, { lakh: string; crore: string }> = {
  hi: { lakh: 'लाख', crore: 'करोड़' },
  en: { lakh: 'lakh', crore: 'crore' },
};

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** ₹6,50,000 (same in both languages) */
export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '—';
  return `₹${inr.format(amount)}`;
}

/** ₹6.5 लाख / ₹6.5 lakh, ₹1.2 करोड़ / ₹1.2 crore for summary tiles */
export function formatINRShort(amount: number | null | undefined, lang: Lang = 'hi'): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '—';
  const trim = (n: number) => n.toFixed(2).replace(/\.?0+$/, '');
  if (amount >= 1_00_00_000) return `₹${trim(amount / 1_00_00_000)} ${UNITS[lang].crore}`;
  if (amount >= 1_00_000) return `₹${trim(amount / 1_00_000)} ${UNITS[lang].lakh}`;
  return formatINR(amount);
}

export function formatNumber(n: number): string {
  return inr.format(n);
}

function parseDate(iso: string): Date | null {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m) return null;
  return new Date(Date.UTC(y, m - 1, d || 1));
}

/** 15 नवम्बर 2026 / 15 November 2026 */
export function formatDate(iso: string | null | undefined, lang: Lang = 'hi'): string {
  if (!iso) return '—';
  const d = parseDate(iso);
  if (!d) return '—';
  return `${d.getUTCDate()} ${MONTHS[lang][d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Hindi date — kept for callers that are always Hindi (e.g. CSV, metadata). */
export function formatDateHi(iso: string | null | undefined): string {
  return formatDate(iso, 'hi');
}

/** Parts for a date tile: { day: '15', month: 'नवम्बर', year: '2026' } */
export function dateTileParts(iso: string, lang: Lang = 'hi'): { day: string; month: string; year: string } {
  const d = parseDate(iso);
  if (!d) return { day: '—', month: '', year: '' };
  return {
    day: String(d.getUTCDate()),
    month: MONTHS[lang][d.getUTCMonth()],
    year: String(d.getUTCFullYear()),
  };
}

export function clampPercent(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function percentOf(part: number, whole: number): number {
  if (!whole) return 0;
  return clampPercent((part / whole) * 100);
}

/** Remaining budget only when both figures exist and expenditure does not exceed approval. */
export function remainingBudget(approved: number | null, recorded: number | null): number | null {
  if (approved === null || recorded === null) return null;
  if (recorded > approved) return null;
  return approved - recorded;
}

export function sum<T>(rows: T[], pick: (row: T) => number | null | undefined): number {
  return rows.reduce((acc, row) => acc + (pick(row) ?? 0), 0);
}

/**
 * Approved amounts come from budget lines; recorded and verified amounts come only from
 * payment rows, so every total, bar and table on the site adds up to the same numbers.
 */
export function budgetTotals(lines: BudgetLine[], payments: PaymentRecord[]) {
  const approved = sum(lines, (l) => l.approved);
  const recorded = sum(payments, (p) => p.amount);
  const verified = sum(payments, (p) => (p.status === 'verified' ? p.amount : 0));
  return { approved, recorded, verified, remaining: Math.max(0, approved - recorded) };
}

export interface WorkBudgetRow {
  workId: string;
  workName: string;
  workNameEn?: string;
  scheme: string;
  schemeEn?: string;
  approved: number;
  recorded: number;
  verified: number;
}

export function workWiseRows(lines: BudgetLine[], payments: PaymentRecord[]): WorkBudgetRow[] {
  return lines.map((l) => {
    const own = payments.filter((p) => p.workId === l.workId && p.financialYear === l.financialYear);
    return {
      workId: l.workId,
      workName: l.workName,
      workNameEn: l.en?.workName,
      scheme: l.scheme,
      schemeEn: l.en?.scheme,
      approved: l.approved,
      recorded: sum(own, (p) => p.amount),
      verified: sum(own, (p) => (p.status === 'verified' ? p.amount : 0)),
    };
  });
}

export function groupByScheme(rows: WorkBudgetRow[]) {
  const map = new Map<string, { scheme: string; schemeEn?: string; approved: number; recorded: number }>();
  for (const r of rows) {
    const row = map.get(r.scheme) ?? { scheme: r.scheme, schemeEn: r.schemeEn, approved: 0, recorded: 0 };
    row.approved += r.approved;
    row.recorded += r.recorded;
    map.set(r.scheme, row);
  }
  return Array.from(map.values()).sort((a, b) => b.approved - a.approved);
}

export function workTotals(works: Work[]) {
  return {
    total: works.length,
    inProgress: works.filter((w) => w.status === 'in-progress').length,
    completed: works.filter((w) => w.status === 'completed').length,
    approvedBudget: sum(works, (w) => w.approvedBudget),
  };
}

/** Builds a CSV string (UTF-8 with BOM so Excel shows Hindi correctly). */
export function toCSV(headers: string[], rows: (string | number)[][]): string {
  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const body = [headers, ...rows].map((r) => r.map(esc).join(',')).join('\r\n');
  return `﻿${body}`;
}
