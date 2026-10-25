'use client';

// Small client leaves so server components can render language-aware text.
import { formatDate, formatINRShort } from '@/lib/format';
import { useLang } from './LanguageProvider';
import type { MessageKey, Vars } from './translate';

/** UI string from the dictionary. */
export function T({ k, vars }: { k: MessageKey; vars?: Vars }) {
  const { t } = useLang();
  return <>{t(k, vars)}</>;
}

/** Data text: English when the record has it, otherwise the Hindi original. */
export function L({ hi, en }: { hi: string; en?: string | null }) {
  const { pick } = useLang();
  return <>{pick(hi, en)}</>;
}

export function DateText({ iso }: { iso: string | null | undefined }) {
  const { lang } = useLang();
  return <>{formatDate(iso, lang)}</>;
}

export function ShortINR({ amount }: { amount: number | null | undefined }) {
  const { lang } = useLang();
  return <>{formatINRShort(amount, lang)}</>;
}
