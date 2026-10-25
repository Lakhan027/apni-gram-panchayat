import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePathname } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';
import Header from '@/components/layout/Header';
import type { SearchItem } from '@/lib/types';

const index: SearchItem[] = [
  { type: 'work', id: 'W-001', title: 'मुख्य मार्ग सड़क', titleEn: 'Main road', category: 'road', ward: 3, href: '/works/W-001' },
  { type: 'scheme', id: 'old-age-pension', title: 'वृद्धावस्था पेंशन', titleEn: 'Old Age Pension', category: 'welfare', href: '/schemes/old-age-pension' },
  { type: 'notice', id: 'N-002', title: 'पेंशन सत्यापन', titleEn: 'Pension verification', category: 'deadline', href: '/notices#N-002' },
];

const openMenu = () => userEvent.click(screen.getByRole('button', { name: 'मेन्यू खोलें' }));

describe('Header navigation', () => {
  it('highlights the current section in the desktop menu', () => {
    vi.mocked(usePathname).mockReturnValue('/works/W-001/');
    render(<Header searchIndex={index} />);
    const nav = screen.getByRole('navigation', { name: 'मुख्य मेन्यू' });
    expect(within(nav).getByRole('link', { name: 'विकास कार्य' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: 'होम' })).not.toHaveAttribute('aria-current');
  });

  it('links सरपंच लॉगिन to /admin', () => {
    render(<Header searchIndex={index} />);
    for (const link of screen.getAllByRole('link', { name: /सरपंच लॉगिन/, hidden: true })) {
      expect(link).toHaveAttribute('href', '/admin');
    }
  });
});

describe('Mobile menu', () => {
  it('opens with all 10 links and locks page scroll', async () => {
    render(<Header searchIndex={index} />);
    await openMenu();
    const dialog = screen.getByRole('dialog', { name: 'मुख्य मेन्यू' });
    expect(within(dialog).getAllByRole('link').filter((l) => l.getAttribute('href') !== '/admin')).toHaveLength(10);
    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.getByRole('button', { name: 'मेन्यू खोलें' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes on Escape and restores scroll', async () => {
    render(<Header searchIndex={index} />);
    await openMenu();
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'मेन्यू खोलें', hidden: true })).toHaveAttribute('aria-expanded', 'false');
    expect(document.body.style.overflow).toBe('');
  });

  it('closes with the close button and when a link is tapped', async () => {
    render(<Header searchIndex={index} />);
    await openMenu();
    await userEvent.click(screen.getByRole('button', { name: 'मेन्यू बंद करें' }));
    expect(screen.getByRole('button', { name: 'मेन्यू खोलें', hidden: true })).toHaveAttribute('aria-expanded', 'false');

    await openMenu();
    const dialog = screen.getByRole('dialog', { name: 'मुख्य मेन्यू' });
    await userEvent.click(within(dialog).getByRole('link', { name: 'मनरेगा' }));
    expect(screen.getByRole('button', { name: 'मेन्यू खोलें', hidden: true })).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('Header search', () => {
  it('shows matches across works, notices and schemes', async () => {
    render(<Header searchIndex={index} />);
    await userEvent.click(screen.getByRole('button', { name: 'खोजें' }));
    const input = screen.getByRole('searchbox');
    expect(input).toHaveFocus();
    await userEvent.type(input, 'पेंशन');
    const links = screen.getAllByRole('link').filter((l) => l.closest('#header-search'));
    expect(links.map((l) => l.getAttribute('href'))).toEqual(['/schemes/old-age-pension', '/notices#N-002']);
  });

  it('searches by ID and needs at least 2 characters', async () => {
    render(<Header searchIndex={index} />);
    await userEvent.click(screen.getByRole('button', { name: 'खोजें' }));
    await userEvent.type(screen.getByRole('searchbox'), 'w');
    expect(screen.queryByText('मुख्य मार्ग सड़क')).not.toBeInTheDocument();
    await userEvent.type(screen.getByRole('searchbox'), '-001');
    expect(screen.getByText('मुख्य मार्ग सड़क')).toBeInTheDocument();
  });

  it('says when nothing matches and closes on Escape', async () => {
    render(<Header searchIndex={index} />);
    await userEvent.click(screen.getByRole('button', { name: 'खोजें' }));
    await userEvent.type(screen.getByRole('searchbox'), 'xyz');
    expect(screen.getByText(/कोई परिणाम नहीं मिला/)).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });
});
