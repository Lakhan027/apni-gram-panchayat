import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';
import { T } from '@/lib/i18n/T';

interface ErrorStateProps {
  title?: ReactNode;
  message?: ReactNode;
  action?: ReactNode;
}

export default function ErrorState({
  title = <T k="common.errorTitle" />,
  message = <T k="common.errorMessage" />,
  action,
}: ErrorStateProps) {
  return (
    <div className="card flex flex-col items-center border-status-holdText/30 px-6 py-10 text-center" role="alert">
      <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-status-holdBg text-status-holdText">
        <AlertTriangle size={28} aria-hidden="true" />
      </span>
      <p className="text-[18px] font-semibold text-ink">{title}</p>
      <p className="mt-1 max-w-md text-muted">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
