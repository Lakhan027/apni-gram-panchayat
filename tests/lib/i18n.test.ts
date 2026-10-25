// TDD: written before lib/i18n existed.
import { describe, expect, it } from 'vitest';
import { dictionary } from '@/lib/i18n/dictionary';
import { isLang, pick, translate } from '@/lib/i18n/translate';
import { formatDate, formatINRShort } from '@/lib/format';

describe('translate', () => {
  it('returns the text for the chosen language', () => {
    expect(translate('hi', 'nav.home')).toBe('होम');
    expect(translate('en', 'nav.home')).toBe('Home');
  });

  it('fills {placeholders}', () => {
    expect(translate('hi', 'works.found', { n: 4 })).toBe('4 कार्य मिले');
    expect(translate('en', 'works.found', { n: 4 })).toBe('4 works found');
  });

  it('falls back to the key itself for unknown keys instead of crashing', () => {
    // @ts-expect-error unknown key on purpose
    expect(translate('en', 'no.such.key')).toBe('no.such.key');
  });
});

describe('dictionary', () => {
  it('has the same keys in Hindi and English, none empty', () => {
    const hi = Object.keys(dictionary.hi).sort();
    const en = Object.keys(dictionary.en).sort();
    expect(en).toEqual(hi);
    for (const lang of ['hi', 'en'] as const) {
      for (const [k, v] of Object.entries(dictionary[lang])) expect(v.trim(), `${lang}.${k}`).not.toBe('');
    }
  });

  it('keeps the same {placeholders} in both languages', () => {
    const vars = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort();
    for (const k of Object.keys(dictionary.hi) as (keyof typeof dictionary.hi)[]) {
      expect(vars(dictionary.en[k]), k).toEqual(vars(dictionary.hi[k]));
    }
  });

  it('English text has no Devanagari left in it', () => {
    for (const [k, v] of Object.entries(dictionary.en)) expect(v, k).not.toMatch(/[ऀ-ॿ]/);
  });
});

describe('isLang / pick', () => {
  it('only accepts hi and en', () => {
    expect(isLang('hi')).toBe(true);
    expect(isLang('en')).toBe(true);
    expect(isLang('fr')).toBe(false);
    expect(isLang(null)).toBe(false);
  });
  it('pick returns English when present, otherwise the Hindi original', () => {
    expect(pick('en', 'सड़क', 'Road')).toBe('Road');
    expect(pick('en', 'सड़क', undefined)).toBe('सड़क');
    expect(pick('hi', 'सड़क', 'Road')).toBe('सड़क');
  });
});

describe('language-aware formatting', () => {
  it('formats dates in Hindi or English', () => {
    expect(formatDate('2026-11-15', 'hi')).toBe('15 नवम्बर 2026');
    expect(formatDate('2026-11-15', 'en')).toBe('15 November 2026');
    expect(formatDate(null, 'en')).toBe('—');
  });
  it('uses lakh/crore words in English', () => {
    expect(formatINRShort(650000, 'en')).toBe('₹6.5 lakh');
    expect(formatINRShort(12000000, 'en')).toBe('₹1.2 crore');
    expect(formatINRShort(650000)).toBe('₹6.5 लाख');
  });
});
