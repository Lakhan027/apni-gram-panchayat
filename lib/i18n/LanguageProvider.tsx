'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_LANG, STORAGE_KEY, isLang, pick, translate, type Lang, type MessageKey, type Vars } from './translate';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({ lang: DEFAULT_LANG, setLang: () => {} });

/**
 * Pages are pre-rendered in Hindi. After load, the saved choice (if any) is applied in the browser.
 * Storage can be blocked (private mode), so every access is guarded.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isLang(saved)) setLangState(saved);
    } catch {
      // storage unavailable — stay on the default language
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // choice still applies for this visit
    }
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const { lang, setLang } = useContext(LanguageContext);
  const t = useCallback((key: MessageKey, vars?: Vars) => translate(lang, key, vars), [lang]);
  const p = useCallback((hi: string, en?: string | null) => pick(lang, hi, en), [lang]);
  return { lang, setLang, t, pick: p };
}
