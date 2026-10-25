'use client';

import Link from 'next/link';
import { Landmark } from 'lucide-react';
import { useLang } from '@/lib/i18n/LanguageProvider';

export default function Logo() {
  const { t } = useLang();
  return (
    <Link href="/" className="flex min-h-[44px] min-w-0 items-center gap-2.5 md:gap-3" aria-label={t('header.homeLink')}>
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-700 text-white ring-[3px] ring-saffron ring-offset-2 md:h-12 md:w-12"
        aria-hidden="true"
      >
        <Landmark size={22} />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[18px] font-extrabold text-green-900 md:text-[21px]">{t('site.name')}</span>
        <span className="block truncate text-[13px] font-medium text-muted md:text-[14px]">Appliyas · Bhilwara</span>
      </span>
    </Link>
  );
}
