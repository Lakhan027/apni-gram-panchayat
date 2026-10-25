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
import BudgetPage from '@/app/budget/page';
import GramSabhaPage from '@/app/gram-sabha/page';
import SchemesPage from '@/app/schemes/page';
import SchemeDetailPage, { generateStaticParams as schemeParams } from '@/app/schemes/[id]/page';
import NoticesPage from '@/app/notices/page';
import ComplaintsPage from '@/app/complaints/page';
import ContactPage from '@/app/contact/page';
import AdminPage from '@/app/admin/page';
import NotFound from '@/app/not-found';
import { getBudget, getGramSabhaMeetings, getMgnregaWorks, getSchemes, getWagePayments, getWorks } from '@/lib/data';
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
    const sabha = screen.getByRole('region', { name: 'आगामी ग्राम सभा' });
    expect(within(sabha).getByText('15 नवम्बर 2026')).toBeInTheDocument();
    expect(within(sabha).getAllByRole('listitem')).toHaveLength(3);
  });

  it('has the 6 citizen services', async () => {
    await show(HomePage());
    const services = screen.getByRole('region', { name: 'नागरिक सेवाएँ' });
    expect(within(services).getAllByRole('link')).toHaveLength(6);
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
    const link = screen.getByRole('link', { name: /मनरेगा आधिकारिक पोर्टल/ });
    expect(link).toHaveAttribute('href', 'https://nrega.dord.gov.in/Nregahome/MGNREGA_new/Nrega_home.aspx');
    expect(link).toHaveAttribute('target', '_blank');
  });
});

describe('MGNREGA', () => {
  it('lists every work and wage row, with references only for verified wages', async () => {
    const [works, wages] = await Promise.all([getMgnregaWorks(), getWagePayments()]);
    await show(MgnregaPage());
    const register = screen.getByRole('table', { name: 'मनरेगा कार्य रजिस्टर' });
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
  it('about lists all wards and placeholder representatives', async () => {
    await show(AboutPage());
    expect(screen.getByRole('region', { name: 'वार्ड सूची' }).querySelectorAll('li')).toHaveLength(9);
    expect(screen.getByText('[सरपंच का नाम — सत्यापन हेतु]')).toBeInTheDocument();
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
