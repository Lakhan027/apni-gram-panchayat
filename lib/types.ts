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
  wards: { number: number; area: string }[];
  representatives: { role: string; name: string }[];
  functions: { title: string; text: string }[];
  office: { address: string; phone: string; email: string; hours: string };
  en?: {
    intro?: string;
    wardArea?: string;
    representatives?: { role: string; name: string }[];
    functions?: { title: string; text: string }[];
  };
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
