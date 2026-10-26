// Integration: render whole pages (server component + data layer + client components) with the real JSON.
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import HomePage from '@/app/page';
import AboutPage from '@/app/about/page';
import WorksPage from '@/app/works/page';
import WorkDetailPage, { generateStaticParams as workParams, generateMetadata as workMeta } from '@/app/works/[id]/page';
import MgnregaPage from '@/app/mgnrega/page';
import ApplyWorkPage from '@/app/mgnrega/apply-work/page';
import NewJobCardPage from '@/app/mgnrega/new-job-card/page';
import MistolPage from '@/app/mgnrega/mistol/page';
import SignaturePage from '@/app/services/digital-signature/page';
import NocPage from '@/app/services/digital-signature/noc/page';
import RationPage from '@/app/services/digital-signature/ration-card/page';
import LightPage from '@/app/services/digital-signature/light-file/page';
import DigitalServicesPage from '@/app/services/digital-services/page';
import PattaPage from '@/app/services/house-patta/page';
import MembersPage from '@/app/members/page';
import GalleryPage from '@/app/gallery/page';
import SarpanchPage from '@/app/sarpanch/page';
import BudgetPage from '@/app/budget/page';
import GramSabhaPage from '@/app/gram-sabha/page';
import SchemesPage from '@/app/schemes/page';
import SchemeDetailPage, { generateStaticParams as schemeParams } from '@/app/schemes/[id]/page';
import NoticesPage from '@/app/notices/page';
import ComplaintsPage from '@/app/complaints/page';
import ContactPage from '@/app/contact/page';
import AdminPage from '@/app/admin/page';
import NotFound from '@/app/not-found';
import { getGallery, getMembers, getBudget, getGramSabhaMeetings, getMgnregaWorks, getSchemes, getWagePayments, getWorks } from '@/lib/data';
import { budgetTotals, formatINRShort, workTotals } from '@/lib/format';
import { allRoutes, resolves } from './routes';

const show = async (page: Promise<ReactElement> | ReactElement) => render(await page);
const h1 = () => screen.getByRole('heading', { level: 1 });

describe('every page', () => {
  const pages: [string, () => Promise<ReactElement> | ReactElement][] = [
    ['/', HomePage],
    ['/about', AboutPage],
    ['/works', WorksPage],
    ['/mgnrega', MgnregaPage],
    ['/budget', BudgetPage],
    ['/gram-sabha', GramSabhaPage],
    ['/schemes', SchemesPage],
    ['/notices', NoticesPage],
    ['/complaints', ComplaintsPage],
    ['/contact', ContactPage],
    ['/admin', AdminPage],
  ];

  it.each(pages)('%s renders exactly one h1 and only links to real routes', async (_path, Page) => {
    const routes = await allRoutes();
    await show(Page());
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const internal = screen
      .queryAllByRole('link')
      .map((a) => a.getAttribute('href')!)
      .filter((h) => h.startsWith('/'));
    for (const href of internal) expect(resolves(href, routes), `broken link ${href}`).toBe(true);
  });
});

describe('Home', () => {
  it('shows stats computed from the same rows as the works and budget pages', async () => {
    const [works, budget] = await Promise.all([getWorks(), getBudget()]);
    const fy = (r: { financialYear: string }) => r.financialYear === '2026-27';
    const bt = budgetTotals(budget.lines.filter(fy), budget.payments.filter(fy));
    await show(HomePage());
    const glance = screen.getByRole('region', { name: 'पंचायत एक नज़र में' });
    expect(within(glance).getByText(String(workTotals(works).inProgress))).toBeInTheDocument();
    expect(within(glance).getByText(formatINRShort(bt.approved))).toBeInTheDocument();
    expect(within(glance).getByText(formatINRShort(bt.recorded))).toBeInTheDocument();
  });

  it('shows the 3 latest works, 4 latest notices and the next Gram Sabha', async () => {
    await show(HomePage());
    const works = screen.getByRole('region', { name: 'हाल के विकास कार्य' });
    expect(within(works).getAllByRole('article')).toHaveLength(3);
    const notices = screen.getByRole('region', { name: 'ताज़ा सूचनाएँ' });
    expect(within(notices).getAllByRole('article')).toHaveLength(4);
    const sabha = screen.getByRole('region', { name: 'आगामी पंचायत बैठक (कोरम)' });
    expect(within(sabha).getByText('15 नवम्बर 2026')).toBeInTheDocument();
    expect(within(sabha).getAllByRole('listitem')).toHaveLength(3);
  });

  it('has the 9 citizen services (3 new + 6 existing)', async () => {
    await show(HomePage());
    const services = screen.getByRole('region', { name: 'नागरिक सेवाएँ' });
    expect(within(services).getAllByRole('link')).toHaveLength(9);
  });
});

