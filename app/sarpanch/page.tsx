import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import SarpanchProfile from '@/components/sarpanch/SarpanchProfile';
import { getSarpanch } from '@/lib/data';
import { T } from '@/lib/i18n/T';

export const metadata: Metadata = { title: 'हमारे सरपंच — मांगी लाल बुनकर' };

export default async function SarpanchPage() {
  const sarpanch = await getSarpanch();
  return (
    <>
      <PageHeader title={<T k="nav.sarpanch" />} description={<T k="sp.desc" />} crumbs={[{ label: <T k="nav.sarpanch" /> }]} />
      <div className="container-page py-8">
        <SarpanchProfile sarpanch={sarpanch} />
      </div>
    </>
  );
}
