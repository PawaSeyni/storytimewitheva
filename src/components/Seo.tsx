import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../lib/language';

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

export default function Seo({ title, description, image = DEFAULT_IMAGE, path, bare = false, noindex = false }: SeoProps) {
  const { language } = useLanguage();
  const fullTitle = bare ? title : `${title} | ${SITE_NAME}`;
  const url = path ? `${SITE_URL}${path}` : SITE_URL;

  return (
    <Helmet>
      <html lang={language} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={OG_LOCALE[language]} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
