'use client';

import Link from 'next/link';
import { ArrowRight, FileCheck2, ShoppingBasket, Zap } from 'lucide-react';
import IconTile from '@/components/ui/IconTile';
import { useLang } from '@/lib/i18n/LanguageProvider';
import { SIGNATURE_SERVICES } from '@/lib/services';

const ICONS = { noc: FileCheck2, 'ration-card': ShoppingBasket, 'light-file': Zap } as const;

/** The three डिजिटल सिग्नेचर options: NOC, राशन कार्ड, लाइट फाइल. */
export default function SignatureOptions() {
  const { t } = useLang();
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
      {SIGNATURE_SERVICES.map((s, i) => (
        <li key={s.slug}>
          <Link
            href={`/services/digital-signature/${s.slug}`}
            className="card group flex h-full min-h-[44px] items-center gap-4 p-4 transition-colors hover:border-green-700 sm:flex-col sm:items-start sm:p-5"
          >
            <IconTile icon={ICONS[s.slug]} tone={i % 2 ? 'saffron' : 'green'} size="lg" />
            <span className="min-w-0 flex-1">
              <span className="block text-[18px] font-bold leading-snug text-green-900 group-hover:underline sm:text-[19px]">{t(s.titleKey)}</span>
              <span className="mt-0.5 block text-[14px] text-muted sm:text-[15px]">{t(s.descKey)}</span>
            </span>
            <ArrowRight size={20} className="shrink-0 text-green-700 sm:hidden" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
