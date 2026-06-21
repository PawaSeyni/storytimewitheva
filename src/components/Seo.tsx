import { useMemo } from 'react';
import { SUPPORTED_LANGUAGES, localizePath, useLanguage } from '../lib/language';
import { useHead } from '../lib/head';

const SITE_URL = 'https://storytimewitheva.com';
const SITE_NAME = 'Story Time with Eva';
// Self-hosted so social cards never depend on an external CDN (Amazon) that
// could rotate or hot-link-block the asset. 1200x900 brand image in /public.
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

const OG_LOCALE: Record<'en' | 'es' | 'fr', string> = {
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
};

interface SeoProps {
  /** Page-specific title. Will be rendered as `${title} | Story Time with Eva` unless `bare` is true. */
  title: string;
  description: string;
  /** Absolute URL of an OG/Twitter image. Defaults to the self-hosted brand image. */
  image?: string;
  /** og:image pixel dimensions, when known. Defaults to 1200×900 for the brand image. */
  imageWidth?: number;
  imageHeight?: number;
  /** English-canonical app path (e.g. "/books"). Canonical + hreflang are derived per language. */
  path?: string;
  /** Set to true to render the title verbatim (no site suffix). Use only on the home page. */
  bare?: boolean;
  /** Discourage indexing on personal/utility pages (e.g. /profile, 404). Suppresses hreflang. */
  noindex?: boolean;
}

/**
 * Per-route head manager. Renders nothing; side-effects only.
 *
 * Previously implemented with react-helmet-async; replaced with a custom
 * `useHead` hook after Helmet stopped injecting tags on the production Vite
 * build (see src/lib/head.ts header comment). The HTML `lang` attribute is
 * managed separately by LanguageProvider's effect, so Seo doesn't touch it.
 */
export default function Seo({ title, description, image = DEFAULT_IMAGE, imageWidth, imageHeight, path, bare = false, noindex = false }: SeoProps) {
  const { language } = useLanguage();
  // The brand image is a known 1200×900; custom per-page images omit dimensions
  // unless the caller supplies them.
  const resolvedWidth = imageWidth ?? (image === DEFAULT_IMAGE ? 1200 : undefined);
  const resolvedHeight = imageHeight ?? (image === DEFAULT_IMAGE ? 900 : undefined);
  const fullTitle = bare ? title : `${title} | ${SITE_NAME}`;
  const enPath = path ?? '/';

  // Canonical points to THIS language's URL; hreflang advertises all three
  // (plus x-default → English) so search engines index each language version.
  // Netlify serves prerendered pages at a trailing slash (and 301s /faq →
  // /faq/), so the canonical/hreflang/sitemap URLs use that slashed form to
  // match exactly. Internal links/routing stay slashless (React Router matches
  // both). Root stays "/".
  const canonical = (p: string) => (p === '/' ? `${SITE_URL}/` : `${SITE_URL}${p}/`);
  const url = canonical(localizePath(enPath, language));
  const alternates = useMemo(() => {
    if (noindex) return [];
    return [
      ...SUPPORTED_LANGUAGES.map(l => ({ hreflang: l, href: canonical(localizePath(enPath, l)) })),
      { hreflang: 'x-default', href: canonical(localizePath(enPath, 'en')) },
    ];
  }, [enPath, noindex]);

  useHead({
    title: fullTitle,
    description,
    image,
    imageWidth: resolvedWidth,
    imageHeight: resolvedHeight,
    url,
    locale: OG_LOCALE[language],
    alternates,
    noindex,
  });

  return null;
}
