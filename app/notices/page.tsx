import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import NoticesExplorer from '@/components/notices/NoticesExplorer';
import { getNotices } from '@/lib/data';
import { T } from '@/lib/i18n/T';

export const metadata: Metadata = { title: 'सूचनाएँ' };

export default async function NoticesPage() {
  const notices = await getNotices();
  return (
    <>
      <PageHeader title={<T k="nav.notices" />} description={<T k="notices.desc" />} crumbs={[{ label: <T k="nav.notices" /> }]} />
      <div className="container-page py-8">
        <NoticesExplorer notices={notices} />
      </div>
    </>
  );
}
