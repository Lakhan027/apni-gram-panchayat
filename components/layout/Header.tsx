'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';
import { LogIn, Menu, Search } from 'lucide-react';
import { NAV_LINKS, isActiveLink as isActive } from '@/lib/constants';
import { useLang } from '@/lib/i18n/LanguageProvider';
import type { SearchItem } from '@/lib/types';
import Logo from './Logo';
import MobileNav from './MobileNav';
import HeaderSearch from './HeaderSearch';
import LanguageToggle from './LanguageToggle';

export default function Header({ searchIndex }: { searchIndex: SearchItem[] }) {
  const pathname = usePathname() ?? '/';
  const { t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // MobileNav sits outside <header>: the header's backdrop-filter would otherwise trap its fixed positioning.
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="container-page flex min-h-[68px] items-center justify-between gap-3 md:min-h-[76px]">
          <Logo />
          <div className="flex shrink-0 items-center gap-2">
            <LanguageToggle className="hidden sm:inline-flex" />
            <button
              type="button"
              onClick={() => setSearchOpen((o) => !o)}
              aria-expanded={searchOpen}
              aria-controls="header-search"
              aria-label={t('header.search')}
              className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-line text-green-700 hover:bg-green-50"
            >
              <Search size={20} aria-hidden="true" />
            </button>
            <Link
              href="/admin"
              className="hidden min-h-[44px] items-center gap-2 rounded-[10px] bg-green-700 px-4 font-semibold text-white hover:bg-green-900 xl:inline-flex"
            >
              <LogIn size={18} aria-hidden="true" />
              {t('header.login')}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={t('header.openMenu')}
              className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-green-700 text-white hover:bg-green-900 lg:hidden"
            >
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </div>

        <nav aria-label={t('header.mainMenu')} className="hidden border-t border-line lg:block">
          <ul className="container-page flex flex-wrap items-center justify-center gap-x-1 gap-y-0 py-1.5 xl:gap-x-2">
            {NAV_LINKS.map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-[44px] items-center whitespace-nowrap rounded-[10px] px-1.5 text-[14px] font-semibold xl:px-3 xl:text-[16px] ${
                      active ? 'bg-green-50 text-green-900' : 'text-ink hover:bg-green-50 hover:text-green-900'
                    }`}
                  >
                    {t(l.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <HeaderSearch open={searchOpen} onClose={closeSearch} items={searchIndex} />
      </header>
      <MobileNav open={menuOpen} onClose={closeMenu} pathname={pathname} />
    </>
  );
}
