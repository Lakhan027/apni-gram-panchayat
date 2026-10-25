// @vitest-environment node
// Integration: checks the real `next build` output in out/. Run with `npm run test:build`
// (it builds first); skipped when out/ does not exist.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { allRoutes } from './routes';

const OUT = join(process.cwd(), 'out');
const fileFor = (route: string) => join(OUT, route === '/' ? 'index.html' : `${route.slice(1)}/index.html`);
const read = (route: string) => readFileSync(fileFor(route), 'utf8');

function allHtml(dir = OUT): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return f === '_next' ? [] : allHtml(p);
    return f.endsWith('.html') ? [p] : [];
  });
}

describe.skipIf(!existsSync(OUT))('static export (out/)', () => {
  it('has an index.html for every route plus 404.html', async () => {
    for (const r of await allRoutes()) expect(existsSync(fileFor(r)), r).toBe(true);
    expect(existsSync(join(OUT, '404.html'))).toBe(true);
  });

  it('every page is Hindi, titled and has one h1 and the skip link', async () => {
    for (const r of await allRoutes()) {
      const html = read(r);
      expect(html, r).toMatch(/<html lang="hi"/);
      expect(html, r).toMatch(/<title>[^<]+<\/title>/);
      expect(html.match(/<h1[\s>]/g) ?? [], r).toHaveLength(1);
      expect(html, r).toContain('href="#main"');
    }
  });

  it('every internal link and asset in the HTML resolves to a file in out/', () => {
    const missing: string[] = [];
    for (const file of allHtml()) {
      const html = readFileSync(file, 'utf8');
      for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
        const target = join(OUT, decodeURIComponent(url));
        const ok = existsSync(target) && (statSync(target).isFile() || existsSync(join(target, 'index.html')));
        if (!ok) missing.push(`${file.replace(OUT, '')} → ${url}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('pre-rendered HTML already contains the data (no client fetch needed)', () => {
    expect(read('/works/W-001')).toContain('वार्ड 3 मुख्य मार्ग सीसी सड़क निर्माण');
    expect(read('/budget')).toContain('₹39,55,000');
    expect(read('/')).toContain('15 नवम्बर 2026');
  });

  it('never ships Aadhaar-like or phone-like numbers', () => {
    for (const file of allHtml()) {
      const text = readFileSync(file, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '');
      expect(text, file).not.toMatch(/(?<![\d-])\d{4}\s?\d{4}\s?\d{4}(?!\d)/);
    }
  });
});
