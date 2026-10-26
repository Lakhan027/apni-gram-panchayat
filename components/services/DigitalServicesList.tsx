'use client';

import { ExternalLink, Fingerprint, Globe, HardHat, IdCard, Map as MapIcon, ScrollText, Sprout, Vote, type LucideIcon } from 'lucide-react';
import IconTile from '@/components/ui/IconTile';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { DigitalService } from '@/lib/types';

const ICONS: Record<string, LucideIcon> = {
  sprout: Sprout,
  scroll: ScrollText,
  hardhat: HardHat,
  fingerprint: Fingerprint,
  map: MapIcon,
  vote: Vote,
  idcard: IdCard,
};

/** Official government portals; every card opens the site in a new tab. */
export default function DigitalServicesList({ services }: { services: DigitalService[] }) {
  const { t, lang } = useLang();
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {services.map((s, i) => {
        const title = lang === 'en' ? s.nameEn : s.name;
        return (
          <li key={s.id}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card group flex h-full min-h-[44px] items-start gap-4 p-4 transition-colors hover:border-green-700 sm:p-5"
            >
              <IconTile icon={ICONS[s.icon] ?? Globe} tone={i % 2 ? 'saffron' : 'green'} size="lg" />
              <span className="min-w-0 flex-1">
                <h3 className="text-[18px] font-bold leading-snug text-green-900 group-hover:underline">{title}</h3>
                {lang === 'hi' && <span className="block text-[13px] font-semibold text-muted">{s.nameEn}</span>}
                <span className="mt-1 block text-[15px] text-muted">{lang === 'en' ? s.aboutEn : s.about}</span>
                <span className="mt-2 inline-flex items-center gap-1.5 text-[15px] font-semibold text-green-700">
                  <ExternalLink size={16} aria-hidden="true" />
                  {t('dsv.open')}
                  <span className="sr-only"> {t('link.newTab')}</span>
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
