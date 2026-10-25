'use client';

import DataTable, { type Column } from '@/components/ui/DataTable';
import ProgressBar from '@/components/ui/ProgressBar';
import StatusBadge, { Pill } from '@/components/ui/StatusBadge';
import { WAGE_STATUS } from '@/lib/constants';
import { formatDate, formatINR, formatNumber } from '@/lib/format';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { MgnregaWork, WagePayment } from '@/lib/types';

export function MgnregaWorkTable({ rows }: { rows: MgnregaWork[] }) {
  const { t, pick } = useLang();
  const columns: Column<MgnregaWork>[] = [
    { key: 'id', header: t('mg.col.id'), render: (w) => <span className="whitespace-nowrap">{w.id}</span> },
    { key: 'ref', header: t('mg.col.ref'), render: (w) => <span className="break-all text-[14px]">{w.officialRef}</span> },
    { key: 'name', header: t('mg.col.name'), primary: true, render: (w) => <span className="font-semibold">{pick(w.name, w.en?.name)}</span> },
    { key: 'loc', header: t('mg.col.location'), render: (w) => pick(w.location, w.en?.location) },
    { key: 'amt', header: t('mg.col.amount'), align: 'right', render: (w) => formatINR(w.approvedAmount) },
    { key: 'exp', header: t('works.recorded'), align: 'right', render: (w) => formatINR(w.recordedExpenditure) },
    { key: 'status', header: t('works.status'), render: (w) => <StatusBadge status={w.status} /> },
    { key: 'prog', header: t('common.progress'), render: (w) => <div className="min-w-[110px]"><ProgressBar value={w.progress} /></div> },
  ];
  return <DataTable rows={rows} columns={columns} getKey={(r) => r.id} caption={t('mg.registerCaption')} />;
}

export function WagePaymentTable({ rows }: { rows: WagePayment[] }) {
  const { t, lang } = useLang();
  const columns: Column<WagePayment>[] = [
    { key: 'mr', header: t('mg.col.muster'), primary: true, render: (p) => <span className="whitespace-nowrap font-semibold">{p.musterRoll}</span> },
    { key: 'work', header: t('mg.col.id'), render: (p) => p.workId },
    { key: 'period', header: t('mg.col.period'), render: (p) => `${formatDate(p.periodFrom, lang)} – ${formatDate(p.periodTo, lang)}` },
    { key: 'days', header: t('mg.col.days'), align: 'right', render: (p) => formatNumber(p.personDays) },
    { key: 'status', header: t('mg.col.payStatus'), render: (p) => <Pill label={t(`wage.${p.status}`)} className={WAGE_STATUS[p.status].className} /> },
    {
      key: 'refno',
      header: t('mg.col.refNo'),
      render: (p) => (p.status === 'verified' && p.referenceNo ? <span className="break-all">{p.referenceNo}</span> : '—'),
    },
  ];
  return <DataTable rows={rows} columns={columns} getKey={(r) => r.musterRoll} caption={t('mg.wages')} />;
}
