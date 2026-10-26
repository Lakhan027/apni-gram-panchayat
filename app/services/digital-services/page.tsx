import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import DigitalServicesGuide from '@/components/services/DigitalServicesGuide';
import DigitalServicesList from '@/components/services/DigitalServicesList';
import BackLink from '@/components/ui/BackLink';
import { getDigitalServices } from '@/lib/data';
import { T } from '@/lib/i18n/T';

export const metadata: Metadata = { title: 'डिजिटल सेवाएँ' };

export default async function DigitalServicesPage() {
  const services = await getDigitalServices();
  return (
    <>
      <PageHeader
        title={<T k="svc.digital" />}
        description={<T k="dsv.intro" />}
        crumbs={[{ label: <T k="home.services" />, href: '/#services' }, { label: <T k="svc.digital" /> }]}
      />
      <div className="container-page space-y-5 py-8">
        <BackLink href="/#services" labelKey="svc.back" />
        <DigitalServicesGuide />
        <DigitalServicesList services={services} />
      </div>
    </>
  );
}