describe('Works list → detail', () => {
  it('summary bar matches the data and filters work on the real list', async () => {
    const works = await getWorks();
    const t = workTotals(works);
    await show(WorksPage());
    const summary = screen.getByLabelText('विकास कार्य सारांश');
    expect(within(summary).getByText(String(t.total))).toBeInTheDocument();
    expect(screen.getByText(`${works.length} कार्य मिले`)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'पूर्ण' }));
    expect(screen.getByText(`${t.completed} कार्य मिले`)).toBeInTheDocument();
  });

  it('pre-renders a detail page for every work', async () => {
    const works = await getWorks();
    expect((await workParams()).map((p) => p.id).sort()).toEqual(works.map((w) => w.id).sort());
    for (const w of works) {
      const { unmount } = await show(WorkDetailPage({ params: { id: w.id } }));
      expect(h1()).toHaveTextContent(w.name);
      expect(screen.getByRole('link', { name: /वापस सभी कार्यों पर/ })).toHaveAttribute('href', '/works');
      unmount();
    }
  });

  it('detail pages keep the default dynamicParams (false breaks `next dev` with output: export in Next 14.2)', async () => {
    for (const mod of [await import('@/app/works/[id]/page'), await import('@/app/schemes/[id]/page')]) {
      expect('dynamicParams' in mod ? (mod as { dynamicParams?: boolean }).dynamicParams : undefined).not.toBe(false);
    }
  });

  it('sends unknown work IDs to the 404 page', async () => {
    await expect(WorkDetailPage({ params: { id: 'W-999' } })).rejects.toThrow('NEXT_NOT_FOUND');
    expect((await workMeta({ params: { id: 'W-999' } })).title).toBe('कार्य नहीं मिला');
  });
});

describe('Schemes list → detail', () => {
  it('pre-renders every scheme with no placeholder or Coming Soon lines', async () => {
    const schemes = await getSchemes();
    expect((await schemeParams()).length).toBe(schemes.length);
    for (const s of schemes) {
      const { unmount, container } = await show(SchemeDetailPage({ params: { id: s.id } }));
      expect(h1()).toHaveTextContent(s.name);
      expect(container.textContent, s.id).not.toMatch(/सत्यापन हेतु|जल्द आ रहा है|\[कार्यालय समय\]/);
      if (!s.eligibility) expect(screen.queryByText('पात्रता:')).not.toBeInTheDocument();
      if (!s.officialLink) expect(screen.queryByText(/आधिकारिक लिंक|आधिकारिक वेबसाइट/)).not.toBeInTheDocument();
      unmount();
    }
  });
});

describe('official links', () => {
  it('scheme pages link out in a new tab, and show nothing when there is no link', async () => {
    const { unmount } = await show(SchemeDetailPage({ params: { id: 'chambal-pejal' } }));
    const link = screen.getByRole('link', { name: /आधिकारिक वेबसाइट/ });
    expect(new URL(link.getAttribute('href')!).hostname).toBe('phedwater.rajasthan.gov.in');
    expect(link).toHaveAttribute('target', '_blank');
    unmount();
    await show(SchemeDetailPage({ params: { id: 'property-records' } }));
    expect(screen.queryByRole('link', { name: /आधिकारिक वेबसाइट/ })).not.toBeInTheDocument();
    expect(screen.queryByText('जल्द आ रहा है')).not.toBeInTheDocument();
  });

  it('the MGNREGA page links to the official NREGA portal in a new tab', async () => {
    await show(MgnregaPage());
    const link = screen.getByRole('link', { name: /वीबी—जी राम जी \(नरेगा\) आधिकारिक पोर्टल/ });
    expect(link).toHaveAttribute('href', 'https://nrega.dord.gov.in/Nregahome/MGNREGA_new/Nrega_home.aspx');
    expect(link).toHaveAttribute('target', '_blank');
  });
});

