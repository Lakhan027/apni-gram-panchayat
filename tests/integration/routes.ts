// Every route the static site exports, built from the same data layer the pages use.
import { getSchemes, getWorks } from '@/lib/data';

export const STATIC_ROUTES = [
  '/',
  '/about',
  '/works',
  '/mgnrega',
  '/budget',
  '/gram-sabha',
  '/schemes',
  '/notices',
  '/complaints',
  '/contact',
  '/admin',
];

export async function allRoutes(): Promise<string[]> {
  const [works, schemes] = await Promise.all([getWorks(), getSchemes()]);
  return [...STATIC_ROUTES, ...works.map((w) => `/works/${w.id}`), ...schemes.map((s) => `/schemes/${s.id}`)];
}

/** True when an internal href (with optional #hash / trailing slash) points at a real route. */
export function resolves(href: string, routes: string[]): boolean {
  const path = href.split('#')[0].replace(/\/$/, '') || '/';
  return routes.includes(path);
}
