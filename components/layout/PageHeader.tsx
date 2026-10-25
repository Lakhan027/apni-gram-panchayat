import type { ReactNode } from 'react';
import Breadcrumb, { type Crumb } from './Breadcrumb';

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  crumbs: Crumb[];
  badge?: ReactNode;
  actions?: ReactNode;
}

export default function PageHeader({ title, description, crumbs, badge, actions }: PageHeaderProps) {
  return (
    <div className="border-b border-line bg-green-50">
      <div className="container-page py-6 md:py-9">
        <Breadcrumb items={crumbs} />
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="break-words text-[28px] font-extrabold text-green-900 md:text-[38px]">{title}</h1>
              {badge}
            </div>
            {description && <p className="mt-1 max-w-3xl text-[16px] text-muted md:text-[17px]">{description}</p>}
          </div>
          {actions && <div className="no-print flex flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
