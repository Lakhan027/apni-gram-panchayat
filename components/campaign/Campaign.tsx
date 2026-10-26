'use client';

// Election-campaign parts shown on every page. Each one renders nothing when data/campaign.json has "enabled": false.
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, FileText, Share2 } from 'lucide-react';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { Campaign } from '@/lib/types';

const GOALS_HREF = '/sarpanch/#sp-goals';
const POSTER_HREF = '/sarpanch/#sp-poster';

function Photo({ campaign, size }: { campaign: Campaign; size: number }) {
  return (
    <Image
      src={campaign.photo}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover object-top ring-2 ring-saffron"
      style={{ width: size, height: size }}
    />
  );
}

/** Slim strip under the header. */
export function CampaignBar({ campaign }: { campaign: Campaign }) {
  const { t, pick } = useLang();
  if (!campaign.enabled) return null;
  return (
    <section aria-label={t('camp.region')} className="border-b border-saffron/40 bg-saffron-50">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 py-2 text-center sm:justify-between sm:text-left">
        <p className="flex min-w-0 items-center gap-2.5 text-[14px] text-saffron-text md:text-[15px]">
          <Photo campaign={campaign} size={32} />
          <span>
            <strong className="text-green-900">{pick(campaign.name, campaign.nameEn)}</strong>
            <span className="hidden sm:inline"> — {pick(campaign.slogan, campaign.sloganEn)}</span>
          </span>
        </p>
        <Link
          href={GOALS_HREF}
          className="inline-flex min-h-[36px] items-center gap-1 rounded-full bg-green-700 px-3.5 text-[14px] font-semibold text-white hover:bg-green-900"
        >
          {t('camp.goals')}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

/** Card at the top of the footer with a WhatsApp share button. */
export function CampaignFooter({ campaign }: { campaign: Campaign }) {
  const { t, pick } = useLang();
  const name = pick(campaign.name, campaign.nameEn);
  if (!campaign.enabled) return null;
  const shareText = `${t('camp.shareText', { name })} ${campaign.shareUrl}`;
  return (
    <div className="border-b border-white/15">
      <div className="container-page flex flex-col items-center gap-4 py-8 text-center md:flex-row md:text-left">
        <Photo campaign={campaign} size={72} />
        <div className="min-w-0 flex-1">
          <p className="text-[20px] font-extrabold">{name}</p>
          <p className="text-saffron-50">{pick(campaign.slogan, campaign.sloganEn)}</p>
          <p className="mt-1 text-[13px] text-white/70">{t('camp.note')}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={POSTER_HREF}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] bg-saffron px-4 font-semibold text-green-900 hover:bg-saffron-50"
          >
            <FileText size={18} aria-hidden="true" />
            {t('camp.poster')}
          </Link>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] border-2 border-white/70 px-4 font-semibold text-white hover:bg-white/10"
          >
            <Share2 size={18} aria-hidden="true" />
            {t('camp.share')}
            <span className="sr-only"> {t('link.newTab')}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

/** Sticky "संकल्प पत्र" button, phones only. */
export function CampaignFab({ campaign }: { campaign: Campaign }) {
  const { t } = useLang();
  if (!campaign.enabled) return null;
  return (
    <Link
      href={POSTER_HREF}
      className="fixed bottom-4 right-4 z-40 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-saffron px-4 font-bold text-green-900 shadow-lg ring-2 ring-white md:hidden"
    >
      <FileText size={18} aria-hidden="true" />
      {t('camp.poster')}
    </Link>
  );
}
