import { T } from '@/lib/i18n/T';

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-line/70 ${className}`} aria-hidden="true" />;
}

/** Generic list-page skeleton: title block + grid of card placeholders. */
export default function PageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="container-page py-8" role="status" aria-live="polite">
      <span className="sr-only">
        <T k="common.loading" />
      </span>
      <Skeleton className="mb-3 h-5 w-40" />
      <Skeleton className="mb-8 h-9 w-72 max-w-full" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="card space-y-3 p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-2.5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
