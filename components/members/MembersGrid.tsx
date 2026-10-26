'use client';

import { useLang } from '@/lib/i18n/LanguageProvider';
import type { Member } from '@/lib/types';
import MemberCard from './MemberCard';

const grid = 'grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4';

/** Officials first, then a separate card for every ward panch. */
export default function MembersGrid({ members }: { members: Member[] }) {
  const { t } = useLang();
  const officials = members.filter((m) => m.role !== 'ward-panch');
  const wardPanchs = members.filter((m) => m.role === 'ward-panch');
  return (
    <div className="space-y-10">
      <section aria-labelledby="officials">
        <h2 id="officials" className="mb-4 text-[22px] font-bold text-green-900 md:text-[26px]">
          {t('members.officials')}
        </h2>
        <ul className={grid}>
          {officials.map((m) => (
            <li key={m.id}>
              <MemberCard member={m} />
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="ward-panchs">
        <h2 id="ward-panchs" className="mb-4 text-[22px] font-bold text-green-900 md:text-[26px]">
          {t('members.wardPanchs')}
        </h2>
        <ul className={grid}>
          {wardPanchs.map((m) => (
            <li key={m.id}>
              <MemberCard member={m} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
