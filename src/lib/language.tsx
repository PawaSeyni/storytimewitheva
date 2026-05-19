// Lightweight i18n. No external lib — a React context + two hooks.
//
// Components co-locate their own translations and call useTranslation(),
// which returns the slice for the current language. Pattern matches the
// original Base44 components' `t = text[language]` shape so ports stay
// close to source.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr';

export const SUPPORTED_LANGUAGES: Language[] = ['en', 'es', 'fr'];

export const LANGUAGE_LABELS: Record<Language, { name: string; flag: string }> = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
};

const STORAGE_KEY = 'preferredLanguage';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  setLanguage: () => {},
});

function detectInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  // 1. Honor any prior choice.
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'es' || stored === 'fr') return stored;
  } catch {
    /* localStorage might be blocked — fall through */
  }
  // 2. Detect from navigator.language ("en-US" → "en", "es-MX" → "es").
  const nav = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
  if (nav.startsWith('es')) return 'es';
  if (nav.startsWith('fr')) return 'fr';
  return 'en';
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => detectInitialLanguage());

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, []);

  // Keep the <html lang> attribute in sync. Crawlers and screen readers use it.
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}

/**
 * Co-located translation hook. Pass a `{ en, es, fr }` object; receive
 * the slice for the current language (with English fallback).
 *
 * Example:
 * const t = useTranslation({
 *   en: { title: 'Welcome' },
 *   es: { title: 'Bienvenido' },
 *   fr: { title: 'Bienvenue' },
 * });
 * <h1>{t.title}</h1>
 */
export function useTranslation<T extends Record<Language, unknown>>(translations: T): T[Language] {
  const { language } = useLanguage();
  return (translations[language] ?? translations.en) as T[Language];
}
