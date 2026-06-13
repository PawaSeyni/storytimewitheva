import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, useLanguage } from '../lib/language';
import type { Language } from '../lib/language';

interface LanguageSwitcherProps {
  /** When true, render as a stacked vertical list (mobile menu). Otherwise a horizontal pill cluster. */
  vertical?: boolean;
}

export default function LanguageSwitcher({ vertical = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language"
      className={
        vertical
          ? 'flex flex-col gap-1 mt-2'
          : 'flex items-center gap-1 rounded-full bg-purple-50 p-1'
      }
    >
      {SUPPORTED_LANGUAGES.map((lang: Language) => {
        const active = language === lang;
        const { name, flag } = LANGUAGE_LABELS[lang];
        const base = vertical
          ? 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all'
          : 'inline-flex items-center justify-center min-w-[44px] h-9 px-2 rounded-full text-sm transition-all';
        const activeCls = active
          ? vertical
            ? 'bg-purple-100 text-purple-700'
            : 'bg-purple-600 text-white shadow-sm scale-105'
          : vertical
            ? 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
            : 'text-gray-600 hover:bg-white';
        return (
          <button
            key={lang}
            type="button"
            onClick={() => setLanguage(lang)}
            aria-label={`Switch to ${name}`}
            aria-pressed={active}
            title={name}
            className={`${base} ${activeCls}`}
          >
            <span aria-hidden className="leading-none">
              {flag}
            </span>
            {vertical && <span>{name}</span>}
            {!vertical && <span className="text-xs uppercase font-semibold ml-1">{lang}</span>}
          </button>
        );
      })}
    </div>
  );
}
