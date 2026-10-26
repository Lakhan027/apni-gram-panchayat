import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import BackToNrega from '@/components/nrega/BackToNrega';
import MistolList from '@/components/nrega/MistolList';
import { getMgnregaWorks, getWagePayments } from '@/lib/data';
import { T } from '@/lib/i18n/T';
import { MISTOL_LABEL, NREGA_NAME_HI } from '@/lib/nrega';

export const metadata: Metadata = { title: `${MISTOL_LABEL} — ${NREGA_NAME_HI}` };

export default async function MistolPage() {
  const [rows, works] = await Promise.all([getWagePayments(), getMgnregaWorks()]);
  return (
    <>
      <PageHeader
        title={MISTOL_LABEL}
        description={<T k="mistol.desc" />}
        crumbs={[{ label: <T k="nav.mgnrega" />, href: '/mgnrega' }, { label: MISTOL_LABEL }]}
      />
      <div className="container-page space-y-5 py-8">
        <BackToNrega />
        <MistolList rows={rows} works={works} />
      </div>
    </>
  );
}
