'use client';

import { ExternalLink } from 'lucide-react';
import { useLang } from '@/lib/i18n/LanguageProvider';

interface OfficialLinkProps {
  /** Verified official URL, or null when none is available. */
  href: string | null;
  compact?: boolean;
}

/** Official government link that always opens in a new tab. Renders nothing when there is no link. */
export default function OfficialLink({ href, compact = false }: OfficialLinkProps) {
  const { t } = useLang();
  if (!href) return null;
  const host = new URL(href).hostname;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-green-700 hover:underline ${compact ? 'text-[14px]' : ''}`}
    >
      <ExternalLink size={compact ? 16 : 18} aria-hidden="true" />
      <span>
        {t('link.official')}
        {compact ? <span className="sr-only"> ({host})</span> : <span className="ml-1 break-all font-normal text-muted">({host})</span>}
        <span className="sr-only"> {t('link.newTab')}</span>
      </span>
    </a>
  );
}
