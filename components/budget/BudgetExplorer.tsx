'use client';

import { useMemo, useState } from 'react';
import { Download, Printer } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import SectionHeading from '@/components/ui/SectionHeading';
import SummaryBar from '@/components/ui/SummaryBar';
import { budgetTotals, formatINR, groupByScheme, toCSV, workWiseRows } from '@/lib/format';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { BudgetData } from '@/lib/types';
import BudgetFilters, { fyLabel, type BudgetFilterState } from './BudgetFilters';
import { PaymentTable, WorkBudgetTable } from './BudgetTables';
import SchemeBars from './SchemeBars';

export default function BudgetExplorer({ data }: { data: BudgetData }) {
  const { t, pick } = useLang();
  const [f, setF] = useState<BudgetFilterState>({ fy: data.financialYears[0], category: 'all', from: '', to: '' });

  const { lines, payments, totals, workRows, schemeRows } = useMemo(() => {
    const lines = data.lines.filter((l) => l.financialYear === f.fy && (f.category === 'all' || l.category === f.category));
    const payments = data.payments.filter(
      (p) =>
        p.financialYear === f.fy &&
        (f.category === 'all' || p.category === f.category) &&
        (!f.from || p.date >= f.from) &&
        (!f.to || p.date <= f.to),
    );
    const workRows = workWiseRows(lines, payments);
    return { lines, payments, totals: budgetTotals(lines, payments), workRows, schemeRows: groupByScheme(workRows) };
  }, [data, f]);

  // The CSV follows the language on screen.
  const downloadCSV = () => {
    const csv = toCSV(
      [t('budget.col.date'), t('budget.col.workId'), t('works.col.work'), t('budget.col.voucher'), t('budget.csvAmount'), t('works.status')],
      payments.map((p) => [p.date, p.workId, pick(p.workName, p.en?.workName), p.voucherRef ?? '', p.amount, t(`pay.${p.status}`)]),
    );
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `appliyas-payments-${f.fy}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10">
      <BudgetFilters years={data.financialYears} value={f} onChange={setF} />
      <p className="hidden font-semibold print:block">{t('budget.printHeader', { fy: fyLabel(f.fy) })}</p>

      <div className="space-y-3">
        <SummaryBar
          labelKey="budget.summary"
          items={[
            { label: t('budget.approved'), value: formatINR(totals.approved) },
            { label: t('budget.recorded'), value: formatINR(totals.recorded) },
            { label: t('budget.verified'), value: formatINR(totals.verified) },
            { label: t('budget.remaining'), value: formatINR(totals.remaining), hint: t('budget.remainingHint') },
          ]}
        />
        <div className="no-print flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer size={18} aria-hidden="true" /> {t('budget.print')}
          </Button>
          <Button variant="outline" onClick={downloadCSV} disabled={payments.length === 0}>
            <Download size={18} aria-hidden="true" /> {t('budget.csv')}
          </Button>
        </div>
      </div>

      {lines.length === 0 ? (
        <EmptyState
          title={t('budget.none')}
          action={<Button onClick={() => setF({ ...f, category: 'all', from: '', to: '' })}>{t('common.resetFilters')}</Button>}
        />
      ) : (
        <>
          <section aria-labelledby="scheme-wise">
            <SectionHeading id="scheme-wise" title={t('budget.schemeWise')} />
            <Card className="p-5 sm:p-6">
              <SchemeBars rows={schemeRows} />
            </Card>
          </section>
          <section aria-labelledby="work-wise">
            <SectionHeading id="work-wise" title={t('budget.workWise')} />
            <WorkBudgetTable rows={workRows} />
          </section>
        </>
      )}

      <section aria-labelledby="payments">
        <SectionHeading id="payments" title={t('budget.payments')} subtitle={t('budget.paymentsSub')} />
        {payments.length ? <PaymentTable rows={payments} /> : <EmptyState title={t('budget.noPayments')} />}
      </section>
    </div>
  );
}
