'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { MessageKey } from '@/lib/i18n/translate';

/** "वापस …" button shown at the top of sub-pages. */
export default function BackLink({ href, labelKey }: { href: string; labelKey: MessageKey }) {
  const { t } = useLang();
  return (
    <Link
      href={href}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] border-2 border-green-700 bg-white px-4 font-semibold text-green-700 hover:bg-green-50"
    >
      <ArrowLeft size={18} aria-hidden="true" />
      {t(labelKey)}
    </Link>
  );
}