describe('Sarpanch profile', () => {
  it('home shows the Sarpanch card at the very top, before the hero', async () => {
    const { container } = await show(HomePage());
    const card = screen.getByRole('region', { name: 'हमारे सरपंच — मांगी लाल बुनकर' });
    expect(within(card).getByRole('link', { name: /पूरी प्रोफ़ाइल देखें/ })).toHaveAttribute('href', '/sarpanch');
    const sections = [...container.querySelectorAll('section')];
    expect(sections[0]).toBe(card);
  });

  it('/sarpanch shows the full profile', async () => {
    await show(SarpanchPage());
    expect(h1()).toHaveTextContent('हमारे सरपंच');
    expect(screen.getByText('Mangi Lal Bunkar')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'विकास के संकल्प (उद्देश्य)' })).toBeInTheDocument();
  });

  it('about shows the Sarpanch and all villages of the Panchayat', async () => {
    await show(AboutPage());
    expect(screen.getAllByText('मांगी लाल बुनकर').length).toBeGreaterThan(0);
    for (const v of ['आपलियास', 'चैनपुरिया', 'लक्ष्मणपुरा']) expect(screen.getAllByText(new RegExp(v)).length).toBeGreaterThan(0);
  });
});

describe('पंचायत सदस्य and गैलरी pages', () => {
  it('members page shows every member', async () => {
    const members = await getMembers();
    await show(MembersPage());
    expect(h1()).toHaveTextContent('पंचायत सदस्य');
    expect(screen.getAllByRole('article')).toHaveLength(members.length);
  });

  it('gallery page shows every photo', async () => {
    const photos = await getGallery();
    await show(GalleryPage());
    expect(h1()).toHaveTextContent('गैलरी');
    expect(screen.getAllByRole('figure')).toHaveLength(photos.length);
  });

  it('the old name ग्राम सभा is gone from the main pages', async () => {
    for (const Page of [HomePage, GramSabhaPage, NoticesPage]) {
      const { container, unmount } = await show(Page());
      expect(container.textContent).not.toMatch(/ग्राम सभा/);
      unmount();
    }
  });
});

describe('new citizen services', () => {
  it('home lists the three new services first, in order, then the existing six', async () => {
    await show(HomePage());
    const services = screen.getByRole('region', { name: 'नागरिक सेवाएँ' });
    const hrefs = within(services).getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual([
      '/services/digital-signature',
      '/services/digital-services',
      '/services/house-patta',
      '/schemes/birth-death',
      '/schemes/property-records',
      '/mgnrega',
      '/gram-sabha',
      '/complaints',
      '/schemes',
    ]);
  });

  it.each([
    ['digital-signature', SignaturePage, 'डिजिटल सिग्नेचर', '/#services'],
    ['digital-signature/noc', NocPage, 'NOC के लिए', '/services/digital-signature'],
    ['digital-signature/ration-card', RationPage, 'राशन कार्ड के लिए', '/services/digital-signature'],
    ['digital-signature/light-file', LightPage, 'लाइट फाइल के लिए', '/services/digital-signature'],
    ['digital-services', DigitalServicesPage, 'डिजिटल सेवाएँ', '/#services'],
    ['house-patta', PattaPage, 'आवासीय मकान पट्टा', '/#services'],
  ] as const)('/services/%s has its heading, a Back button and no form', async (_slug, Page, title, back) => {
    await show(Page());
    expect(h1()).toHaveTextContent(title);
    expect(screen.getAllByRole('link', { name: /वापस/ })[0]).toHaveAttribute('href', back);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /जमा करें/ })).not.toBeInTheDocument();
  });
});

