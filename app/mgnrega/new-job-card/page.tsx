import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import BackToNrega from '@/components/nrega/BackToNrega';
import JobCardForm from '@/components/nrega/JobCardForm';
import { T } from '@/lib/i18n/T';
import { NREGA_NAME_HI } from '@/lib/nrega';

export const metadata: Metadata = { title: `नया जॉब कार्ड बनाने हेतु — ${NREGA_NAME_HI}` };

export default function NewJobCardPage() {
  return (
    <>
      <PageHeader
        title={<T k="nrega.newCard" />}
        description={<T k="nav.mgnrega" />}
        crumbs={[{ label: <T k="nav.mgnrega" />, href: '/mgnrega' }, { label: <T k="nrega.newCard" /> }]}
      />
      <div className="container-page max-w-3xl space-y-5 py-8">
        <BackToNrega />
        <JobCardForm />
      </div>
    </>
  );
}
