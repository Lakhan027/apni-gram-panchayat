import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import SchemesExplorer from '@/components/schemes/SchemesExplorer';
import { getSchemes } from '@/lib/data';
import { T } from '@/lib/i18n/T';

export const metadata: Metadata = { title: 'सरकारी योजनाएँ' };

export default async function SchemesPage() {
  const schemes = await getSchemes();
  return (
    <>
      <PageHeader title={<T k="schemes.title" />} description={<T k="schemes.desc" />} crumbs={[{ label: <T k="nav.schemes" /> }]} />
      <div className="container-page py-8">
        <SchemesExplorer schemes={schemes} />
      </div>
    </>
  );
}
