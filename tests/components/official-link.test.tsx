// Official links: shown only when a verified link exists; nothing at all otherwise.
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import OfficialLink from '@/components/schemes/OfficialLink';
import SchemeCard from '@/components/schemes/SchemeCard';
import { getSchemeById } from '@/lib/data';

const JJM = 'https://jaljeevanmission.gov.in/';

beforeEach(() => localStorage.clear());

describe('OfficialLink with a verified link', () => {
  it('opens the official site in a new tab, safely', () => {
    render(<OfficialLink href={JJM} />);
    const link = screen.getByRole('link', { name: /आधिकारिक वेबसाइट/ });
    expect(link).toHaveAttribute('href', JJM);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link.getAttribute('rel')).toContain('noopener');
    expect(link.getAttribute('rel')).toContain('noreferrer');
    // screen readers are told it opens a new tab; the site is named
    expect(link).toHaveAccessibleName(/नए टैब में खुलता है/);
    expect(link).toHaveTextContent('jaljeevanmission.gov.in');
  });
});

describe('OfficialLink without a link', () => {
  it('renders nothing — no badge, no popup button, no empty link', () => {
    const { container } = render(<OfficialLink href={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('SchemeCard', () => {
  it('links to the official site in a new tab when the scheme has one', async () => {
    const scheme = (await getSchemeById('tap-connection'))!;
    render(<SchemeCard scheme={scheme} />);
    const link = screen.getByRole('link', { name: /आधिकारिक वेबसाइट/ });
    expect(link).toHaveAttribute('href', JJM);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('shows no official-link line and no Coming Soon when the scheme has no link', async () => {
    const scheme = (await getSchemeById('birth-death'))!;
    render(<SchemeCard scheme={scheme} />);
    expect(screen.queryByText(/आधिकारिक वेबसाइट/)).not.toBeInTheDocument();
    expect(screen.queryByText('जल्द आ रहा है')).not.toBeInTheDocument();
  });
});
