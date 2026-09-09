// Locale REGISTRY (Sprint 8 S8-019) — BROWSER-FREE, the one place a language is declared.
//
// Everything that varies by language derives from this list: the `Language` type, the
// URL prefixes App.tsx mounts the route table under, canonical/hreflang/og:locale in Seo,
// Intl and speech locales, the language switcher labels, and the build scripts (sitemap,
// prerender, redirects, inventories) through scripts/lib/catalog.mjs. Adding a language is
// one entry here plus translations (the `Record<Language, …>` tables fail to type-check
// until they exist), content fields, and the static games' own i18n.js. No route or
// component is copied per language; tests/funnel/locales.test.mjs proves it with a
// temporary test locale.

export interface LocaleDef {
  /** Language code, also the hreflang value. */
  code: string;
  /** URL prefix; '' for the default language at the root. */
  prefix: string;
  name: string;
  flag: string;
  /** BCP 47 tag for Intl formatting and speech synthesis. */
  intl: string;
  /** Open Graph locale. */
  ogLocale: string;
}

export const LOCALES = [
  { code: 'en', prefix: '', name: 'English', flag: '🇺🇸', intl: 'en-US', ogLocale: 'en_US' },
  { code: 'es', prefix: '/es', name: 'Español', flag: '🇪🇸', intl: 'es-ES', ogLocale: 'es_ES' },
  { code: 'fr', prefix: '/fr', name: 'Français', flag: '🇫🇷', intl: 'fr-FR', ogLocale: 'fr_FR' },
] as const satisfies readonly LocaleDef[];

export type Language = (typeof LOCALES)[number]['code'];
export const DEFAULT_LANGUAGE: Language = 'en';
export const LANGUAGES: Language[] = LOCALES.map((l) => l.code);
export const LANG_PREFIXES: string[] = LOCALES.map((l) => l.prefix);

export function isLanguage(x: unknown): x is Language {
  return typeof x === 'string' && (LANGUAGES as string[]).includes(x);
}
const def = (lang: Language): LocaleDef => LOCALES.find((l) => l.code === lang) ?? LOCALES[0];
export const prefixOf = (lang: Language): string => def(lang).prefix;
export const intlLocale = (lang: Language): string => def(lang).intl;
export const ogLocale = (lang: Language): string => def(lang).ogLocale;
export const LANGUAGE_LABELS: Record<Language, { name: string; flag: string }> = Object.fromEntries(
  LOCALES.map((l) => [l.code, { name: l.name, flag: l.flag }]),
) as Record<Language, { name: string; flag: string }>;

// ---- Parametric helpers: the registry is an argument so a test can prove a fourth
// ---- locale needs nothing but an entry. The exported defaults bind LOCALES.

export function splitLangFromPathWith<L extends LocaleDef>(pathname: string, locales: readonly L[]): { lang: L['code']; rest: string } {
  const seg = '/' + (pathname.split('/')[1] ?? '');
  const hit = locales.find((l) => l.prefix !== '' && l.prefix === seg);
  if (hit) {
    const rest = pathname.slice(hit.prefix.length);
    return { lang: hit.code, rest: rest === '' ? '/' : rest };
  }
  const root = locales.find((l) => l.prefix === '') ?? locales[0];
  return { lang: root.code, rest: pathname || '/' };
}

export function localizePathWith<L extends LocaleDef>(path: string, lang: L['code'], locales: readonly L[]): string {
  const prefix = locales.find((l) => l.code === lang)?.prefix ?? '';
  if (prefix === '') return path;
  if (path === '/') return prefix;
  return `${prefix}${path}`;
}

/** Every route × every locale prefix, the way App.tsx mounts and the prerender walks them. */
export function routesForLocales<L extends LocaleDef>(paths: readonly string[], locales: readonly L[] = LOCALES as unknown as readonly L[]): string[] {
  return locales.flatMap((l) => paths.map((p) => (p === '/' ? l.prefix || '/' : `${l.prefix}${p}`)));
}

/** hreflang alternates for an English-canonical path, plus x-default on the root locale. */
export function hreflangFor<L extends LocaleDef>(enPath: string, canonical: (p: string) => string, locales: readonly L[] = LOCALES as unknown as readonly L[]): { hreflang: string; href: string }[] {
  const root = locales.find((l) => l.prefix === '') ?? locales[0];
  return [
    ...locales.map((l) => ({ hreflang: l.code, href: canonical(localizePathWith(enPath, l.code, locales)) })),
    { hreflang: 'x-default', href: canonical(localizePathWith(enPath, root.code, locales)) },
  ];
}

export const splitLangFromPath = (pathname: string) => splitLangFromPathWith(pathname, LOCALES);
export const localizePath = (path: string, lang: Language) => localizePathWith(path, lang, LOCALES);
