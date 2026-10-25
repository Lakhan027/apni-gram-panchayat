'use client';

import DataTable, { type Column } from '@/components/ui/DataTable';
import { Pill } from '@/components/ui/StatusBadge';
import { PAYMENT_STATUS } from '@/lib/constants';
import { formatDate, formatINR, type WorkBudgetRow } from '@/lib/format';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { PaymentRecord } from '@/lib/types';

export function WorkBudgetTable({ rows }: { rows: WorkBudgetRow[] }) {
  const { t, pick } = useLang();
  const columns: Column<WorkBudgetRow>[] = [
    { key: 'name', header: t('works.col.work'), primary: true, render: (r) => <span className="font-semibold">{pick(r.workName, r.workNameEn)}</span> },
    { key: 'id', header: t('budget.col.workId'), render: (r) => <span className="whitespace-nowrap">{r.workId}</span> },
    { key: 'scheme', header: t('budget.col.scheme'), render: (r) => pick(r.scheme, r.schemeEn) },
    { key: 'approved', header: t('budget.approved'), align: 'right', render: (r) => formatINR(r.approved) },
    { key: 'recorded', header: t('budget.recorded'), align: 'right', render: (r) => formatINR(r.recorded) },
    { key: 'verified', header: t('budget.verified'), align: 'right', render: (r) => formatINR(r.verified) },
  ];
  return <DataTable rows={rows} columns={columns} getKey={(r) => r.workId} caption={t('budget.workWise')} />;
}

export function PaymentTable({ rows }: { rows: PaymentRecord[] }) {
  const { t, pick, lang } = useLang();
  const columns: Column<PaymentRecord>[] = [
    { key: 'date', header: t('budget.col.date'), render: (p) => <span className="whitespace-nowrap">{formatDate(p.date, lang)}</span> },
    { key: 'work', header: t('works.col.work'), primary: true, render: (p) => <span className="font-semibold">{pick(p.workName, p.en?.workName)}</span> },
    { key: 'voucher', header: t('budget.col.voucher'), render: (p) => (p.voucherRef ? <span className="break-all">{p.voucherRef}</span> : t('budget.notPublic')) },
    { key: 'amount', header: t('budget.col.amount'), align: 'right', render: (p) => formatINR(p.amount) },
    { key: 'status', header: t('works.status'), render: (p) => <Pill label={t(`pay.${p.status}`)} className={PAYMENT_STATUS[p.status].className} /> },
  ];
  return <DataTable rows={rows} columns={columns} getKey={(r) => r.id} caption={t('budget.payments')} />;
}
