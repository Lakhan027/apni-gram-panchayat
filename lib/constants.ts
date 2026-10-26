// Language-neutral constants. All visible text lives in lib/i18n/dictionary.ts.
import type {
  NoticeCategory,
  PaymentStatus,
  ResolutionDecision,
  SchemeCategory,
  WageStatus,
  WorkCategory,
  WorkStatus,
} from './types';

export const SITE = {
  nameEn: 'Apni Gram Panchayat',
  village: 'Appliyas',
  tehsil: 'Hurda',
  district: 'Bhilwara',
};

export const NAV_LINKS = [
  { href: '/', key: 'nav.home' },
  { href: '/about', key: 'nav.about' },
  { href: '/works', key: 'nav.works' },
  { href: '/mgnrega', key: 'nav.mgnrega' },
  { href: '/budget', key: 'nav.budget' },
  { href: '/gram-sabha', key: 'nav.gramSabha' },
  { href: '/schemes', key: 'nav.schemes' },
  { href: '/notices', key: 'nav.notices' },
  { href: '/complaints', key: 'nav.complaints' },
  { href: '/contact', key: 'nav.contact' },
] as const;

/** Pages linked from the footer and home page but not the top menu. */
export const EXTRA_LINKS = [
  { href: '/sarpanch', key: 'nav.sarpanch' },
  { href: '/members', key: 'nav.members' },
  { href: '/gallery', key: 'nav.gallery' },
] as const;

export function isActiveLink(pathname: string, href: string) {
  const path = pathname.replace(/\/$/, '') || '/';
  if (href === '/') return path === '/';
  return path === href || path.startsWith(`${href}/`);
}

export const WORK_STATUS: Record<WorkStatus, { className: string }> = {
  proposed: { className: 'bg-status-proposedBg text-status-proposedText' },
  approved: { className: 'bg-status-approvedBg text-status-approvedText' },
  'in-progress': { className: 'bg-status-progressBg text-status-progressText' },
  completed: { className: 'bg-status-doneBg text-status-doneText' },
  'on-hold': { className: 'bg-status-holdBg text-status-holdText' },
};

export const WORK_STATUS_ORDER: WorkStatus[] = ['proposed', 'approved', 'in-progress', 'completed', 'on-hold'];

export const WORK_CATEGORIES: WorkCategory[] = ['road', 'drain', 'water', 'pond', 'streetlight', 'sanitation', 'building'];

export const WAGE_STATUS: Record<WageStatus, { className: string }> = {
  processing: { className: 'bg-status-progressBg text-status-progressText' },
  'verification-pending': { className: 'bg-status-proposedBg text-status-proposedText' },
  verified: { className: 'bg-status-doneBg text-status-doneText' },
};

export const PAYMENT_STATUS: Record<PaymentStatus, { className: string }> = {
  pending: { className: 'bg-status-proposedBg text-status-proposedText' },
  recorded: { className: 'bg-status-progressBg text-status-progressText' },
  verified: { className: 'bg-status-doneBg text-status-doneText' },
};

export const DECISION: Record<ResolutionDecision, { className: string }> = {
  passed: { className: 'bg-status-doneBg text-status-doneText' },
  deferred: { className: 'bg-status-proposedBg text-status-proposedText' },
  rejected: { className: 'bg-status-holdBg text-status-holdText' },
};

export const SCHEME_CATEGORIES: SchemeCategory[] = ['certificate', 'records', 'employment', 'welfare', 'sanitation'];

export const NOTICE_CATEGORIES: NoticeCategory[] = ['gram-sabha', 'works', 'health', 'scheme', 'deadline'];

export const COMPLAINT_CATEGORIES = ['water', 'road', 'streetlight', 'cleaning', 'drain', 'mgnrega', 'other'] as const;

export const WARD_COUNT = 9;

