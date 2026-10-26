// TDD: written before the Sarpanch profile existed.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import SarpanchHighlight from '@/components/sarpanch/SarpanchHighlight';
import SarpanchProfile from '@/components/sarpanch/SarpanchProfile';
import MemberCard from '@/components/members/MemberCard';
import LanguageToggle from '@/components/layout/LanguageToggle';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';
import { getMembers, getSarpanch } from '@/lib/data';

beforeEach(() => localStorage.clear());

describe('SarpanchHighlight (home page card)', () => {
  it('shows the title, photo and a link to the full profile', async () => {
    const s = await getSarpanch();
    render(<SarpanchHighlight sarpanch={s} />);
    expect(screen.getByRole('heading', { name: 'हमारे सरपंच — मांगी लाल बुनकर' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /मांगी लाल बुनकर/ })).toHaveAttribute('src', '/images/members/mangi-lal-bunkar.webp');
    expect(screen.getByRole('link', { name: /पूरी प्रोफ़ाइल देखें/ })).toHaveAttribute('href', '/sarpanch');
    expect(screen.getByText(/आपलियास/)).toBeInTheDocument();
  });
});

describe('SarpanchProfile', () => {
  it('shows name in Hindi and English, place, and the main sections', async () => {
    const s = await getSarpanch();
    render(<SarpanchProfile sarpanch={s} />);
    expect(screen.getByText('मांगी लाल बुनकर')).toBeInTheDocument();
    expect(screen.getByText('Mangi Lal Bunkar')).toBeInTheDocument();
    for (const place of ['आपलियास', 'हुरड़ा', 'भीलवाड़ा', 'राजस्थान']) expect(screen.getAllByText(new RegExp(place)).length).toBeGreaterThan(0);
    for (const h of ['परिचय', 'सरपंच की ज़िम्मेदारियाँ', 'विकास के संकल्प (उद्देश्य)']) {
      expect(screen.getByRole('heading', { name: h })).toBeInTheDocument();
    }
  });

  it('lists all 21 goals from the template, numbered 1–21', async () => {
    const s = await getSarpanch();
    render(<SarpanchProfile sarpanch={s} />);
    const goals = screen.getByRole('region', { name: 'विकास के संकल्प (उद्देश्य)' });
    const numbers = within(goals).getAllByTestId('goal-number').map((n) => Number(n.textContent));
    expect(numbers.sort((a, b) => a - b)).toEqual(Array.from({ length: 21 }, (_, i) => i + 1));
    expect(within(goals).getByText(/हर आवासीय मकान का पट्टा बनाना/)).toBeInTheDocument();
    expect(within(goals).getByText(/नियमित सफाई कार्य एवं नालियों की सफाई/)).toBeInTheDocument();
  });

  it('never shows election appeals, and hides completed works when none are verified', async () => {
    const s = await getSarpanch();
    const { container } = render(<SarpanchProfile sarpanch={{ ...s, works: [] }} />);
    expect(container.textContent).not.toMatch(/प्रत्याशी|विजयी|मत एवं समर्थन/);
    expect(screen.queryByRole('heading', { name: 'पूर्ण व चालू कार्य' })).not.toBeInTheDocument();
  });

  it('switches to English', async () => {
    const s = await getSarpanch();
    render(
      <LanguageProvider>
        <LanguageToggle />
        <SarpanchProfile sarpanch={s} />
      </LanguageProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
    expect(screen.getByRole('heading', { name: 'Development goals (objectives)' })).toBeInTheDocument();
    expect(screen.getAllByText(/Appliyas/).length).toBeGreaterThan(0);
  });
});

describe('संकल्प पत्र (poster)', () => {
  it('shows the poster and opens it full size in a new tab', async () => {
    const s = await getSarpanch();
    render(<SarpanchProfile sarpanch={s} />);
    const section = screen.getByRole('region', { name: 'संकल्प पत्र' });
    expect(within(section).getByRole('img', { name: /संकल्प पत्र/ })).toHaveAttribute('src', '/images/members/sankalp-patra.jpg');
    const link = within(section).getByRole('link', { name: /पूरा देखें/ });
    expect(link).toHaveAttribute('href', '/images/members/sankalp-patra.jpg');
    expect(link).toHaveAttribute('target', '_blank');
  });
});

describe('Sarpanch on the members page', () => {
  it('the Sarpanch card shows Mangi Lal Bunkar with his photo and links to the profile', async () => {
    const [sarpanch] = await getMembers();
    render(<MemberCard member={sarpanch} />);
    expect(screen.getByRole('heading', { name: 'मांगी लाल बुनकर' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /मांगी लाल बुनकर/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /पूरी प्रोफ़ाइल देखें/ })).toHaveAttribute('href', '/sarpanch');
  });
});
