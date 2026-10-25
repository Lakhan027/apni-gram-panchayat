'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { Scheme } from '@/lib/types';
import OfficialLink from './OfficialLink';

export default function SchemeCard({ scheme }: { scheme: Scheme }) {
  const { t, pick } = useLang();
  const name = pick(scheme.name, scheme.en?.name);
  return (
    <article className="card flex h-full flex-col p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[13px] font-semibold text-green-700">{t(`schemeCat.${scheme.category}`)}</span>
        {!scheme.verified && <Badge label={t('common.verificationNeeded')} />}
      </div>
      <h3 className="mt-2 text-[17px] font-bold leading-snug text-green-900 sm:text-[19px]">{name}</h3>
      <p className="mt-1 text-[15px] text-muted">{pick(scheme.purpose, scheme.en?.purpose)}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-3">
        <Link href={`/schemes/${scheme.id}`} className="inline-flex min-h-[44px] items-center gap-1 font-semibold text-green-700 hover:underline">
          {t('common.fullDetails')} <span className="sr-only">— {name}</span>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
        <OfficialLink href={scheme.officialLink} compact />
      </div>
    </article>
  );
}
