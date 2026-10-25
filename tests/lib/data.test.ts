import { describe, expect, it } from 'vitest';
import {
  getBudget,
  getGramSabhaMeetings,
  getNotices,
  getSchemeById,
  getSchemes,
  getSearchIndex,
  getUpcomingMeeting,
  getWorkById,
  getWorks,
} from '@/lib/data';
import { isActiveLink, NAV_LINKS } from '@/lib/constants';

describe('data layer', () => {
  it('returns works newest first', async () => {
    const works = await getWorks();
    const dates = works.map((w) => w.createdAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('does not let callers mutate the stored order', async () => {
    const a = await getWorks();
    a.reverse();
    const b = await getWorks();
    expect(b[0].createdAt >= b[b.length - 1].createdAt).toBe(true);
  });

  it('finds a work by id and returns null for unknown ids', async () => {
    expect((await getWorkById('W-001'))?.name).toBeTruthy();
    expect(await getWorkById('NOPE')).toBeNull();
  });

  it('returns notices newest first', async () => {
    const dates = (await getNotices()).map((n) => n.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('finds schemes by id', async () => {
    expect((await getSchemeById('birth-death'))?.name).toContain('जन्म');
    expect(await getSchemeById('x')).toBeNull();
    expect((await getSchemes()).length).toBeGreaterThan(0);
  });

  it('includes the Chambal drinking water scheme in both languages, details marked unverified', async () => {
    const s = await getSchemeById('chambal-pejal');
    expect(s?.name).toContain('चंबल');
    expect(s?.en?.name).toContain('Chambal');
    expect(s?.category).toBe('sanitation');
    expect(s?.verified).toBe(false);
    expect(s?.officialLink).toContain('phedwater.rajasthan.gov.in');
    expect(s?.en?.documents).toHaveLength(s!.documents.length);
    expect(s?.en?.steps).toHaveLength(s!.steps.length);
  });

  it('maps each scheme to its official government site (or none yet)', async () => {
    const pension = 'https://jansoochna.rajasthan.gov.in/Services/Index?schemeId=22';
    const expected: Record<string, string | null> = {
      'chambal-pejal':
        'https://phedwater.rajasthan.gov.in/content/raj/water/public-health-engineering-department/en/major-projects/project-10.html',
      'tap-connection': 'https://jaljeevanmission.gov.in/',
      'household-toilet': 'https://swachhbharatmission.ddws.gov.in/',
      'old-age-pension': pension,
      'widow-pension': pension,
      'disability-pension': pension,
      'mgnrega-job-card': 'https://nrega.dord.gov.in/Nregahome/MGNREGA_new/Nrega_home.aspx',
      'birth-death': null,
      'property-records': null,
    };
    for (const [id, link] of Object.entries(expected)) {
      expect((await getSchemeById(id))?.officialLink, id).toBe(link);
    }
  });

  it('returns the earliest upcoming Gram Sabha', async () => {
    const meetings = await getGramSabhaMeetings();
    const upcoming = meetings.filter((m) => m.upcoming).map((m) => m.date).sort();
    expect((await getUpcomingMeeting())?.date).toBe(upcoming[0]);
  });

  it('builds a search index with working links for every type', async () => {
    const index = await getSearchIndex();
    const works = await getWorks();
    expect(index.filter((i) => i.type === 'work')).toHaveLength(works.length);
    expect(index.find((i) => i.id === 'W-001')?.href).toBe('/works/W-001');
    expect(index.find((i) => i.type === 'notice')?.href).toMatch(/^\/notices#N-/);
    expect(index.find((i) => i.type === 'scheme')?.href).toMatch(/^\/schemes\//);
  });

  it('exposes budget years, lines and payments', async () => {
    const b = await getBudget();
    expect(b.financialYears).toContain('2026-27');
    expect(b.lines.length).toBeGreaterThan(0);
    expect(b.payments.length).toBeGreaterThan(0);
  });
});

describe('isActiveLink', () => {
  it('matches home only on /', () => {
    expect(isActiveLink('/', '/')).toBe(true);
    expect(isActiveLink('/works', '/')).toBe(false);
  });
  it('matches sections, sub-pages and trailing slashes', () => {
    expect(isActiveLink('/works/', '/works')).toBe(true);
    expect(isActiveLink('/works/W-001/', '/works')).toBe(true);
    expect(isActiveLink('/workshop', '/works')).toBe(false);
  });
  it('has the 10 menu items', () => {
    expect(NAV_LINKS).toHaveLength(10);
  });
});
