'use client';

import { MapPin } from 'lucide-react';
import { SITE } from '@/lib/constants';
import { useLang } from '@/lib/i18n/LanguageProvider';

export default function TopStrip() {
  const { t } = useLang();
  return (
    <div className="top-strip bg-green-900 text-white">
      <div className="container-page flex min-h-[36px] items-center justify-center py-1.5 text-[13px] sm:justify-start md:text-[14px]">
        <p className="flex items-center gap-1.5 text-center">
          <MapPin size={15} className="shrink-0 text-saffron" aria-hidden="true" />
          {t('site.location', { village: SITE.village, tehsil: SITE.tehsil, district: SITE.district, state: t('site.state') })}
        </p>
      </div>
    </div>
  );
}
