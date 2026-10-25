import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import ErrorState from '@/components/ui/ErrorState';
import SummaryBar from '@/components/ui/SummaryBar';
import WorksExplorer from '@/components/works/WorksExplorer';
import { getWorks } from '@/lib/data';
import { workTotals } from '@/lib/format';
import { ShortINR, T } from '@/lib/i18n/T';
import { countDelayed, todayISO } from '@/lib/schedule';
import type { Work } from '@/lib/types';

export const metadata: Metadata = { title: 'विकास कार्य' };

export default async function WorksPage() {
  let works: Work[] | null = null;
  try {
    works = await getWorks();
  } catch {
    works = null;
  }
  // Static export: "today" is the build date, so redeploy regularly to keep schedule flags fresh.
  const today = todayISO();
  const t = works ? workTotals(works) : null;

  return (
    <>
      <PageHeader title={<T k="nav.works" />} description={<T k="works.desc" />} crumbs={[{ label: <T k="nav.works" /> }]} />
      <div className="container-page space-y-6 py-8">
        {works && t ? (
          <>
            <SummaryBar
              labelKey="works.summary"
              items={[
                { label: <T k="works.total" />, value: t.total },
                { label: <T k="status.in-progress" />, value: t.inProgress },
                { label: <T k="works.delayed" />, value: countDelayed(works, today) },
                { label: <T k="works.totalBudget" />, value: <ShortINR amount={t.approvedBudget} /> },
              ]}
            />
            <WorksExplorer works={works} today={today} />
          </>
        ) : (
          <ErrorState />
        )}
      </div>
    </>
  );
}
