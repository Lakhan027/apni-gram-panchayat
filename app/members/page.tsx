import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import MembersGrid from '@/components/members/MembersGrid';
import { getMembers } from '@/lib/data';
import { T } from '@/lib/i18n/T';

export const metadata: Metadata = { title: 'पंचायत सदस्य' };

export default async function MembersPage() {
  const members = await getMembers();
  return (
    <>
      <PageHeader title={<T k="nav.members" />} description={<T k="members.desc" />} crumbs={[{ label: <T k="nav.members" /> }]} />
      <div className="container-page py-8">
        <MembersGrid members={members} />
      </div>
    </>
  );
}
