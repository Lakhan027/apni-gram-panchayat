import type { Metadata } from 'next';
import PageHeader from '@/components/layout/PageHeader';
import BudgetExplorer from '@/components/budget/BudgetExplorer';
import { getBudget } from '@/lib/data';
import { T } from '@/lib/i18n/T';

export const metadata: Metadata = { title: 'बजट एवं खर्च' };

export default async function BudgetPage() {
  const data = await getBudget();
  return (
    <>
      <PageHeader title={<T k="nav.budget" />} description={<T k="budget.desc" />} crumbs={[{ label: <T k="nav.budget" /> }]} />
      <div className="container-page py-8">
        <BudgetExplorer data={data} />
      </div>
    </>
  );
}
