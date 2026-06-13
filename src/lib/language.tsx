// Lightweight i18n. No external lib — a React context + two hooks.
//
// Components co-locate their own translations and call useTranslation(),
// which returns the slice for the current language. Pattern matches the
// original Base44 components' `t = text[language]` shape so ports stay
// close to source.

import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type Language = 'en' | 'es' | 'fr';

export const SUPPORTED_LANGUAGES: Language[] = ['en', 'es', 'fr'];

// URL scheme: English lives at the root (/books); Spanish and French use a
// path prefix (/es/books, /fr/books). These two helpers are the single source
// of truth for translating between an English "canonical" app path and the
// language-prefixed URL actually shown in the address bar.

/** Split a real pathname into its language and the English-canonical remainder. */
export function splitLangFromPath(pathname: string): { lang: Language; rest: string } {
  const seg = pathname.split('/')[1];
  if (seg === 'es' || seg === 'fr') {
    const rest = pathname.slice(seg.length + 1);
    return { lang: seg, rest: rest === '' ? '/' : rest };
  }
  return { lang: 'en', rest: pathname || '/' };
}

/** Build the language-prefixed URL for an English-canonical app path. */
export function localizePath(path: string, lang: Language): string {
  if (lang === 'en') return path;
  if (path === '/') return `/${lang}`;
  return `/${lang}${path}`;
}

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
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
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
