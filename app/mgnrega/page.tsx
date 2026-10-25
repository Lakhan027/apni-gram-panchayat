import type { Metadata } from 'next';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import { MgnregaWorkTable, WagePaymentTable } from '@/components/mgnrega/MgnregaTables';
import WorksitePhotos from '@/components/mgnrega/WorksitePhotos';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import DownloadList from '@/components/ui/DownloadList';
import EmptyState from '@/components/ui/EmptyState';
import SectionHeading from '@/components/ui/SectionHeading';
import SummaryBar from '@/components/ui/SummaryBar';
import { getMgnregaReports, getMgnregaWorks, getStats, getWagePayments } from '@/lib/data';
import { formatNumber } from '@/lib/format';
import { T } from '@/lib/i18n/T';

export const metadata: Metadata = { title: 'मनरेगा' };

const NREGA_PORTAL = 'https://nrega.dord.gov.in/Nregahome/MGNREGA_new/Nrega_home.aspx';

const WORKSITE_PHOTOS = ['/images/worksite-1.svg', '/images/worksite-2.svg', '/images/worksite-3.svg', '/images/worksite-4.svg'];

export default async function MgnregaPage() {
  const [works, wages, stats, reports] = await Promise.all([
    getMgnregaWorks(),
    getWagePayments(),
    getStats(),
    getMgnregaReports(),
  ]);
  const inProcessing = wages.filter((w) => w.status === 'processing').length;

  return (
    <>
      <PageHeader
        title={<T k="nav.mgnrega" />}
        description={<T k="mg.desc" />}
        crumbs={[{ label: <T k="nav.mgnrega" /> }]}
        actions={
          <>
            <Button href="/schemes/mgnrega-job-card">
              <T k="mg.jobCardInfo" />
            </Button>
            <a
              href={NREGA_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border-2 border-green-700 bg-white px-4 text-[15px] font-semibold text-green-700 hover:bg-green-50"
            >
              <ExternalLink size={18} aria-hidden="true" />
              <T k="mg.officialPortal" />
              <span className="sr-only">
                {' '}
                <T k="link.newTab" />
              </span>
            </a>
          </>
        }
      />
      <div className="container-page space-y-12 py-8">
        <SummaryBar
          labelKey="mgSummary.title"
          items={[
            { label: <T k="mgSummary.activeWorks" />, value: works.filter((w) => w.status === 'in-progress').length },
            { label: <T k="mgSummary.personDays" />, value: formatNumber(stats.mgnrega.personDaysThisYear) },
            { label: <T k="mgSummary.jobCards" />, value: formatNumber(stats.mgnrega.activeJobCards) },
            { label: <T k="mgSummary.processing" />, value: inProcessing },
          ]}
        />

        <div role="note" className="flex gap-3 rounded-[14px] border border-saffron/50 bg-saffron-50 p-4 text-saffron-text sm:p-5">
          <ShieldCheck size={24} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p className="font-medium">
            <T k="mg.note" />
          </p>
        </div>

        <section aria-labelledby="work-register">
          <SectionHeading id="work-register" title={<T k="mg.register" />} />
          {works.length ? <MgnregaWorkTable rows={works} /> : <EmptyState title={<T k="mg.noWorks" />} />}
        </section>

        <section aria-labelledby="wages">
          <SectionHeading id="wages" title={<T k="mg.wages" />} subtitle={<T k="mg.wagesSub" />} />
          {wages.length ? <WagePaymentTable rows={wages} /> : <EmptyState title={<T k="mg.noWages" />} />}
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section aria-labelledby="worksite">
            <SectionHeading id="worksite" title={<T k="mg.photos" />} level="h3" />
            <WorksitePhotos photos={WORKSITE_PHOTOS} />
          </section>
          <section aria-labelledby="reports">
            <SectionHeading id="reports" title={<T k="mg.reports" />} level="h3" />
            <Card className="px-5 py-2">
              <DownloadList
                items={reports.map((r) => ({ name: r.title, nameEn: r.en?.title, type: r.type, meta: r.period, metaEn: r.en?.period }))}
              />
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}
