'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Phone, UserRound } from 'lucide-react';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { Member } from '@/lib/types';

/** Order on the card: photo, पद, नाम, मोबाइल नंबर. */
export default function MemberCard({ member }: { member: Member }) {
  const { t, lang } = useLang();
  const name = lang === 'en' ? member.nameEn : member.name;
  const role = t(`role.${member.role}`);
  // Masked sample numbers (with X) are shown as text, never as a call link.
  const callable = !/x/i.test(member.mobile);

  return (
    <article className="card flex h-full flex-col items-center p-5 text-center">
      <div
        data-avatar
        className="relative mb-3 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-green-50 text-green-700 ring-[3px] ring-saffron ring-offset-2"
      >
        {member.photo ? (
          <Image src={member.photo} alt={t('members.photo', { name })} fill sizes="96px" className="object-cover" loading="lazy" />
        ) : (
          <UserRound size={52} aria-hidden="true" />
        )}
      </div>
      <p className="rounded-full bg-saffron-50 px-3 py-0.5 text-[14px] font-bold text-saffron-text">
        {role}
        {member.ward !== null && ` — ${t('members.wardOf', { n: member.ward })}`}
      </p>
      <h3 className="mt-2 break-words text-[19px] font-bold leading-snug text-green-900">{name}</h3>
      <p className="mt-2 text-[13px] text-muted">{t('members.mobile')}</p>
      {callable ? (
        <a href={`tel:${member.mobile.replace(/\s/g, '')}`} className="inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-green-700 hover:underline">
          <Phone size={16} aria-hidden="true" /> {member.mobile}
        </a>
      ) : (
        <p className="inline-flex min-h-[32px] items-center gap-1.5 font-semibold text-ink" dir="ltr">
          <Phone size={16} className="text-green-700" aria-hidden="true" /> {member.mobile}
        </p>
      )}
      {member.role === 'sarpanch' && (
        <Link href="/sarpanch" className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-green-700 hover:underline">
          {t('sp.viewProfile')} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}
