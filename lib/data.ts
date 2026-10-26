// The ONLY module that reads data. Today it reads local JSON; to go live, replace each
// function body with a fetch() to the Node.js/Express API (e.g. `${API_URL}/works`).
// Pages and components only depend on these async signatures, so they need no changes.
import worksJson from '@/data/works.json';
import mgnregaWorksJson from '@/data/mgnrega-works.json';
import mgnregaWagesJson from '@/data/mgnrega-wages.json';
import budgetJson from '@/data/budget.json';
import gramSabhaJson from '@/data/gram-sabha.json';
import schemesJson from '@/data/schemes.json';
import noticesJson from '@/data/notices.json';
import statsJson from '@/data/stats.json';
import panchayatJson from '@/data/panchayat.json';
import digitalServicesJson from '@/data/digital-services.json';
import serviceGuidesJson from '@/data/service-guides.json';
import membersJson from '@/data/members.json';
import galleryJson from '@/data/gallery.json';
import sarpanchJson from '@/data/sarpanch.json';
import campaignJson from '@/data/campaign.json';
import type {
  Campaign,
  BudgetData,
  DigitalService,
  GalleryPhoto,
  Member,
  SarpanchProfile,
  ServiceGuide,
  ServiceGuideId,
  GramSabhaMeeting,
  MgnregaReport,
  MgnregaWork,
  Notice,
  PanchayatInfo,
  PanchayatStats,
  Scheme,
  SearchItem,
  WagePayment,
  Work,
} from './types';

const works = worksJson as Work[];
const notices = noticesJson as Notice[];
const schemes = schemesJson as Scheme[];
const meetings = gramSabhaJson as GramSabhaMeeting[];

export async function getWorks(): Promise<Work[]> {
  return [...works].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getWorkById(id: string): Promise<Work | null> {
  return works.find((w) => w.id === id) ?? null;
}

export async function getMgnregaWorks(): Promise<MgnregaWork[]> {
  return mgnregaWorksJson.works as MgnregaWork[];
}

export async function getMgnregaReports(): Promise<MgnregaReport[]> {
  return mgnregaWorksJson.reports as MgnregaReport[];
}

export async function getWagePayments(): Promise<WagePayment[]> {
  return mgnregaWagesJson as WagePayment[];
}

export async function getBudget(): Promise<BudgetData> {
  return budgetJson as BudgetData;
}

export async function getGramSabhaMeetings(): Promise<GramSabhaMeeting[]> {
  return [...meetings].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getUpcomingMeeting(): Promise<GramSabhaMeeting | null> {
  const upcoming = meetings.filter((m) => m.upcoming).sort((a, b) => a.date.localeCompare(b.date));
  return upcoming[0] ?? null;
}

export async function getSchemes(): Promise<Scheme[]> {
  return schemes;
}

export async function getSchemeById(id: string): Promise<Scheme | null> {
  return schemes.find((s) => s.id === id) ?? null;
}

export async function getNotices(): Promise<Notice[]> {
  return [...notices].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getStats(): Promise<PanchayatStats> {
  return statsJson as PanchayatStats;
}

export async function getPanchayatInfo(): Promise<PanchayatInfo> {
  return panchayatJson as PanchayatInfo;
}

/** Official government portals shown under डिजिटल सेवाएँ. */
export async function getDigitalServices(): Promise<DigitalService[]> {
  return digitalServicesJson as DigitalService[];
}

/** Guidance for डिजिटल सिग्नेचर (NOC / राशन कार्ड / लाइट फाइल) and आवासीय मकान पट्टा. */
export async function getServiceGuide(id: ServiceGuideId): Promise<ServiceGuide> {
  return (serviceGuidesJson as Record<ServiceGuideId, ServiceGuide>)[id];
}

/** पंचायत सदस्य, in display order (officials first, then ward panch 1–9). */
export async function getMembers(): Promise<Member[]> {
  return membersJson as Member[];
}

/** Profile of the Sarpanch shown on the home page card and /sarpanch. */
/** Campaign switch and details; set "enabled": false in data/campaign.json to hide it everywhere. */
export async function getCampaign(): Promise<Campaign> {
  return campaignJson as Campaign;
}

export async function getSarpanch(): Promise<SarpanchProfile> {
  return sarpanchJson as SarpanchProfile;
}

/** Village photos for the गैलरी page. */
export async function getGallery(): Promise<GalleryPhoto[]> {
  return galleryJson as GalleryPhoto[];
}

/** Small index for the header search box (works, notices, schemes). Subtitles are built in the UI language. */
export async function getSearchIndex(): Promise<SearchItem[]> {
  return [
    ...works.map((w) => ({
      type: 'work' as const,
      id: w.id,
      title: w.name,
      titleEn: w.en?.name,
      category: w.category,
      ward: w.ward,
      href: `/works/${w.id}`,
    })),
    ...notices.map((n) => ({
      type: 'notice' as const,
      id: n.id,
      title: n.title,
      titleEn: n.en?.title,
      category: n.category,
      href: `/notices#${n.id}`,
    })),
    ...schemes.map((s) => ({
      type: 'scheme' as const,
      id: s.id,
      title: s.name,
      titleEn: s.en?.name,
      category: s.category,
      href: `/schemes/${s.id}`,
    })),
  ];
}
