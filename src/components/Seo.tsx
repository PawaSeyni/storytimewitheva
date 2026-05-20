import { useLanguage } from '../lib/language';
import { useHead } from '../lib/head';

const SITE_URL = 'https://storytimewitheva.netlify.app';
const SITE_NAME = 'Story Time with Eva';
const DEFAULT_IMAGE = 'https://m.media-amazon.com/images/I/619qWXXkRwL.jpg';

const OG_LOCALE: Record<'en' | 'es' | 'fr', string> = {
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
};

interface SeoProps {
  /** Page-specific title. Will be rendered as `${title} | Story Time with Eva` unless `bare` is true. */
  title: string;
  description: string;
  /** Absolute URL of an OG/Twitter image. Defaults to the Maya's Shadow cover. */
  image?: string;
  /** Path-only canonical URL. Defaults to current pathname. */
  path?: string;
  /** Set to true to render the title verbatim (no site suffix). Use only on the home page. */
  bare?: boolean;
  /** Discourage indexing on personal/utility pages (e.g. /profile). */
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
export default function Seo({ title, description, image = DEFAULT_IMAGE, path, bare = false, noindex = false }: SeoProps) {
  const { language } = useLanguage();
  const fullTitle = bare ? title : `${title} | ${SITE_NAME}`;
  const url = path ? `${SITE_URL}${path}` : SITE_URL;

  useHead({
    title: fullTitle,
    description,
    image,
    url,
    locale: OG_LOCALE[language],
    noindex,
  });

  return null;
}
