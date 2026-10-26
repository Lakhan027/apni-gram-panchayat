import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import SignatureOptions from '@/components/services/SignatureOptions';
import BackLink from '@/components/ui/BackLink';
import { T } from '@/lib/i18n/T';

export const metadata: Metadata = { title: 'डिजिटल सिग्नेचर' };

export default function DigitalSignaturePage() {
  return (
    <>
      <PageHeader
        title={<T k="svc.ds" />}
        description={<T k="ds.intro" />}
        crumbs={[{ label: <T k="home.services" />, href: '/#services' }, { label: <T k="svc.ds" /> }]}
      />
      <div className="container-page space-y-5 py-8">
        <BackLink href="/#services" labelKey="svc.back" />
        <SignatureOptions />
      </div>
    </>
  );
}
