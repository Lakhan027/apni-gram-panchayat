// TDD: written before the पंचायत सदस्य and गैलरी features existed.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import MemberCard from '@/components/members/MemberCard';
import MembersGrid from '@/components/members/MembersGrid';
import VillageGallery from '@/components/gallery/VillageGallery';
import Hero from '@/components/home/Hero';
import LanguageToggle from '@/components/layout/LanguageToggle';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';
import { getGallery, getMembers } from '@/lib/data';

beforeEach(() => localStorage.clear());

describe('MemberCard', () => {
  it('shows photo placeholder, पद, नाम and मोबाइल नंबर in that order', async () => {
    const [sarpanch] = await getMembers();
    const { container } = render(<MemberCard member={sarpanch} />);
    const card = container.querySelector('article')!;
    const text = card.textContent!;
    expect(card.querySelector('[data-avatar]')).not.toBeNull();
    const iRole = text.indexOf('सरपंच');
    const iName = text.indexOf(sarpanch.name);
    const iMobile = text.indexOf('मोबाइल');
    expect(iRole).toBeGreaterThanOrEqual(0);
    expect(iRole).toBeLessThan(iName);
    expect(iName).toBeLessThan(iMobile);
  });
});

describe('MembersGrid', () => {
  it('shows one card per member, including every ward panch', async () => {
    const members = await getMembers();
    render(<MembersGrid members={members} />);
    expect(screen.getAllByRole('article')).toHaveLength(members.length);
    const wardCards = screen.getAllByRole('article').filter((a) => /वार्ड पंच/.test(a.textContent ?? ''));
    expect(wardCards).toHaveLength(9);
  });
});

describe('VillageGallery', () => {
  it('shows every photo with a caption and opens a large preview', async () => {
    const photos = await getGallery();
    render(<VillageGallery photos={photos} />);
    expect(screen.getAllByRole('figure')).toHaveLength(photos.length);
    expect(screen.getByText(photos[0].caption)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: new RegExp(photos[1].caption) }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', photos[1].src);
    expect(within(dialog).getByText(photos[1].caption)).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    await userEvent.click(within(dialog).getByRole('button', { name: 'अगली फ़ोटो' }));
    expect(within(dialog).getByText(photos[2].caption)).toBeInTheDocument();
    await userEvent.keyboard('{ArrowLeft}');
    expect(within(dialog).getByText(photos[1].caption)).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('Hero names per language', () => {
  it('Hindi shows आपलियास; English shows APPLIYAS in capitals', async () => {
    render(
      <LanguageProvider>
        <LanguageToggle />
        <Hero />
      </LanguageProvider>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('अपनी ग्राम पंचायत आपलियास');
    await userEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Apni Gram Panchayat APPLIYAS');
  });
});

describe('Hero photo', () => {
  it('shows the Panchayat building photo with an alt in the chosen language', async () => {
    render(
      <LanguageProvider>
        <LanguageToggle />
        <Hero />
      </LanguageProvider>,
    );
    const img = screen.getByRole('img', { name: 'ग्राम पंचायत भवन, आपलियास' });
    expect(img).toHaveAttribute('src', '/images/gallery/panchayat-bhawan-appliyas.jpg');
    await userEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
    expect(screen.getByRole('img', { name: 'Gram Panchayat building, Appliyas' })).toBeInTheDocument();
  });
});

describe('Hero buttons', () => {
  it('link to पंचायत सदस्य and गैलरी instead of works and NREGA', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: /पंचायत सदस्य/ })).toHaveAttribute('href', '/members');
    expect(screen.getByRole('link', { name: /गैलरी/ })).toHaveAttribute('href', '/gallery');
    expect(screen.queryByRole('link', { name: /विकास कार्य देखें/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /जानकारी/ })).not.toBeInTheDocument();
  });
});
