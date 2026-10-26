'use client';

import Image from 'next/image';
import { Building2, ExternalLink, CheckCircle2, Clock, Droplets, Home, ListChecks, MapPin, School, Sprout, UserRound, Users, type LucideIcon } from 'lucide-react';
import Card from '@/components/ui/Card';
import IconTile from '@/components/ui/IconTile';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { SarpanchProfile as Profile } from '@/lib/types';
import SarpanchPhoto from './SarpanchPhoto';

const GROUP_ICONS: Record<string, LucideIcon> = { users: Users, building: Building2, droplets: Droplets, school: School, home: Home, sprout: Sprout };
const heading = 'text-[20px] font-bold text-green-900 md:text-[22px]';

/** Full Sarpanch profile: photo, names, place, introduction, responsibilities, goals and (verified) works. */
export default function SarpanchProfile({ sarpanch: s }: { sarpanch: Profile }) {
  const { t, lang } = useLang();
  const en = lang === 'en';
  const p = s.place;

  return (
    <div className="space-y-6">
      <Card className="flex flex-col items-center gap-6 p-6 text-center sm:p-8 md:flex-row md:text-left">
        <SarpanchPhoto src={s.photo} alt={t('sp.photo', { name: en ? s.nameEn : s.name })} size="lg" />
        <div className="min-w-0">
          <p className="inline-block rounded-full bg-saffron-50 px-3 py-0.5 text-[14px] font-bold text-saffron-text">
            {t('sp.role', { village: en ? p.villageEn : p.village })}
          </p>
          <p className="mt-2 text-[30px] font-extrabold leading-tight text-green-900 md:text-[38px]">{s.name}</p>
          <p className="text-[20px] font-bold text-green-700">{s.nameEn}</p>
          <p className="mt-3 inline-flex items-start gap-1.5 text-[16px] text-ink">
            <MapPin size={18} className="mt-1 shrink-0 text-green-700" aria-hidden="true" />
            {t('sp.place', {
              village: en ? p.villageEn : p.village,
              tehsil: en ? p.tehsilEn : p.tehsil,
              district: en ? p.districtEn : p.district,
              state: en ? p.stateEn : p.state,
            })}
          </p>
          <p className="mt-3 text-[18px] font-bold text-saffron-text">“{en ? s.mottoEn : s.motto}”</p>
          <p className="text-[15px] font-semibold text-muted">{en ? s.promiseEn : s.promise}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-3">
            <IconTile icon={UserRound} />
            <h2 className={heading}>{t('sp.intro')}</h2>
          </div>
          <p className="text-[16px] leading-[1.8] text-ink">{en ? s.introEn : s.intro}</p>
        </Card>
        <Card className="p-5 sm:p-6">
          <div className="mb-3 flex items-center gap-3">
            <IconTile icon={ListChecks} tone="saffron" />
            <h2 className={heading}>{t('sp.duties')}</h2>
          </div>
          <ul className="space-y-2">
            {(en ? s.responsibilitiesEn : s.responsibilities).map((r) => (
              <li key={r} className="flex gap-2 text-[16px] text-ink">
                <CheckCircle2 size={18} className="mt-1 shrink-0 text-green-700" aria-hidden="true" />
                {r}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <section aria-labelledby="sp-goals">
        <h2 id="sp-goals" className="text-[24px] font-bold text-green-900 md:text-[30px]">
          {t('sp.goals')}
        </h2>
        <p className="mb-4 mt-1 text-muted">{t('sp.goalsSub')}</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {s.goalGroups.map((g, i) => (
            <Card key={g.id} className="p-5">
              <div className="mb-3 flex items-center gap-3">
                <IconTile icon={GROUP_ICONS[g.icon] ?? ListChecks} tone={i % 2 ? 'saffron' : 'green'} />
                <h3 className="text-[18px] font-bold text-green-900">{en ? g.titleEn : g.title}</h3>
              </div>
              <ol className="space-y-3">
                {g.goals.map((goal) => (
                  <li key={goal.n} className="flex gap-3 text-[15px] text-ink">
                    <span data-testid="goal-number" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-700 text-[13px] font-bold text-white">
                      {goal.n}
                    </span>
                    <span>
                      {goal.title && <strong className="text-green-900">{en ? goal.titleEn : goal.title} — </strong>}
                      {en ? goal.textEn : goal.text}
                    </span>
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="sp-poster">
        <h2 id="sp-poster" className="mb-4 text-[24px] font-bold text-green-900 md:text-[30px]">
          {t('sp.poster')}
        </h2>
        <Card className="mx-auto max-w-xl p-3 sm:p-4">
          <a href={s.poster} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl">
            <Image src={s.poster} alt={`${t('sp.poster')} — ${en ? s.nameEn : s.name}`} width={1131} height={1600} sizes="(min-width: 640px) 576px, 100vw" className="h-auto w-full" />
          </a>
          <a
            href={s.poster}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-[44px] items-center gap-2 font-semibold text-green-700 hover:underline"
          >
            <ExternalLink size={18} aria-hidden="true" /> {t('sp.posterOpen')}
            <span className="sr-only"> {t('link.newTab')}</span>
          </a>
        </Card>
      </section>

      {s.works.length > 0 && (
        <section aria-labelledby="sp-works">
          <h2 id="sp-works" className="mb-4 text-[24px] font-bold text-green-900 md:text-[30px]">
            {t('sp.works')}
          </h2>
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {s.works.map((w) => (
              <li key={w.title} className="card flex items-center gap-3 p-4">
                {w.status === 'completed' ? (
                  <CheckCircle2 size={20} className="shrink-0 text-status-doneText" aria-hidden="true" />
                ) : (
                  <Clock size={20} className="shrink-0 text-status-progressText" aria-hidden="true" />
                )}
                <span className="flex-1 font-semibold text-ink">{en ? w.titleEn : w.title}</span>
                <span className="text-[13px] font-bold text-muted">{t(w.status === 'completed' ? 'sp.completed' : 'sp.inProgress')}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
