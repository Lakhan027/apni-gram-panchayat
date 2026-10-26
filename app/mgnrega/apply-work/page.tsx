import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import BackToNrega from '@/components/nrega/BackToNrega';
import WorkApplicationForm from '@/components/nrega/WorkApplicationForm';
import { T } from '@/lib/i18n/T';
import { NREGA_NAME_HI } from '@/lib/nrega';

export const metadata: Metadata = { title: `कार्य के लिए आवेदन — ${NREGA_NAME_HI}` };

export default function ApplyWorkPage() {
  return (
    <>
      <PageHeader
        title={<T k="nrega.applyWork" />}
        description={<T k="nav.mgnrega" />}
        crumbs={[{ label: <T k="nav.mgnrega" />, href: '/mgnrega' }, { label: <T k="nrega.applyWork" /> }]}
      />
      <div className="container-page max-w-3xl space-y-5 py-8">
        <BackToNrega />
        <WorkApplicationForm />
      </div>
    </>
  );
}
