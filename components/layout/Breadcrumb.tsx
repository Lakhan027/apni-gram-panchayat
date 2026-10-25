'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLang } from '@/lib/i18n/LanguageProvider';

export interface Crumb {
  label: ReactNode;
  href?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const { t, lang } = useLang();
  const all: Crumb[] = [{ label: t('nav.home'), href: '/' }, ...items];
  return (
    <nav aria-label={lang === 'en' ? 'Breadcrumb' : 'ब्रेडक्रम्ब'} className="no-print">
      <ol className="flex flex-wrap items-center gap-1 text-[14px] text-muted">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {c.href && !last ? (
                <Link href={c.href} className="inline-flex min-h-[32px] items-center hover:text-green-700 hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className="break-words font-semibold text-ink">
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight size={14} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
