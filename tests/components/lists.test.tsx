import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import NoticesExplorer from '@/components/notices/NoticesExplorer';
import NoticeCard from '@/components/notices/NoticeCard';
import SchemesExplorer from '@/components/schemes/SchemesExplorer';
import BudgetExplorer from '@/components/budget/BudgetExplorer';
import { getBudget, getSchemes } from '@/lib/data';
import type { BudgetData, Notice } from '@/lib/types';

const notice = (i: number, extra: Partial<Notice> = {}): Notice => ({
  id: `N-${String(i).padStart(3, '0')}`,
  date: `2026-${String((i % 12) + 1).padStart(2, '0')}-10`,
  category: i % 2 ? 'works' : 'health',
  title: `सूचना ${i}`,
  summary: 'सारांश',
  important: false,
  attachment: null,
  ...extra,
});

describe('NoticesExplorer', () => {
  const notices = Array.from({ length: 14 }, (_, i) => notice(i));

  it('shows 10 at a time and loads more', async () => {
    render(<NoticesExplorer notices={notices} />);
    expect(screen.getAllByRole('article')).toHaveLength(10);
    await userEvent.click(screen.getByRole('button', { name: /और देखें \(4 शेष\)/ }));
    expect(screen.getAllByRole('article')).toHaveLength(14);
    expect(screen.queryByRole('button', { name: /और देखें/ })).not.toBeInTheDocument();
  });

  it('sorts newest first', () => {
    render(<NoticesExplorer notices={notices} />);
    const dates = notices.map((n) => n.date).sort().reverse();
    expect(screen.getAllByRole('article')[0].id).toBe(notices.find((n) => n.date === dates[0])!.id);
  });

  it('filters by category and search, with an empty state', async () => {
    render(<NoticesExplorer notices={notices} />);
    await userEvent.click(screen.getByRole('button', { name: 'विकास कार्य' }));
    expect(screen.getByText('7 सूचनाएँ')).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('सूचना खोजें'), 'सूचना 13');
    expect(screen.getAllByRole('article')).toHaveLength(1);
    await userEvent.type(screen.getByLabelText('सूचना खोजें'), 'xyz');
    expect(screen.getByText('कोई सूचना नहीं मिली')).toBeInTheDocument();
  });
});

describe('NoticeCard', () => {
  it('flags important notices with text, not colour alone', () => {
    render(<NoticeCard notice={notice(1, { important: true, attachment: 'सूचना पत्र' })} />);
    expect(screen.getByText('महत्वपूर्ण')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /सूचना पत्र/ })).toBeDisabled();
  });
});

describe('SchemesExplorer', () => {
  it('filters by category chip and marks unverified schemes', async () => {
    const schemes = await getSchemes();
    render(<SchemesExplorer schemes={schemes} />);
    expect(screen.getAllByRole('article')).toHaveLength(schemes.length);
    await userEvent.click(screen.getByRole('button', { name: 'पेंशन व कल्याण' }));
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(schemes.filter((s) => s.category === 'welfare').length);
    expect(within(cards[0]).getByText('सत्यापन आवश्यक')).toBeInTheDocument();
  });
});

describe('BudgetExplorer', () => {
  afterEach(() => vi.restoreAllMocks());

  const totals = () => {
    const dl = screen.getByLabelText('बजट सारांश');
    return Object.fromEntries(
      within(dl).getAllByRole('term').map((dt) => [dt.textContent, dt.parentElement!.querySelector('dd')!.textContent]),
    );
  };

  it('shows separate totals for the current year that match the rows', async () => {
    render(<BudgetExplorer data={await getBudget()} />);
    expect(totals()).toEqual({
      'स्वीकृत राशि': '₹39,55,000',
      'दर्ज खर्च': '₹17,07,000',
      'सत्यापित भुगतान': '₹13,53,000',
      'शेष राशि': '₹22,48,000',
    });
  });

  it('recomputes when the year or date range changes', async () => {
    render(<BudgetExplorer data={await getBudget()} />);
    await userEvent.selectOptions(screen.getByLabelText('वित्तीय वर्ष'), '2025-26');
    expect(totals()['स्वीकृत राशि']).toBe('₹7,85,000');
    await userEvent.selectOptions(screen.getByLabelText('वित्तीय वर्ष'), '2026-27');
    await userEvent.type(screen.getByLabelText('भुगतान तिथि से'), '2026-10-01');
    // only October 2026 payments: 62,000 + 1,80,000 + 50,000 + 62,000
    expect(totals()['दर्ज खर्च']).toBe('₹3,54,000');
    expect(totals()['स्वीकृत राशि']).toBe('₹39,55,000');
  });

  it('shows an empty state for a category with no lines', async () => {
    const data: BudgetData = await getBudget();
    render(<BudgetExplorer data={data} />);
    await userEvent.selectOptions(screen.getByLabelText('श्रेणी'), 'sanitation');
    expect(screen.getByText('इस चयन के लिए कोई बजट रिकॉर्ड नहीं मिला')).toBeInTheDocument();
  });

  it('downloads a CSV of the filtered payment rows', async () => {
    let blob: Blob | undefined;
    URL.createObjectURL = vi.fn((b: Blob) => {
      blob = b;
      return 'blob:csv';
    });
    URL.revokeObjectURL = vi.fn();
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    const data = await getBudget();
    render(<BudgetExplorer data={data} />);
    await userEvent.click(screen.getByRole('button', { name: /CSV डाउनलोड/ }));

    expect(click).toHaveBeenCalledOnce();
    // jsdom's Blob has no .text(); read it the way a browser would.
    const text = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.readAsText(blob!);
    });
    const lines = text.replace('﻿', '').split('\r\n');
    expect(lines[0]).toBe('दिनांक,कार्य ID,कार्य,वाउचर संदर्भ,राशि (₹),स्थिति');
    expect(lines).toHaveLength(1 + data.payments.filter((p) => p.financialYear === '2026-27').length);
  });

  it('prints with window.print', async () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => {});
    render(<BudgetExplorer data={await getBudget()} />);
    await userEvent.click(screen.getByRole('button', { name: /प्रिंट करें/ }));
    expect(print).toHaveBeenCalledOnce();
  });
});
