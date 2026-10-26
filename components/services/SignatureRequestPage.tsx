import PageHeader from '@/components/layout/PageHeader';
import BackLink from '@/components/ui/BackLink';
import { T } from '@/lib/i18n/T';
import { getSignatureService, type SignatureService } from '@/lib/services';
import type { ServiceGuide as Guide } from '@/lib/types';
import ServiceGuide from './ServiceGuide';

/** Shared layout for the three डिजिटल सिग्नेचर guidance pages. */
export default function SignatureRequestPage({ slug, guide }: { slug: SignatureService['slug']; guide: Guide }) {
  const s = getSignatureService(slug);
  return (
    <>
      <PageHeader
        title={<T k={s.titleKey} />}
        description={<T k={s.descKey} />}
        crumbs={[
          { label: <T k="home.services" />, href: '/#services' },
          { label: <T k="svc.ds" />, href: '/services/digital-signature' },
          { label: <T k={s.titleKey} /> },
        ]}
      />
      <div className="container-page space-y-5 py-8">
        <BackLink href="/services/digital-signature" labelKey="ds.back" />
        <ServiceGuide guide={guide} />
      </div>
    </>
  );
}
