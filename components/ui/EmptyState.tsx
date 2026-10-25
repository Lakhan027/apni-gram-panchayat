import { SearchX } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: ReactNode;
  message?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="card flex flex-col items-center px-6 py-10 text-center" role="status">
      <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
        <SearchX size={28} aria-hidden="true" />
      </span>
      <p className="text-[18px] font-semibold text-ink">{title}</p>
      {message && <p className="mt-1 max-w-md text-muted">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
