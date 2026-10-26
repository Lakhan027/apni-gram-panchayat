import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import ServiceGuide from '@/components/services/ServiceGuide';
import BackLink from '@/components/ui/BackLink';
import { getServiceGuide } from '@/lib/data';
import { T } from '@/lib/i18n/T';

export const metadata: Metadata = { title: 'आवासीय मकान पट्टा' };

export default async function HousePattaPage() {
  const guide = await getServiceGuide('house-patta');
  return (
    <>
      <PageHeader
        title={<T k="svc.patta" />}
        description={<T k="svc.pattaDesc" />}
        crumbs={[{ label: <T k="home.services" />, href: '/#services' }, { label: <T k="svc.patta" /> }]}
      />
      <div className="container-page space-y-5 py-8">
        <BackLink href="/#services" labelKey="svc.back" />
        <ServiceGuide guide={guide} />
      </div>
    </>
  );
}
