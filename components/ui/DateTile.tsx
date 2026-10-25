'use client';

import { dateTileParts } from '@/lib/format';
import { useLang } from '@/lib/i18n/LanguageProvider';

export default function DateTile({ date, tone = 'green' }: { date: string; tone?: 'green' | 'saffron' }) {
  const { lang } = useLang();
  const p = dateTileParts(date, lang);
  const toneCls = tone === 'green' ? 'bg-green-50 text-green-900' : 'bg-saffron-50 text-saffron-text';
  return (
    <div
      className={`flex h-[68px] w-[64px] shrink-0 flex-col items-center justify-center rounded-xl leading-tight ${toneCls}`}
      aria-hidden="true"
    >
      <span className="text-[24px] font-extrabold leading-none">{p.day}</span>
      <span className="mt-1 text-[13px] font-semibold">{p.month}</span>
    </div>
  );
}
