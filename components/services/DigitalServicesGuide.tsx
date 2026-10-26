'use client';

import { ShieldAlert } from 'lucide-react';
import Card from '@/components/ui/Card';
import { useLang } from '@/lib/i18n/LanguageProvider';

/** Short "how to use these websites" guide shown above the डिजिटल सेवाएँ links. */
export default function DigitalServicesGuide() {
  const { t } = useLang();
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-[20px] font-bold text-green-900">{t('dsv.howTitle')}</h2>
      <ol className="mt-3 space-y-2.5">
        {t('dsv.howSteps')
          .split('|')
          .map((s, i) => (
            <li key={s} className="flex gap-3 text-[16px] text-ink">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-700 text-[14px] font-bold text-white">
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
      </ol>
      <p className="mt-4 flex gap-2 rounded-[10px] border border-saffron/50 bg-saffron-50 p-3 text-[15px] font-medium text-saffron-text">
        <ShieldAlert size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
        {t('dsv.safety')}
      </p>
    </Card>
  );
}
