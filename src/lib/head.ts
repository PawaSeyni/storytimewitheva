import { useEffect } from 'react';

/**
 * Tiny SPA-friendly replacement for react-helmet-async.
 *
 * Why this exists: react-helmet-async stopped injecting per-route meta tags on
 * our production Vite build — title, og:*, twitter:*, and canonical all fell
 * back to the static defaults in index.html. The root cause was Helmet's
 * children not propagating reliably under React 18 StrictMode + Vite's prod
 * minification.
 *
 * Since this site is a pure client-rendered SPA (no SSR, no streaming), we
 * don't need Helmet's reconciliation machinery. A small useEffect-based hook
 * that imperatively upserts head tags after each render does the job and
 * removes a runtime dependency.
 *
 * Per-page Seo components call useHead(...) on render. The last call wins,
 * which is fine because exactly one Seo renders per route.
 */

interface UseHeadOptions {
  /** Full `<title>` value, including any " | Site Name" suffix. */
  title: string;
  description: string;
  /** Absolute image URL for og:image / twitter:image. */
  image?: string;
  /** Absolute canonical URL. */
  url?: string;
  /** og:locale value (e.g. "en_US"). */
  locale?: string;
  /** When true, sets `meta[name=robots]=noindex,nofollow`; otherwise removes that meta. */
  noindex?: boolean;
}

const SITE_NAME = 'Story Time with Eva';

type MetaKind = 'name' | 'property';

function upsertMeta(kind: MetaKind, key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${kind}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(kind, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMeta(kind: MetaKind, key: string) {
  const el = document.head.querySelector(`meta[${kind}="${key}"]`);
  if (el) el.remove();
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useHead({ title, description, image, url, locale, noindex }: UseHeadOptions) {
  useEffect(() => {
    document.title = title;
    upsertMeta('name', 'description', description);

    // Open Graph
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    if (url) upsertMeta('property', 'og:url', url);
    if (image) upsertMeta('property', 'og:image', image);
    if (locale) upsertMeta('property', 'og:locale', locale);

    // Twitter
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    if (image) upsertMeta('name', 'twitter:image', image);

    // Canonical
    if (url) upsertLink('canonical', url);

    // Robots (only present when noindex)
    if (noindex) {
      upsertMeta('name', 'robots', 'noindex,nofollow');
    } else {
      removeMeta('name', 'robots');
    }
  }, [title, description, image, url, locale, noindex]);
}
