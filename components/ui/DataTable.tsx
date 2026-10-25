import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Shown as the card heading on phones. Exactly one column should set this. */
  primary?: boolean;
  /** Hide this column in the phone card view. */
  hideOnCard?: boolean;
  align?: 'left' | 'right';
  className?: string;
}

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  getKey: (row: T) => string;
  caption: string;
  footer?: ReactNode;
}

/**
 * Below md: stack of cards. md–lg: scrollable table with sticky first column. lg+: full table.
 */
export default function DataTable<T>({ rows, columns, getKey, caption, footer }: DataTableProps<T>) {
  const primary = columns.find((c) => c.primary) ?? columns[0];
  const rest = columns.filter((c) => c !== primary && !c.hideOnCard);

  return (
    <div>
      <ul className="print-hide-cards space-y-3 md:hidden" aria-label={caption}>
        {rows.map((row) => (
          <li key={getKey(row)} className="card p-4">
            <div className="mb-2 break-words text-[16px] font-semibold text-ink">{primary.render(row)}</div>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 min-[400px]:grid-cols-2">
              {rest.map((c) => (
                <div key={c.key} className="min-w-0">
                  <dt className="text-[13px] text-muted">{c.header}</dt>
                  <dd className="break-words text-[15px] text-ink">{c.render(row)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      <div className="print-table-full hidden overflow-x-auto rounded-[14px] border border-line bg-white shadow-card md:block">
        <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-green-50 text-[14px] text-green-900">
            <tr>
              {columns.map((c, i) => (
                <th
                  key={c.key}
                  scope="col"
                  className={`whitespace-nowrap px-4 py-3 font-semibold ${c.align === 'right' ? 'text-right' : ''} ${
                    i === 0 ? 'sticky left-0 z-10 bg-green-50 lg:static' : ''
                  }`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={getKey(row)} className="border-t border-line align-top">
                {columns.map((c, i) => (
                  <td
                    key={c.key}
                    className={`px-4 py-3 ${c.align === 'right' ? 'text-right tabular-nums' : ''} ${
                      i === 0 ? 'sticky left-0 z-10 bg-white lg:static' : ''
                    } ${c.className ?? ''}`}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {footer && <tfoot className="border-t-2 border-line bg-ground font-semibold">{footer}</tfoot>}
        </table>
      </div>
    </div>
  );
}
