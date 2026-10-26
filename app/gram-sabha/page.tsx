import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import ActionTable from '@/components/gram-sabha/ActionTable';
import PastMeetingItem from '@/components/gram-sabha/PastMeetingItem';
import UpcomingMeetingCard from '@/components/gram-sabha/UpcomingMeetingCard';
import EmptyState from '@/components/ui/EmptyState';
import SectionHeading from '@/components/ui/SectionHeading';
import { getGramSabhaMeetings } from '@/lib/data';
import { T } from '@/lib/i18n/T';

export const metadata: Metadata = { title: 'पंचायत बैठक (कोरम)' };

export default async function GramSabhaPage() {
  const meetings = await getGramSabhaMeetings();
  const upcoming = meetings.filter((m) => m.upcoming).reverse();
  const past = meetings.filter((m) => !m.upcoming);
  const actions = past.flatMap((m) => m.resolutions).filter((r) => r.decision === 'passed');

  return (
    <>
      <PageHeader title={<T k="nav.gramSabha" />} description={<T k="gs.desc" />} crumbs={[{ label: <T k="nav.gramSabha" /> }]} />
      <div className="container-page space-y-12 py-8">
        <section aria-labelledby="upcoming">
          <SectionHeading id="upcoming" title={<T k="gs.upcoming" />} />
          {upcoming.length ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {upcoming.map((m) => (
                <UpcomingMeetingCard key={m.id} meeting={m} />
              ))}
            </div>
          ) : (
            <EmptyState title={<T k="home.noMeeting" />} />
          )}
        </section>

        <section aria-labelledby="past">
          <SectionHeading id="past" title={<T k="gs.past" />} subtitle={<T k="gs.pastSub" />} />
          {past.length ? (
            <div className="space-y-3">
              {past.map((m) => (
                <PastMeetingItem key={m.id} meeting={m} />
              ))}
            </div>
          ) : (
            <EmptyState title={<T k="gs.noPast" />} />
          )}
        </section>

        <section aria-labelledby="actions">
          <SectionHeading id="actions" title={<T k="gs.actions" />} />
          {actions.length ? <ActionTable rows={actions} /> : <EmptyState title={<T k="gs.noActions" />} />}
        </section>
      </div>
    </>
  );
}
