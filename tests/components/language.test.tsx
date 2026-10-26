// TDD: written before the language switcher existed.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';
import { L, T } from '@/lib/i18n/T';
import LanguageToggle from '@/components/layout/LanguageToggle';
import Header from '@/components/layout/Header';
import WorkCard from '@/components/works/WorkCard';
import type { Work } from '@/lib/types';

const STORAGE_KEY = 'agp-lang';

beforeEach(() => localStorage.clear());
afterEach(() => {
  vi.restoreAllMocks();
  document.documentElement.lang = 'hi';
});

const withLang = (ui: React.ReactNode) => render(<LanguageProvider>{ui}</LanguageProvider>);
const toEnglish = () => userEvent.click(screen.getByRole('button', { name: 'Switch to English' }));

describe('LanguageToggle', () => {
  it('starts in Hindi and switches to English and back', async () => {
    withLang(<><LanguageToggle /><T k="nav.home" /></>);
    expect(screen.getByText('होम')).toBeInTheDocument();
    await toEnglish();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('en');
    await userEvent.click(screen.getByRole('button', { name: 'हिंदी में बदलें' }));
    expect(screen.getByText('होम')).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('hi');
  });

  it('remembers the choice for the next visit', async () => {
    const { unmount } = withLang(<LanguageToggle />);
    await toEnglish();
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en');
    unmount();
    withLang(<T k="nav.home" />);
    expect(await screen.findByText('Home')).toBeInTheDocument();
  });

  it('ignores a bad stored value and still works when storage is blocked', async () => {
    localStorage.setItem(STORAGE_KEY, 'fr');
    const { unmount } = withLang(<T k="nav.home" />);
    expect(screen.getByText('होम')).toBeInTheDocument();
    unmount();

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    withLang(<><LanguageToggle /><T k="nav.home" /></>);
    await toEnglish();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});

describe('T and L', () => {
  it('T interpolates values', async () => {
    withLang(<><LanguageToggle /><T k="works.found" vars={{ n: 3 }} /></>);
    expect(screen.getByText('3 कार्य मिले')).toBeInTheDocument();
    await toEnglish();
    expect(screen.getByText('3 works found')).toBeInTheDocument();
  });

  it('L shows English data when it exists and keeps Hindi otherwise', async () => {
    withLang(<><LanguageToggle /><span><L hi="सड़क" en="Road" /></span><span><L hi="नाली" /></span></>);
    await toEnglish();
    expect(screen.getByText('Road')).toBeInTheDocument();
    expect(screen.getByText('नाली')).toBeInTheDocument();
  });

  it('works without a provider (defaults to Hindi)', () => {
    render(<T k="nav.home" />);
    expect(screen.getByText('होम')).toBeInTheDocument();
  });
});

describe('translated components', () => {
  it('header menu, search and login switch to English', async () => {
    withLang(<Header searchIndex={[]} />);
    await toEnglish();
    const nav = screen.getByRole('navigation', { name: 'Main menu' });
    expect(within(nav).getAllByRole('link').map((l) => l.textContent)).toEqual([
      'Home', 'About Panchayat', 'Development Works', 'VB—G RAM G (NREGA)', 'Budget & Expenditure',
      'Panchayat Meeting (Quorum)', 'Schemes', 'Notices', 'Complaints', 'Contact',
    ]);
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });

  it('work card shows English labels, status, money and data', async () => {
    const work: Work = {
      id: 'W-001', name: 'मुख्य मार्ग सड़क', en: { name: 'Main road CC construction', scheme: 'State Finance Commission' },
      description: '', category: 'road', ward: 3, status: 'in-progress', scheme: 'राज्य वित्त आयोग',
      approvalRef: null, approvedBudget: 650000, recordedExpenditure: 312000, startDate: null,
      expectedCompletion: null, progress: 48, createdAt: '2026-07-01',
      photos: { before: [], progress: [], completed: [] }, updates: [], documents: [],
    };
    withLang(<><LanguageToggle /><WorkCard work={work} /></>);
    await toEnglish();
    expect(screen.getByRole('link', { name: 'Main road CC construction' })).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
    expect(screen.getByText('Ward 3')).toBeInTheDocument();
    expect(screen.getByText('Road')).toBeInTheDocument();
    expect(screen.getByText('Approved budget')).toBeInTheDocument();
    expect(screen.getByText('₹6,50,000')).toBeInTheDocument();
    expect(screen.getByText('State Finance Commission')).toBeInTheDocument();
  });
});
