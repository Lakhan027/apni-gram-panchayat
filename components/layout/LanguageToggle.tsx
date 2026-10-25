'use client';

import { Languages } from 'lucide-react';
import { useLang } from '@/lib/i18n/LanguageProvider';

/** Always labelled in the language you would switch TO, so either reader can find it. */
export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang();
  const toEnglish = lang === 'hi';
  return (
    <button
      type="button"
      onClick={() => setLang(toEnglish ? 'en' : 'hi')}
      aria-label={toEnglish ? 'Switch to English' : 'हिंदी में बदलें'}
      className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-[10px] border border-line px-3 text-[15px] font-semibold text-green-700 hover:bg-green-50 ${className}`}
    >
      <Languages size={18} aria-hidden="true" />
      <span lang={toEnglish ? 'en' : 'hi'}>{toEnglish ? 'English' : 'हिंदी'}</span>
    </button>
  );
}
