import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { dictionary } from '@/lib/i18n/dictionary';

// Visitors must never see "[… सत्यापन हेतु]" style placeholder text.
const PLACEHOLDER = /\[[^\]]+\]|सत्यापन हेतु|to be verified/i;

function strings(v: unknown, path: string, out: [string, string][]) {
  if (typeof v === 'string') out.push([path, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${path}[${i}]`, out));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) strings(x, `${path}.${k}`, out);
  return out;
}

describe('No placeholder text', () => {
  it('no data file contains [placeholder] or "to be verified" text', () => {
    const dir = join(process.cwd(), 'data');
    const hits = readdirSync(dir)
      .filter((f) => f.endsWith('.json'))
      .flatMap((f) => strings(JSON.parse(readFileSync(join(dir, f), 'utf-8')), f, []))
      .filter(([, s]) => PLACEHOLDER.test(s));
    expect(hits).toEqual([]);
  });

  it('no dictionary value contains [placeholder] text', () => {
    const hits = (['hi', 'en'] as const).flatMap((l) => Object.entries(dictionary[l]).filter(([, s]) => PLACEHOLDER.test(s)).map(([k]) => `${l}.${k}`));
    expect(hits).toEqual([]);
  });
});
