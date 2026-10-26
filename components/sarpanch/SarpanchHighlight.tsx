'use client';

import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { buttonClass } from '@/components/ui/Button';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { SarpanchProfile } from '@/lib/types';
import SarpanchPhoto from './SarpanchPhoto';

/** Highlighted "हमारे सरपंच" card on the home page, linking to /sarpanch. */
export default function SarpanchHighlight({ sarpanch: s }: { sarpanch: SarpanchProfile }) {
  const { t, lang } = useLang();
  const en = lang === 'en';
  const name = en ? s.nameEn : s.name;
  const p = s.place;
  return (
    <section aria-labelledby="sarpanch-title" className="container-page py-6 md:py-8">
      <div className="card flex flex-col items-center gap-6 border-l-[6px] border-l-saffron p-5 text-center sm:p-7 md:flex-row md:items-center md:text-left">
        <SarpanchPhoto src={s.photo} alt={t('sp.photo', { name })} size="md" />
        <div className="min-w-0 flex-1">
          <h2 id="sarpanch-title" className="text-[24px] font-extrabold leading-snug text-green-900 md:text-[30px]">
            {t('sp.title', { name })}
          </h2>
          <p className="mt-1 text-[15px] font-semibold text-muted">{en ? s.name : s.nameEn}</p>
          <p className="mt-2 inline-flex items-start gap-1.5 text-[15px] text-ink">
            <MapPin size={16} className="mt-1 shrink-0 text-green-700" aria-hidden="true" />
            {t('sp.place', {
              village: en ? p.villageEn : p.village,
              tehsil: en ? p.tehsilEn : p.tehsil,
              district: en ? p.districtEn : p.district,
              state: en ? p.stateEn : p.state,
            })}
          </p>
          <p className="mt-2 text-[17px] font-bold text-saffron-text">“{en ? s.mottoEn : s.motto}”</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
            {s.highlights.map((h) => (
              <li key={h.text} className="rounded-full bg-green-50 px-3 py-1 text-[14px] font-semibold text-green-900">
                {en ? h.textEn : h.text}
              </li>
            ))}
          </ul>
        </div>
        <Link href="/sarpanch" className={buttonClass('primary', 'lg', 'w-full shrink-0 md:w-auto')}>
          {t('sp.viewProfile')}
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
