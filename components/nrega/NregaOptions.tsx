'use client';

import Link from 'next/link';
import { ArrowRight, ClipboardList, FilePlus2, HardHat } from 'lucide-react';
import IconTile from '@/components/ui/IconTile';
import { useLang } from '@/lib/i18n/LanguageProvider';
import { MISTOL_LABEL } from '@/lib/nrega';

/** The three VB—G RAM G (NREGA) services, kept as separate options. */
export default function NregaOptions() {
  const { t } = useLang();
  const options = [
    { href: '/mgnrega/apply-work', title: t('nrega.applyWork'), desc: t('nrega.applyWorkDesc'), icon: HardHat, tone: 'green' as const },
    { href: '/mgnrega/new-job-card', title: t('nrega.newCard'), desc: t('nrega.newCardDesc'), icon: FilePlus2, tone: 'saffron' as const },
    // The label मिसटोल is kept exactly as-is in both languages.
    { href: '/mgnrega/mistol', title: MISTOL_LABEL, desc: t('nrega.mistolDesc'), icon: ClipboardList, tone: 'green' as const },
  ];
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      {options.map((o) => (
        <li key={o.href}>
          <Link
            href={o.href}
            className="card group flex h-full min-h-[44px] items-center gap-4 p-4 transition-colors hover:border-green-700 sm:flex-col sm:items-start sm:p-5"
          >
            <IconTile icon={o.icon} tone={o.tone} size="lg" />
            <span className="min-w-0 flex-1">
              <span className="block text-[18px] font-bold leading-snug text-green-900 group-hover:underline sm:text-[19px]">{o.title}</span>
              <span className="mt-0.5 block text-[14px] text-muted sm:text-[15px]">{o.desc}</span>
            </span>
            <ArrowRight size={20} className="shrink-0 text-green-700 sm:hidden" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
