import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import WorksExplorer from '@/components/works/WorksExplorer';
import WorkCard from '@/components/works/WorkCard';
import WorkDetail from '@/components/works/WorkDetail';
import PhotoGallery from '@/components/works/PhotoGallery';
import type { Work } from '@/lib/types';

const base: Omit<Work, 'id' | 'name' | 'status' | 'ward' | 'category' | 'approvedBudget' | 'progress' | 'createdAt'> = {
  description: 'विवरण',
  scheme: 'राज्य वित्त आयोग',
  approvalRef: 'AR-1',
  recordedExpenditure: 0,
  startDate: '2026-07-10',
  expectedCompletion: '2026-12-31',
  photos: { before: ['/images/work-before.svg'], progress: [], completed: [] },
  updates: [{ date: '2026-07-10', text: 'कार्य प्रारंभ' }],
  documents: [{ name: 'स्वीकृति पत्र', type: 'PDF' }],
};
const mk = (id: string, name: string, status: Work['status'], ward: number, category: Work['category'], approvedBudget: number | null, progress: number, createdAt: string): Work => ({
  ...base, id, name, status, ward, category, approvedBudget, progress, createdAt,
});
const works = [
  mk('W-001', 'मुख्य मार्ग सड़क', 'in-progress', 3, 'road', 650000, 48, '2026-07-01'),
  mk('W-002', 'पक्की नाली', 'completed', 5, 'drain', 280000, 100, '2026-03-01'),
  mk('W-003', 'तालाब गहरीकरण', 'in-progress', 1, 'pond', 920000, 42, '2026-03-20'),
  mk('W-004', 'स्ट्रीट लाइट', 'approved', 2, 'streetlight', null, 0, '2026-09-12'),
];

const cardTitles = () => screen.getAllByRole('article').map((a) => within(a).getByRole('heading').textContent);

describe('WorksExplorer', () => {
  it('lists all works newest first', () => {
    render(<WorksExplorer works={works} />);
    expect(screen.getByText('4 कार्य मिले')).toBeInTheDocument();
    expect(cardTitles()).toEqual(['स्ट्रीट लाइट', 'मुख्य मार्ग सड़क', 'तालाब गहरीकरण', 'पक्की नाली']);
  });

  it('filters by status chip', async () => {
    render(<WorksExplorer works={works} />);
    await userEvent.click(screen.getByRole('button', { name: 'प्रगति पर' }));
    expect(cardTitles()).toEqual(['मुख्य मार्ग सड़क', 'तालाब गहरीकरण']);
  });

  it('filters by category and ward', async () => {
    render(<WorksExplorer works={works} />);
    await userEvent.selectOptions(screen.getByLabelText('श्रेणी'), 'drain');
    expect(cardTitles()).toEqual(['पक्की नाली']);
    await userEvent.selectOptions(screen.getByLabelText('श्रेणी'), 'all');
    await userEvent.selectOptions(screen.getByLabelText('वार्ड'), '1');
    expect(cardTitles()).toEqual(['तालाब गहरीकरण']);
  });

  it('searches by name, ID and ward', async () => {
    render(<WorksExplorer works={works} />);
    const box = screen.getByLabelText('कार्य खोजें');
    await userEvent.type(box, 'W-002');
    expect(cardTitles()).toEqual(['पक्की नाली']);
    await userEvent.clear(box);
    await userEvent.type(box, 'वार्ड 3');
    expect(cardTitles()).toEqual(['मुख्य मार्ग सड़क']);
  });

  it('sorts by budget and by progress', async () => {
    render(<WorksExplorer works={works} />);
    await userEvent.selectOptions(screen.getByLabelText('क्रम'), 'budget');
    expect(cardTitles()[0]).toBe('तालाब गहरीकरण');
    expect(cardTitles()[3]).toBe('स्ट्रीट लाइट'); // null budget last
    await userEvent.selectOptions(screen.getByLabelText('क्रम'), 'progress');
    expect(cardTitles()[0]).toBe('पक्की नाली');
  });

  it('shows the empty state and resets filters', async () => {
    render(<WorksExplorer works={works} />);
    await userEvent.type(screen.getByLabelText('कार्य खोजें'), 'कुछ भी नहीं');
    expect(screen.getByText('कोई कार्य नहीं मिला')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'फ़िल्टर हटाएँ' }));
    expect(screen.getByText('4 कार्य मिले')).toBeInTheDocument();
    expect(screen.getByLabelText('कार्य खोजें')).toHaveValue('');
  });

  it('switches to the table view', async () => {
    render(<WorksExplorer works={works} />);
    await userEvent.click(screen.getByRole('button', { name: /तालिका/ }));
    expect(screen.getByRole('table', { name: 'विकास कार्यों की तालिका' })).toBeInTheDocument();
  });

  it('toggles the phone filter panel', async () => {
    render(<WorksExplorer works={works} />);
    const toggle = screen.getByRole('button', { name: /फ़िल्टर/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });
});

describe('WorkCard', () => {
  it('shows ID, ward, money in Indian format and a link to the detail page', () => {
    render(<WorkCard work={works[0]} />);
    expect(screen.getByText('W-001')).toBeInTheDocument();
    expect(screen.getByText('वार्ड 3')).toBeInTheDocument();
    expect(screen.getByText('₹6,50,000')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'मुख्य मार्ग सड़क' })).toHaveAttribute('href', '/works/W-001');
  });
});

describe('WorkDetail', () => {
  it('shows remaining budget only when both figures are compatible', () => {
    const { unmount } = render(<WorkDetail work={{ ...works[0], recordedExpenditure: 312000 }} />);
    expect(screen.getByText('शेष बजट')).toBeInTheDocument();
    expect(screen.getByText('₹3,38,000')).toBeInTheDocument();
    unmount();
    render(<WorkDetail work={{ ...works[3], recordedExpenditure: null }} />);
    expect(screen.queryByText('शेष बजट')).not.toBeInTheDocument();
  });

  it('keeps document downloads disabled', () => {
    render(<WorkDetail work={works[0]} />);
    expect(screen.getByRole('button', { name: /डाउनलोड/ })).toBeDisabled();
  });
});

describe('PhotoGallery', () => {
  it('switches tabs, shows an empty message and opens/closes the large view', async () => {
    render(<PhotoGallery photos={base.photos} title="सड़क" />);
    expect(screen.getByRole('tab', { name: /कार्य से पहले/ })).toHaveAttribute('aria-selected', 'true');

    await userEvent.click(screen.getByRole('button', { name: /फ़ोटो 1 बड़ा करें/ }));
    expect(screen.getByRole('dialog', { name: 'बड़ा फ़ोटो' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: /पूर्ण/ }));
    expect(screen.getByText('इस श्रेणी में अभी कोई फ़ोटो नहीं है।')).toBeInTheDocument();
  });
});
