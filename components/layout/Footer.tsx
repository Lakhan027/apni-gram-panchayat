'use client';

import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { NAV_LINKS, SITE } from '@/lib/constants';
import { useLang } from '@/lib/i18n/LanguageProvider';

export default function Footer() {
  const { t } = useLang();
  const office = [
    { icon: MapPin, text: t('ph.address') },
    { icon: Phone, text: t('ph.phone') },
    { icon: Mail, text: t('ph.email') },
    { icon: Clock, text: t('ph.hours') },
  ];
  return (
    <footer className="mt-16 bg-green-900 text-white">
      <div className="container-page grid grid-cols-1 gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="text-[20px] font-extrabold">{t('site.name')}</p>
          <p className="mt-2 text-white/85">
            {t('site.location', { village: SITE.village, tehsil: SITE.tehsil, district: SITE.district, state: t('site.state') })}
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-md bg-white/10 px-2.5 py-1 text-[14px] text-saffron-50">
            {t('site.tagline')}
          </p>
        </div>

        <nav aria-label={t('footer.quickLinks')}>
          <p className="mb-3 text-[17px] font-bold">{t('footer.quickLinks')}</p>
          <ul className="grid grid-cols-2 gap-x-4">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="flex min-h-[44px] items-center text-white/85 hover:text-white hover:underline">
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-3 text-[17px] font-bold">{t('footer.office')}</p>
          <ul className="space-y-3 text-white/85">
            {office.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-2">
                <Icon size={18} className="mt-1 shrink-0 text-saffron" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container-page py-5 text-[14px] text-white/80">
          <p>
            <strong className="text-saffron">{t('footer.disclaimerTitle')}</strong> {t('footer.disclaimer')}
          </p>
          <p className="mt-2">© {new Date().getFullYear()} {SITE.nameEn}</p>
        </div>
      </div>
    </footer>
  );
}
