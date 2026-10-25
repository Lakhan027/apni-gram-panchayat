'use client';

import { useLang } from '@/lib/i18n/LanguageProvider';

/** Muted list of admin features planned for later. */
export default function AdminUpcomingList() {
  const { t } = useLang();
  return (
    <div className="mt-6 rounded-xl bg-ground p-4 text-left">
      <p className="mb-2 text-[14px] font-semibold text-muted">{t('admin.later')}</p>
      <ul className="grid grid-cols-1 gap-x-4 gap-y-1 text-[15px] text-muted min-[400px]:grid-cols-2">
        {t('admin.items')
          .split('|')
          .map((u) => (
            <li key={u} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted/60" aria-hidden="true" />
              {u}
            </li>
          ))}
      </ul>
    </div>
  );
}
