'use client';

import { ArrowRight, BadgeCheck, Images, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import { SITE } from '@/lib/constants';
import { useLang } from '@/lib/i18n/LanguageProvider';
import Image from 'next/image';

export default function Hero() {
  const { t, lang } = useLang();
  return (
    <section aria-labelledby="hero-title" className="bg-green-50">
      <div className="container-page grid grid-cols-1 items-center gap-8 py-10 md:py-14 lg:grid-cols-2 lg:gap-12 lg:py-16 2xl:py-20">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-700/30 bg-white px-3 py-1 text-[14px] font-semibold text-green-700">
            <BadgeCheck size={16} aria-hidden="true" />
            {t('home.pill')}
          </span>
          <h1 id="hero-title" className="mt-4 text-[36px] font-extrabold leading-[1.3] text-green-900 md:text-[46px] lg:text-[56px]">
            {t('home.title')} <span className="text-green-700">{lang === 'en' ? t('site.village').toUpperCase() : t('site.village')}</span>
          </h1>
          <p className="mt-3 text-[16px] font-medium text-ink md:text-[18px]">
            {t('home.place', { village: t('site.village'), tehsil: SITE.tehsil, district: SITE.district, state: t('site.state') })}
          </p>
          <p className="mt-2 text-[18px] font-bold text-saffron-text md:text-[20px]">{t('site.tagline')}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/members" size="lg" className="w-full sm:w-auto">
              <Users size={20} aria-hidden="true" />
              {t('nav.members')}
              <ArrowRight size={20} aria-hidden="true" />
            </Button>
            <Button href="/gallery" size="lg" variant="outline" className="w-full sm:w-auto">
              <Images size={20} aria-hidden="true" />
              {t('nav.gallery')}
            </Button>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[560px]">
          <div className="relative aspect-square overflow-hidden rounded-[20px] border-4 border-white shadow-lg">
            <Image
              src="/images/gallery/panchayat-bhawan-appliyas.jpg"
              alt={t('home.illustration')}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
      <div className="h-2 bg-saffron" aria-hidden="true" />
    </section>
  );
}
