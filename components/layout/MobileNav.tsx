'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { LogIn, X } from 'lucide-react';
import { NAV_LINKS, isActiveLink as isActive } from '@/lib/constants';
import { useLang } from '@/lib/i18n/LanguageProvider';
import LanguageToggle from './LanguageToggle';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
}

export default function MobileNav({ open, onClose, pathname }: MobileNavProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { t } = useLang();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => closeRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // Close when the route changes (link tap)
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-[visibility] duration-200 lg:hidden ${
        open ? 'visible' : 'pointer-events-none invisible'
      }`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-green-900/50 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label={t('header.mainMenu')}
        className={`absolute right-0 top-0 flex h-full w-[86%] max-w-[360px] flex-col bg-white shadow-xl transition-transform duration-200 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="text-[18px] font-bold text-green-900">{t('header.menu')}</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t('header.closeMenu')}
            tabIndex={open ? 0 : -1}
            className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-line text-ink hover:bg-green-50"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label={t('header.mobileMenu')} className="flex-1 overflow-y-auto px-3 py-3">
          <ul className="space-y-1">
            {NAV_LINKS.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={onClose}
                    tabIndex={open ? 0 : -1}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-[48px] items-center rounded-[10px] px-3 text-[17px] font-semibold ${
                      active ? 'bg-green-50 text-green-900' : 'text-ink hover:bg-green-50'
                    }`}
                  >
                    {t(l.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="space-y-2 border-t border-line p-4">
          <LanguageToggle className="w-full justify-center sm:hidden" />
          <Link
            href="/admin"
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-[10px] bg-green-700 font-semibold text-white hover:bg-green-900"
          >
            <LogIn size={18} aria-hidden="true" />
            {t('header.login')}
          </Link>
        </div>
      </div>
    </div>
  );
}
