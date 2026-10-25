import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { createElement, type ImgHTMLAttributes } from 'react';

afterEach(() => {
  // The static-export test runs in the node environment, where there is no DOM.
  if (typeof document === 'undefined') return;
  cleanup();
  document.body.style.overflow = '';
});

// usePathname is read by the header; tests override it with vi.mocked(usePathname).mockReturnValue(...)
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND');
  },
}));

// next/image needs the Next runtime; a plain <img> is enough for unit tests.
vi.mock('next/image', () => ({
  default: ({ fill: _fill, priority: _p, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) =>
    createElement('img', rest),
}));
