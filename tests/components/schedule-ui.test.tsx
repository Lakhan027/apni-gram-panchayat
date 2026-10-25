// TDD: written before the schedule badge and delayed filter existed.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import WorkCard from '@/components/works/WorkCard';
import WorksExplorer from '@/components/works/WorksExplorer';
import ScheduleBadge from '@/components/works/ScheduleBadge';
import type { Work } from '@/lib/types';

const TODAY = '2026-10-25';
const mk = (id: string, name: string, status: Work['status'], expectedCompletion: string | null, progress: number): Work => ({
  id, name, status, expectedCompletion, progress,
  description: '', category: 'road', ward: 1, scheme: 'राज्य वित्त आयोग', approvalRef: null,
  approvedBudget: 100000, recordedExpenditure: 0, startDate: null, createdAt: '2026-01-01',
  photos: { before: [], progress: [], completed: [] }, updates: [], documents: [],
});

const late = mk('W-101', 'देरी वाला कार्य', 'in-progress', '2026-09-30', 40);
const soon = mk('W-102', 'जल्द पूरा होने वाला', 'in-progress', '2026-11-10', 50);
const fine = mk('W-103', 'समय पर कार्य', 'in-progress', '2027-03-31', 20);

describe('ScheduleBadge', () => {
  it('shows delayed works with text and the days overdue', () => {
    render(<ScheduleBadge work={late} today={TODAY} />);
    expect(screen.getByText('समय से पीछे')).toBeInTheDocument();
    expect(screen.getByText('(25 दिन)')).toBeInTheDocument();
  });

  it('shows due-soon works', () => {
    render(<ScheduleBadge work={soon} today={TODAY} />);
    expect(screen.getByText('समय सीमा निकट')).toBeInTheDocument();
  });

  it('renders nothing for on-track, done or undated works', () => {
    const { container } = render(
      <>
        <ScheduleBadge work={fine} today={TODAY} />
        <ScheduleBadge work={mk('W-1', 'x', 'completed', '2026-01-01', 100)} today={TODAY} />
        <ScheduleBadge work={mk('W-2', 'y', 'proposed', null, 0)} today={TODAY} />
      </>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe('WorkCard with schedule', () => {
  it('shows the schedule badge when a date is passed in', () => {
    render(<WorkCard work={late} today={TODAY} />);
    expect(screen.getByText('समय से पीछे')).toBeInTheDocument();
  });
  it('stays unchanged when no date is passed', () => {
    render(<WorkCard work={late} />);
    expect(screen.queryByText('समय से पीछे')).not.toBeInTheDocument();
  });
});

describe('WorksExplorer delayed filter', () => {
  it('can show only delayed works', async () => {
    render(<WorksExplorer works={[late, soon, fine]} today={TODAY} />);
    expect(screen.getByText('3 कार्य मिले')).toBeInTheDocument();
    const toggle = screen.getByRole('checkbox', { name: 'केवल समय से पीछे वाले कार्य (1)' });
    await userEvent.click(toggle);
    expect(screen.getByText('1 कार्य मिले')).toBeInTheDocument();
    expect(within(screen.getByRole('article')).getByText('देरी वाला कार्य')).toBeInTheDocument();
  });

  it('reset clears the delayed filter too', async () => {
    render(<WorksExplorer works={[soon, fine]} today={TODAY} />);
    await userEvent.click(screen.getByRole('checkbox', { name: /केवल समय से पीछे/ }));
    expect(screen.getByText('कोई कार्य नहीं मिला')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'फ़िल्टर हटाएँ' }));
    expect(screen.getByRole('checkbox', { name: /केवल समय से पीछे/ })).not.toBeChecked();
    expect(screen.getByText('2 कार्य मिले')).toBeInTheDocument();
  });
});
