import { dictionary, type MessageKey } from './dictionary';

export type Lang = 'hi' | 'en';
export type Vars = Record<string, string | number>;
export type { MessageKey };

export const DEFAULT_LANG: Lang = 'hi';
export const STORAGE_KEY = 'agp-lang';

export function isLang(value: unknown): value is Lang {
  return value === 'hi' || value === 'en';
}

/** Looks up a UI string and fills {placeholders}. Unknown keys return the key, never throw. */
export function translate(lang: Lang, key: MessageKey, vars?: Vars): string {
  const text: string = dictionary[lang][key] ?? dictionary.hi[key] ?? key;
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

/** Chooses the English version of a data field when one exists, else the Hindi original. */
export function pick(lang: Lang, hi: string, en?: string | null): string {
  return lang === 'en' && en ? en : hi;
}
