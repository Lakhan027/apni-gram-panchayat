'use client';

import Image from 'next/image';
import { useLang } from '@/lib/i18n/LanguageProvider';

export default function WorksitePhotos({ photos }: { photos: string[] }) {
  const { t } = useLang();
  return (
    <>
      <ul className="grid grid-cols-2 gap-3">
        {photos.map((src, i) => (
          <li key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-green-50">
            <Image src={src} alt={t('mg.photoAlt', { n: i + 1 })} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" loading="lazy" />
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[13px] text-muted">{t('common.symbolicPhotos')}</p>
    </>
  );
}
