import {
  Briefcase,
  ClipboardList,
  FileText,
  Hammer,
  Home as HomeIcon,
  IndianRupee,
  MessageSquareWarning,
  Receipt,
  Users,
  UsersRound,
  IdCard,
} from 'lucide-react';
import Hero from '@/components/home/Hero';
import ServiceCard from '@/components/home/ServiceCard';
import StatCard from '@/components/home/StatCard';
import MgnregaSummaryCard from '@/components/home/MgnregaSummaryCard';
import UpcomingMeetingCard from '@/components/gram-sabha/UpcomingMeetingCard';
import WorkCard from '@/components/works/WorkCard';
import NoticeCard from '@/components/notices/NoticeCard';
import SectionHeading from '@/components/ui/SectionHeading';
import EmptyState from '@/components/ui/EmptyState';
import { getBudget, getMgnregaWorks, getNotices, getStats, getUpcomingMeeting, getWagePayments, getWorks } from '@/lib/data';
import { budgetTotals, formatNumber, workTotals } from '@/lib/format';
import { ShortINR, T } from '@/lib/i18n/T';
import { todayISO } from '@/lib/schedule';

const SERVICES = [
  { href: '/schemes/birth-death', title: 'home.svc.birth', description: 'home.svc.birthDesc', icon: FileText },
  { href: '/schemes/property-records', title: 'home.svc.property', description: 'home.svc.propertyDesc', icon: HomeIcon, tone: 'saffron' as const },
  { href: '/mgnrega', title: 'home.svc.mgnrega', description: 'home.svc.mgnregaDesc', icon: Briefcase },
  { href: '/gram-sabha', title: 'home.svc.sabha', description: 'home.svc.sabhaDesc', icon: UsersRound, tone: 'saffron' as const },
  { href: '/complaints', title: 'home.svc.complaint', description: 'home.svc.complaintDesc', icon: MessageSquareWarning },
  { href: '/schemes', title: 'home.svc.schemes', description: 'home.svc.schemesDesc', icon: ClipboardList, tone: 'saffron' as const },
] as const;

const CURRENT_FY = '2026-27';
const FY_LABEL = '2026–27';

export default async function HomePage() {
  const [stats, works, notices, meeting, budget, mgnregaWorks, wages] = await Promise.all([
    getStats(),
    getWorks(),
    getNotices(),
    getUpcomingMeeting(),
    getBudget(),
    getMgnregaWorks(),
    getWagePayments(),
  ]);
  const today = todayISO();
  const wt = workTotals(works);
  const bt = budgetTotals(
    budget.lines.filter((l) => l.financialYear === CURRENT_FY),
    budget.payments.filter((p) => p.financialYear === CURRENT_FY),
  );
  const statCards = [
    { key: 'pop', label: <T k="home.stat.population" />, value: formatNumber(stats.population), icon: Users },
    { key: 'hh', label: <T k="home.stat.households" />, value: formatNumber(stats.households), icon: HomeIcon, tone: 'saffron' as const },
    { key: 'jc', label: <T k="home.stat.jobCards" />, value: formatNumber(stats.jobCards), icon: IdCard },
    { key: 'ongoing', label: <T k="home.stat.ongoing" />, value: formatNumber(wt.inProgress), icon: Hammer, tone: 'saffron' as const },
    { key: 'approved', label: <T k="home.stat.approved" vars={{ fy: FY_LABEL }} />, value: <ShortINR amount={bt.approved} />, icon: IndianRupee },
    { key: 'recorded', label: <T k="home.stat.recorded" vars={{ fy: FY_LABEL }} />, value: <ShortINR amount={bt.recorded} />, icon: Receipt, tone: 'saffron' as const },
  ];

  return (
    <>
      <Hero />

      <section aria-labelledby="services" className="container-page py-12 md:py-16">
        <SectionHeading id="services" title={<T k="home.services" />} subtitle={<T k="home.servicesSub" />} />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
          {SERVICES.map((s) => (
            <ServiceCard key={s.href} {...s} title={<T k={s.title} />} description={<T k={s.description} />} />
          ))}
        </div>
      </section>

      <section aria-labelledby="glance" className="container-page pb-12 md:pb-16">
        <SectionHeading id="glance" title={<T k="home.glance" />} />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
          {statCards.map(({ key, ...s }) => (
            <StatCard key={key} {...s} />
          ))}
        </div>
      </section>

      <div className="container-page grid grid-cols-1 gap-10 pb-12 md:pb-16 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
        <section aria-labelledby="recent-works" className="min-w-0">
          <SectionHeading id="recent-works" title={<T k="home.recentWorks" />} link={{ href: '/works', label: <T k="home.allWorks" /> }} />
          {works.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {works.slice(0, 3).map((w, i) => (
                <div key={w.id} className={i === 2 ? 'sm:col-span-2 lg:col-span-1 xl:col-span-2' : ''}>
                  <WorkCard work={w} today={today} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title={<T k="home.noWorks" />} />
          )}
        </section>
        <section aria-labelledby="latest-notices" className="min-w-0">
          <SectionHeading id="latest-notices" title={<T k="home.latestNotices" />} link={{ href: '/notices', label: <T k="home.allNotices" /> }} />
          {notices.length ? (
            <div className="space-y-3">
              {notices.slice(0, 4).map((n) => (
                <NoticeCard key={n.id} notice={n} compact />
              ))}
            </div>
          ) : (
            <EmptyState title={<T k="home.noNotices" />} />
          )}
        </section>
      </div>

      <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8">
        <section aria-labelledby="mgnrega-summary" className="min-w-0">
          <MgnregaSummaryCard
            headingId="mgnrega-summary"
            activeWorks={mgnregaWorks.filter((w) => w.status === 'in-progress').length}
            personDays={stats.mgnrega.personDaysThisYear}
            activeJobCards={stats.mgnrega.activeJobCards}
            musterRollsInProcessing={wages.filter((w) => w.status === 'processing').length}
          />
        </section>
        <section aria-labelledby="upcoming-sabha" className="min-w-0">
          <SectionHeading id="upcoming-sabha" title={<T k="home.upcomingSabha" />} link={{ href: '/gram-sabha', label: <T k="home.sabhaPage" /> }} />
          {meeting ? <UpcomingMeetingCard meeting={meeting} agendaLimit={3} /> : <EmptyState title={<T k="home.noMeeting" />} />}
        </section>
      </div>
    </>
  );
}
