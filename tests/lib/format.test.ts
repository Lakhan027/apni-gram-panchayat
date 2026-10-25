import { describe, expect, it } from 'vitest';
import {
  budgetTotals,
  clampPercent,
  dateTileParts,
  formatDateHi,
  formatINR,
  formatINRShort,
  formatNumber,
  groupByScheme,
  percentOf,
  remainingBudget,
  sum,
  toCSV,
  workTotals,
  workWiseRows,
} from '@/lib/format';
import type { BudgetLine, PaymentRecord, Work } from '@/lib/types';

describe('formatINR', () => {
  it('uses Indian digit grouping with ₹', () => {
    expect(formatINR(650000)).toBe('₹6,50,000');
    expect(formatINR(12345678)).toBe('₹1,23,45,678');
    expect(formatINR(0)).toBe('₹0');
  });
  it('shows a dash for missing values', () => {
    expect(formatINR(null)).toBe('—');
    expect(formatINR(undefined)).toBe('—');
    expect(formatINR(Number.NaN)).toBe('—');
  });
});

describe('formatINRShort', () => {
  it('uses लाख and करोड़ and trims trailing zeros', () => {
    expect(formatINRShort(650000)).toBe('₹6.5 लाख');
    expect(formatINRShort(100000)).toBe('₹1 लाख');
    expect(formatINRShort(3955000)).toBe('₹39.55 लाख');
    expect(formatINRShort(12000000)).toBe('₹1.2 करोड़');
  });
  it('falls back to full format below one lakh', () => {
    expect(formatINRShort(45000)).toBe('₹45,000');
    expect(formatINRShort(null)).toBe('—');
  });
});

describe('formatNumber', () => {
  it('groups Indian style', () => {
    expect(formatNumber(4250)).toBe('4,250');
    expect(formatNumber(100000)).toBe('1,00,000');
  });
});

describe('Hindi dates', () => {
  it('formats ISO dates as day month year in Hindi', () => {
    expect(formatDateHi('2026-11-15')).toBe('15 नवम्बर 2026');
    expect(formatDateHi('2026-01-01')).toBe('1 जनवरी 2026');
  });
  it('is not shifted by time zone', () => {
    expect(formatDateHi('2026-12-31')).toBe('31 दिसम्बर 2026');
  });
  it('handles empty or invalid input', () => {
    expect(formatDateHi(null)).toBe('—');
    expect(formatDateHi('')).toBe('—');
    expect(formatDateHi('nope')).toBe('—');
  });
  it('splits date tile parts', () => {
    expect(dateTileParts('2026-08-15')).toEqual({ day: '15', month: 'अगस्त', year: '2026' });
  });
});

describe('percent helpers', () => {
  it('clamps and rounds', () => {
    expect(clampPercent(-5)).toBe(0);
    expect(clampPercent(140)).toBe(100);
    expect(clampPercent(47.6)).toBe(48);
    expect(clampPercent(Number.NaN)).toBe(0);
  });
  it('percentOf avoids division by zero', () => {
    expect(percentOf(50, 200)).toBe(25);
    expect(percentOf(5, 0)).toBe(0);
  });
});

describe('remainingBudget', () => {
  it('returns approved minus recorded', () => {
    expect(remainingBudget(650000, 312000)).toBe(338000);
  });
  it('returns null when a figure is missing or incompatible', () => {
    expect(remainingBudget(null, 100)).toBeNull();
    expect(remainingBudget(100, null)).toBeNull();
    expect(remainingBudget(100, 200)).toBeNull();
  });
});

describe('sum', () => {
  it('treats null as zero', () => {
    expect(sum([{ v: 1 }, { v: null }, { v: 4 }], (r) => r.v)).toBe(5);
  });
});

const line = (workId: string, approved: number, scheme = 'A', fy = '2026-27'): BudgetLine => ({
  id: `L-${workId}`, financialYear: fy, scheme, workId, workName: workId, category: 'road', approved,
});
const pay = (workId: string, amount: number, status: PaymentRecord['status'], fy = '2026-27'): PaymentRecord => ({
  id: `P-${workId}-${amount}`, financialYear: fy, date: '2026-07-01', workId, workName: workId,
  category: 'road', voucherRef: null, amount, status,
});

describe('budget math', () => {
  const lines = [line('W1', 1000, 'A'), line('W2', 500, 'B'), line('W3', 300, 'A')];
  const payments = [pay('W1', 400, 'verified'), pay('W1', 100, 'recorded'), pay('W2', 200, 'pending'), pay('W2', 50, 'verified', '2025-26')];

  it('budgetTotals takes approved from lines and spend from payments', () => {
    expect(budgetTotals(lines, payments.slice(0, 3))).toEqual({ approved: 1800, recorded: 700, verified: 400, remaining: 1100 });
  });
  it('remaining never goes negative', () => {
    expect(budgetTotals([line('W1', 100)], [pay('W1', 500, 'recorded')]).remaining).toBe(0);
  });
  it('workWiseRows only counts payments of the same work and year', () => {
    const rows = workWiseRows(lines, payments);
    expect(rows.find((r) => r.workId === 'W1')).toMatchObject({ recorded: 500, verified: 400 });
    expect(rows.find((r) => r.workId === 'W2')).toMatchObject({ recorded: 200, verified: 0 });
    expect(rows.find((r) => r.workId === 'W3')).toMatchObject({ recorded: 0, verified: 0 });
  });
  it('groupByScheme adds up and sorts by approved amount', () => {
    const grouped = groupByScheme(workWiseRows(lines, payments));
    expect(grouped).toEqual([
      { scheme: 'A', approved: 1300, recorded: 500 },
      { scheme: 'B', approved: 500, recorded: 200 },
    ]);
  });
});

describe('workTotals', () => {
  it('counts statuses and sums approved budget', () => {
    const w = (status: Work['status'], approvedBudget: number | null) => ({ status, approvedBudget }) as Work;
    expect(workTotals([w('in-progress', 100), w('completed', 50), w('in-progress', null), w('proposed', 10)])).toEqual({
      total: 4, inProgress: 2, completed: 1, approvedBudget: 160,
    });
  });
});

describe('toCSV', () => {
  it('starts with a BOM and uses CRLF rows', () => {
    const csv = toCSV(['a', 'b'], [[1, 2]]);
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(csv.slice(1)).toBe('a,b\r\n1,2');
  });
  it('quotes commas, quotes and newlines', () => {
    expect(toCSV(['x'], [['a,b'], ['say "hi"'], ['l1\nl2']]).slice(1)).toBe('x\r\n"a,b"\r\n"say ""hi"""\r\n"l1\nl2"');
  });
  it('keeps Hindi text intact', () => {
    expect(toCSV(['कार्य'], [['सड़क']]).slice(1)).toBe('कार्य\r\nसड़क');
  });
});
