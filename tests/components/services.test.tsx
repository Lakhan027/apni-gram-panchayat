// डिजिटल सिग्नेचर, डिजिटल सेवाएँ and आवासीय मकान पट्टा show guidance only — no forms.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import SignatureOptions from '@/components/services/SignatureOptions';
import ServiceGuide from '@/components/services/ServiceGuide';
import DigitalServicesList from '@/components/services/DigitalServicesList';
import DigitalServicesGuide from '@/components/services/DigitalServicesGuide';
import LanguageToggle from '@/components/layout/LanguageToggle';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';
import { getDigitalServices, getServiceGuide } from '@/lib/data';

beforeEach(() => localStorage.clear());

describe('SignatureOptions', () => {
  it('shows the three sub-options as separate links', () => {
    render(<SignatureOptions />);
    expect(screen.getByRole('link', { name: /NOC के लिए/ })).toHaveAttribute('href', '/services/digital-signature/noc');
    expect(screen.getByRole('link', { name: /राशन कार्ड के लिए/ })).toHaveAttribute('href', '/services/digital-signature/ration-card');
    expect(screen.getByRole('link', { name: /लाइट फाइल के लिए/ })).toHaveAttribute('href', '/services/digital-signature/light-file');
  });
});

describe('ServiceGuide', () => {
  it.each(['noc', 'ration-card', 'light-file', 'house-patta'] as const)('%s shows what it is, documents and steps — and no form', async (id) => {
    const guide = await getServiceGuide(id);
    render(<ServiceGuide guide={guide} />);
    expect(screen.getByRole('heading', { name: 'यह क्या है' })).toBeInTheDocument();
    const docs = screen.getByRole('region', { name: 'ज़रूरी दस्तावेज़' });
    expect(within(docs).getAllByRole('listitem')).toHaveLength(guide.documents.length);
    const steps = screen.getByRole('region', { name: 'आवेदन कैसे करें' });
    expect(within(steps).getAllByRole('listitem')).toHaveLength(guide.steps.length);
    expect(screen.getByRole('region', { name: 'कहाँ जाएँ' })).toBeInTheDocument();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /जमा करें/ })).not.toBeInTheDocument();
  });

  it('switches to English', async () => {
    const guide = await getServiceGuide('house-patta');
    render(
      <LanguageProvider>
        <LanguageToggle />
        <ServiceGuide guide={guide} />
      </LanguageProvider>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Switch to English' }));
    expect(screen.getByRole('heading', { name: 'What is it' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Documents needed' })).toHaveTextContent(guide.documentsEn[0]);
  });
});

describe('DigitalServicesList', () => {
  it('lists all 7 official sites, each opening in a new tab', async () => {
    const services = await getDigitalServices();
    render(<DigitalServicesList services={services} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(7);
    expect(links.map((l) => l.getAttribute('href'))).toEqual([
      'https://rajkisan.rajasthan.gov.in/',
      'https://apnakhata.rajasthan.gov.in/',
      'https://vbgramg.dord.gov.in/vbgramg/home.aspx',
      'https://uidai.gov.in/en',
      'https://bhunaksha.rajasthan.gov.in/',
      'https://voters.eci.gov.in/',
      'https://xn--m1bet4hqd2b.xn--11b7cb3a6a.xn--h2brj9c/project/pehchan/',
    ]);
    for (const l of links) {
      expect(l).toHaveAttribute('target', '_blank');
      expect(l.getAttribute('rel')).toContain('noopener');
      expect(l).toHaveAccessibleName(/नए टैब में खुलता है/);
    }
  });
});

describe('DigitalServicesGuide', () => {
  it('explains how to use the portals and warns about sharing OTP', () => {
    render(<DigitalServicesGuide />);
    expect(screen.getByRole('heading', { name: 'इन वेबसाइटों का उपयोग कैसे करें' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText(/OTP .*किसी को न बताएँ/)).toBeInTheDocument();
  });
});
