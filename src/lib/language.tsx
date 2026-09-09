// Lightweight i18n. No external lib — a React context + two hooks.
//
// Components co-locate their own translations and call useTranslation(),
// which returns the slice for the current language. Pattern matches the
// original Base44 components' `t = text[language]` shape so ports stay
// close to source.

import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { SHARED_KEYS, setSharedString } from './storage';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// The registry (S8-019) owns the language list, prefixes and labels; this module keeps its
// public names so every existing import still works.
import { LOCALES, LANGUAGES, LANGUAGE_LABELS, splitLangFromPath, localizePath, type Language } from './locales';
export type { Language };
export { LANGUAGE_LABELS, splitLangFromPath, localizePath, LOCALES };
export const SUPPORTED_LANGUAGES: Language[] = LANGUAGES;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  setLanguage: () => {},
});

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // The URL is the source of truth for the active language.
  const { lang: language } = splitLangFromPath(location.pathname);

  // Switching language keeps you on the same page, just under the new prefix.
  const setLanguage = useCallback(
    (next: Language) => {
      const { rest } = splitLangFromPath(window.location.pathname);
      navigate(localizePath(rest, next) + window.location.search + window.location.hash);
      // Through the adapter (S6-012), which never throws. The key stays raw and
      // unversioned in the SHARED tier because public/games/i18n.js reads it directly.
      setSharedString(SHARED_KEYS.language, next);
    },
    [navigate],
  );

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
