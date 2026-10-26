// All data models for the portal.

export type WorkStatus = 'proposed' | 'approved' | 'in-progress' | 'completed' | 'on-hold';

export type WorkCategory =
  | 'road'
  | 'drain'
  | 'water'
  | 'pond'
  | 'streetlight'
  | 'sanitation'
  | 'building';

export interface WorkUpdate {
  date: string;
  text: string;
}

export interface WorkDocument {
  name: string;
  type: string;
}

export interface Work {
  id: string;
  name: string;
  description: string;
  category: WorkCategory;
  ward: number;
  status: WorkStatus;
  scheme: string;
  approvalRef: string | null;
  approvedBudget: number | null;
  recordedExpenditure: number | null;
  startDate: string | null;
  expectedCompletion: string | null;
  progress: number;
  createdAt: string;
  photos: { before: string[]; progress: string[]; completed: string[] };
  updates: WorkUpdate[];
  documents: WorkDocument[];
  en?: { name?: string; description?: string; scheme?: string; updates?: string[]; documents?: string[] };
}

export interface MgnregaWork {
  id: string;
  officialRef: string;
  name: string;
  location: string;
  approvedAmount: number;
  recordedExpenditure: number;
  status: WorkStatus;
  progress: number;
  en?: { name?: string; location?: string };
}

export type WageStatus = 'processing' | 'verification-pending' | 'verified';

export interface WagePayment {
  musterRoll: string;
  workId: string;
  periodFrom: string;
  periodTo: string;
  personDays: number;
  status: WageStatus;
  referenceNo: string | null;
}

export interface MgnregaReport {
  title: string;
  period: string;
  type: string;
  en?: { title?: string; period?: string };
}

export interface BudgetLine {
  id: string;
  financialYear: string;
  scheme: string;
  workId: string;
  workName: string;
  category: WorkCategory;
  approved: number;
  en?: { scheme?: string; workName?: string };
}

export type PaymentStatus = 'recorded' | 'verified' | 'pending';

export interface PaymentRecord {
  id: string;
  financialYear: string;
  date: string;
  workId: string;
  workName: string;
  category: WorkCategory;
  voucherRef: string | null;
  amount: number;
  status: PaymentStatus;
  en?: { workName?: string };
}

export interface BudgetData {
  financialYears: string[];
  lines: BudgetLine[];
  payments: PaymentRecord[];
}

export type ResolutionDecision = 'passed' | 'deferred' | 'rejected';

export interface Resolution {
  number: string;
  title: string;
  decision: ResolutionDecision;
  responsibleBody: string;
  actionStatus: WorkStatus;
  lastUpdate: string;
  en?: { title?: string; responsibleBody?: string };
}

export interface GramSabhaMeeting {
  id: string;
  date: string;
  time: string;
  venue: string;
  upcoming: boolean;
  agenda: string[];
  attendance: { total: number; women: number; quorumMet: boolean } | null;
  resolutions: Resolution[];
  en?: { time?: string; venue?: string; agenda?: string[] };
}

export type SchemeCategory = 'certificate' | 'records' | 'employment' | 'welfare' | 'sanitation';

export interface Scheme {
  id: string;
  name: string;
  category: SchemeCategory;
  purpose: string;
  verified: boolean;
  contact: string;
  documents: string[];
  steps: string[];
  eligibility: string | null;
  officialLink: string | null;
  en?: { name?: string; purpose?: string; contact?: string; documents?: string[]; steps?: string[] };
}

export type NoticeCategory = 'gram-sabha' | 'works' | 'health' | 'scheme' | 'deadline';

export interface Notice {
  id: string;
  date: string;
  category: NoticeCategory;
  title: string;
  summary: string;
  important: boolean;
  attachment: string | null;
  en?: { title?: string; summary?: string; attachment?: string };
}

export interface PanchayatStats {
  population: number;
  households: number;
  jobCards: number;
  mgnrega: {
    personDaysThisYear: number;
    activeJobCards: number;
  };
}

export interface PanchayatInfo {
  name: string;
  nameHi: string;
  tehsil: string;
  district: string;
  state: string;
  intro: string;
  wards: { number: number; area?: string }[];
  villages: string[];
  functions: { title: string; text: string }[];
  office: { address: string; phone: string; email: string; hours: string };
  en?: {
    name?: string;
    intro?: string;
    wardArea?: string;
    villages?: string[];
    functions?: { title: string; text: string }[];
  };
}

export interface DigitalService {
  id: string;
  name: string;
  nameEn: string;
  about: string;
  aboutEn: string;
  url: string;
  /** Icon key, mapped to a Lucide icon in the UI. */
  icon: string;
}

/** Step-by-step guidance for a citizen service (shown instead of a form). */
export interface ServiceGuide {
  about: string;
  aboutEn: string;
  documents: string[];
  documentsEn: string[];
  steps: string[];
  stepsEn: string[];
  where: string[];
  whereEn: string[];
}

export type ServiceGuideId = 'noc' | 'ration-card' | 'light-file' | 'house-patta';

export type MemberRole =
  | 'sarpanch'
  | 'up-sarpanch'
  | 'vdo'
  | 'assistant-secretary'
  | 'patwari'
  | 'krishi-paryavekshak'
  | 'sahakari-samiti'
  | 'ward-panch';

/** A Gram Panchayat member. Replace the sample name, mobile and photo with real details later. */
export interface Member {
  id: string;
  role: MemberRole;
  /** Ward number for ward panch, otherwise null. */
  ward: number | null;
  name: string;
  nameEn: string;
  /** Shown as written; masked numbers (with X) are not turned into call links. */
  mobile: string;
  /** Path under public/, e.g. /images/members/sarpanch.jpg — null shows a placeholder avatar. */
  photo: string | null;
}

export interface SarpanchGoal {
  /** Number as on the Sarpanch's template (1–21). */
  n: number;
  title?: string;
  titleEn?: string;
  text: string;
  textEn: string;
}

export interface SarpanchProfile {
  name: string;
  nameEn: string;
  photo: string;
  /** The Sarpanch's संकल्प पत्र (poster image), shown on /sarpanch. */
  poster: string;
  place: {
    village: string;
    villageEn: string;
    tehsil: string;
    tehsilEn: string;
    district: string;
    districtEn: string;
    state: string;
    stateEn: string;
  };
  motto: string;
  mottoEn: string;
  promise: string;
  promiseEn: string;
  intro: string;
  introEn: string;
  responsibilities: string[];
  responsibilitiesEn: string[];
  /** Short tags shown on the home page card. */
  highlights: { text: string; textEn: string }[];
  goalGroups: { id: string; title: string; titleEn: string; icon: string; goals: SarpanchGoal[] }[];
  /** Completed / ongoing works — add only verified items; the section stays hidden while empty. */
  works: { title: string; titleEn: string; status: 'completed' | 'in-progress' }[];
}

export interface GalleryPhoto {
  id: string;
  src: string;
  caption: string;
  captionEn: string;
}

export interface SearchItem {
  type: 'work' | 'notice' | 'scheme';
  id: string;
  title: string;
  titleEn?: string;
  /** Category key: WorkCategory, NoticeCategory or SchemeCategory depending on type. */
  category: string;
  ward?: number;
  href: string;
}

/** Election campaign shown on every page while `enabled` is true (data/campaign.json). */
export interface Campaign {
  enabled: boolean;
  /** Live link sent in the WhatsApp share message. */
  shareUrl: string;
  name: string;
  nameEn: string;
  photo: string;
  slogan: string;
  sloganEn: string;
}
