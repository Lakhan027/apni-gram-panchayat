import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { CampaignBar, CampaignFab, CampaignFooter } from '@/components/campaign/Campaign';
import LanguageToggle from '@/components/layout/LanguageToggle';
import { getCampaign } from '@/lib/data';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';
import type { Campaign } from '@/lib/types';

beforeEach(() => localStorage.clear());

function renderAll(c: Campaign) {
  return render(
    <LanguageProvider>
      <LanguageToggle />
      <CampaignBar campaign={c} />
      <CampaignFooter campaign={c} />
      <CampaignFab campaign={c} />
    </LanguageProvider>,
  );
}

describe('Campaign switch', () => {
  it('data has a boolean enabled flag and the candidate details', async () => {
    const c = await getCampaign();
    expect(typeof c.enabled).toBe('boolean');
    expect(c.name).toBe('मांगी लाल बुनकर');
    expect(c.nameEn).toBe('Mangi Lal Bunkar');
    expect(c.photo).toMatch(/^\/images\//);
  });

  it('shows the strip, footer card and mobile button when enabled', async () => {
    const c = { ...(await getCampaign()), enabled: true };
    renderAll(c);
    const strip = screen.getByRole('region', { name: 'चुनाव अभियान' });
    expect(strip).toHaveTextContent('मांगी लाल बुनकर');
    expect(screen.getByRole('link', { name: /विकास के संकल्प देखें/ })).toHaveAttribute('href', expect.stringMatching(/^\/sarpanch\/?#sp-goals$/));
    expect(screen.getAllByRole('link', { name: /संकल्प पत्र/ }).some((a) => /^\/sarpanch\/?#sp-poster$/.test(a.getAttribute('href') ?? ''))).toBe(true);
    const share = screen.getByRole('link', { name: /WhatsApp/ });
    expect(share.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/\?text=/);
    expect(decodeURIComponent(share.getAttribute('href')!)).toContain('https://apni-gram-panchayat.vercel.app/sarpanch/');
    expect(share).toHaveAttribute('target', '_blank');
    expect(screen.getByText(/जन-जागरूकता अभियान वेबसाइट/)).toBeInTheDocument();
  });

  it('switches to English with the English name', async () => {
    renderAll({ ...(await getCampaign()), enabled: true });
    await userEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
    expect(screen.getByRole('region', { name: 'Election campaign' })).toHaveTextContent('Mangi Lal Bunkar');
    expect(screen.getByRole('link', { name: /See the development resolves/ })).toBeInTheDocument();
  });

  it('shows nothing when disabled', async () => {
    renderAll({ ...(await getCampaign()), enabled: false });
    expect(screen.queryByRole('region', { name: 'चुनाव अभियान' })).toBeNull();
    expect(screen.queryByRole('link', { name: /संकल्प पत्र/ })).toBeNull();
    expect(screen.queryByRole('link', { name: /WhatsApp/ })).toBeNull();
  });
});