describe('VB—G RAM G (NREGA) options', () => {
  it('the NREGA page offers the three options', async () => {
    await show(MgnregaPage());
    expect(h1()).toHaveTextContent('वीबी—जी राम जी (नरेगा)');
    for (const name of [/कार्य के लिए आवेदन/, /नया जॉब कार्ड बनाने हेतु/, /मिसटोल/]) expect(screen.getByRole('link', { name })).toBeInTheDocument();
  });

  it.each([
    ['apply-work', ApplyWorkPage, 'कार्य के लिए आवेदन'],
    ['new-job-card', NewJobCardPage, 'नया जॉब कार्ड बनाने हेतु'],
    ['mistol', MistolPage, 'मिसटोल'],
  ] as const)('/mgnrega/%s has its heading and a Back button', async (_slug, Page, title) => {
    await show(Page());
    expect(h1()).toHaveTextContent(title);
    expect(screen.getAllByRole('link', { name: /वापस/ })[0]).toHaveAttribute('href', '/mgnrega');
  });
});

describe('MGNREGA', () => {
  it('lists every work and wage row, with references only for verified wages', async () => {
    const [works, wages] = await Promise.all([getMgnregaWorks(), getWagePayments()]);
    await show(MgnregaPage());
    const register = screen.getByRole('table', { name: 'वीबी—जी राम जी (नरेगा) कार्य रजिस्टर' });
    expect(within(register).getAllByRole('row')).toHaveLength(works.length + 1);
    const wageTable = screen.getByRole('table', { name: 'मज़दूरी भुगतान स्थिति' });
    for (const w of wages) {
      const row = within(wageTable).getByText(w.musterRoll).closest('tr')!;
      if (w.status === 'verified') expect(row).toHaveTextContent(w.referenceNo!);
      else expect(row).not.toHaveTextContent('FTO-');
    }
    expect(screen.getByRole('note')).toHaveTextContent('आधार');
  });
});

describe('Budget', () => {
  it('page totals equal the Home page figures', async () => {
    await show(BudgetPage());
    const summary = screen.getByLabelText('बजट सारांश');
    expect(summary).toHaveTextContent('₹39,55,000');
    expect(summary).toHaveTextContent('₹17,07,000');
    expect(summary).toHaveTextContent('₹13,53,000');
  });
});

describe('Gram Sabha', () => {
  it('shows past meetings and only passed resolutions as action items', async () => {
    const meetings = await getGramSabhaMeetings();
    await show(GramSabhaPage());
    const past = meetings.filter((m) => !m.upcoming);
    expect(document.querySelectorAll('details')).toHaveLength(past.length);
    const passed = past.flatMap((m) => m.resolutions).filter((r) => r.decision === 'passed');
    const table = screen.getByRole('table', { name: 'प्रस्तावों पर कार्यवाही' });
    expect(within(table).getAllByRole('row')).toHaveLength(passed.length + 1);
  });
});

describe('About, complaints, admin, 404', () => {
  it('about lists all wards and the main members, with a link to all members', async () => {
    await show(AboutPage());
    expect(screen.getByRole('region', { name: 'वार्ड सूची' }).querySelectorAll('li')).toHaveLength(9);
    const reps = screen.getByRole('region', { name: 'जनप्रतिनिधि व अधिकारी' });
    expect(within(reps).getAllByRole('article')).toHaveLength(7);
    expect(within(reps).getByRole('link', { name: /सभी पंचायत सदस्य देखें/ })).toHaveAttribute('href', '/members');
  });

  it('complaints page wires the form and the process panel together', async () => {
    await show(ComplaintsPage());
    expect(screen.getByRole('form', { name: 'शिकायत / सुझाव फ़ॉर्म' })).toBeInTheDocument();
    expect(screen.getByText('पोर्टल चालू होने पर शिकायत कैसे निपटेगी')).toBeInTheDocument();
  });

  it('admin has no login form', async () => {
    await show(AdminPage());
    expect(h1()).toHaveTextContent('जल्द आ रहा है');
    expect(document.querySelector('input, form')).toBeNull();
  });

  it('404 page is in Hindi and links home', async () => {
    await show(NotFound());
    expect(h1()).toHaveTextContent('पृष्ठ नहीं मिला');
    expect(screen.getByRole('link', { name: 'मुख्य पृष्ठ पर जाएँ' })).toHaveAttribute('href', '/');
  });
});
