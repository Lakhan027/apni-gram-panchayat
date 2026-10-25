'use client';

import DataTable, { type Column } from '@/components/ui/DataTable';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDate } from '@/lib/format';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { Resolution } from '@/lib/types';

export default function ActionTable({ rows }: { rows: Resolution[] }) {
  const { t, pick, lang } = useLang();
  const columns: Column<Resolution>[] = [
    {
      key: 'res',
      header: t('gs.col.resolution'),
      primary: true,
      render: (r) => (
        <span>
          <span className="block text-[13px] text-muted">{r.number}</span>
          <span className="font-semibold">{pick(r.title, r.en?.title)}</span>
        </span>
      ),
    },
    { key: 'body', header: t('gs.col.body'), render: (r) => pick(r.responsibleBody, r.en?.responsibleBody) },
    { key: 'status', header: t('works.status'), render: (r) => <StatusBadge status={r.actionStatus} /> },
    { key: 'update', header: t('gs.col.update'), render: (r) => <span className="whitespace-nowrap">{formatDate(r.lastUpdate, lang)}</span> },
  ];
  return <DataTable rows={rows} columns={columns} getKey={(r) => r.number} caption={t('gs.actions')} />;
}
