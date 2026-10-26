import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import Footer from '@/components/layout/Footer';
import LanguageToggle from '@/components/layout/LanguageToggle';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';

beforeEach(() => localStorage.clear());

describe('Footer office details', () => {
  it('shows the real address and hours, no [placeholder] lines, in both languages', async () => {
    render(
      <LanguageProvider>
        <LanguageToggle />
        <Footer />
      </LanguageProvider>,
    );
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveTextContent('ग्राम पंचायत भवन, आपलियास, तहसील हुरड़ा, जिला भीलवाड़ा, राजस्थान');
    expect(footer).toHaveTextContent('सोमवार–शुक्रवार, सुबह 9:30 से शाम 6:00');
    expect(footer.textContent).not.toMatch(/\[[^\]]*\]/);

    await userEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
    expect(footer).toHaveTextContent('Gram Panchayat Bhawan, Appliyas, Tehsil Hurda, District Bhilwara, Rajasthan');
    expect(footer).toHaveTextContent('Monday–Friday, 9:30 am to 6:00 pm');
    expect(footer.textContent).not.toMatch(/\[[^\]]*\]/);
  });

  it('puts the disclaimer on the right of the bottom bar, after the copyright', () => {
    render(
      <LanguageProvider>
        <Footer />
      </LanguageProvider>,
    );
    const disclaimer = screen.getByText('अस्वीकरण:').closest('p')!;
    expect(disclaimer.className).toMatch(/xl:text-right/);
    const bar = disclaimer.parentElement!;
    expect(bar.className).toMatch(/xl:flex-row/);
    expect(bar.lastElementChild).toBe(disclaimer);
  });
});
