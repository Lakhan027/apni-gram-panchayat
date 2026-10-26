'use client';

import { FileCheck2, Info, ListOrdered, MapPin } from 'lucide-react';
import Card from '@/components/ui/Card';
import IconTile from '@/components/ui/IconTile';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { ServiceGuide as Guide } from '@/lib/types';

/** Step-by-step guidance for a citizen service: what it is, papers to bring, how to apply, where to go. No form. */
export default function ServiceGuide({ guide }: { guide: Guide }) {
  const { t, lang } = useLang();
  const en = lang === 'en';
  const docs = en ? guide.documentsEn : guide.documents;
  const steps = en ? guide.stepsEn : guide.steps;
  const where = en ? guide.whereEn : guide.where;
  const heading = 'text-[20px] font-bold text-green-900';

  return (
    <div className="space-y-5">
      <Card className="p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-3">
          <IconTile icon={Info} />
          <h2 className={heading}>{t('guide.about')}</h2>
        </div>
        <p className="text-[16px] leading-[1.8] text-ink">{en ? guide.aboutEn : guide.about}</p>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card as="section" className="p-5 sm:p-6" aria-labelledby="guide-docs">
          <div className="mb-3 flex items-center gap-3">
            <IconTile icon={FileCheck2} tone="saffron" />
            <h2 id="guide-docs" className={heading}>
              {t('guide.documents')}
            </h2>
          </div>
          <ul className="space-y-2">
            {docs.map((d) => (
              <li key={d} className="flex gap-2 text-[16px] text-ink">
                <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-saffron" aria-hidden="true" />
                {d}
              </li>
            ))}
          </ul>
        </Card>

        <Card as="section" className="p-5 sm:p-6" aria-labelledby="guide-steps">
          <div className="mb-3 flex items-center gap-3">
            <IconTile icon={ListOrdered} />
            <h2 id="guide-steps" className={heading}>
              {t('guide.steps')}
            </h2>
          </div>
          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-3 text-[16px] text-ink">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-700 text-[14px] font-bold text-white">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <Card as="section" className="p-5 sm:p-6" aria-labelledby="guide-where">
        <div className="mb-3 flex items-center gap-3">
          <IconTile icon={MapPin} tone="saffron" />
          <h2 id="guide-where" className={heading}>
            {t('guide.where')}
          </h2>
        </div>
        <ul className="flex flex-wrap gap-2">
          {where.map((w) => (
            <li key={w} className="rounded-full bg-green-50 px-3 py-1.5 text-[15px] font-semibold text-green-900">
              {w}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[14px] text-muted">{t('guide.note')}</p>
      </Card>
    </div>
  );
}
