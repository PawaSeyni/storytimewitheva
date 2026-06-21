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
  /** og:image pixel dimensions, when known (helps scrapers render the card without a pre-fetch). */
  imageWidth?: number;
  imageHeight?: number;
  /** Absolute canonical URL. */
  url?: string;
  /** og:locale value (e.g. "en_US"). */
  locale?: string;
  /** Reciprocal hreflang alternates (incl. x-default). Replaced wholesale each render. */
  alternates?: { hreflang: string; href: string }[];
  /** When true, sets `meta[name=robots]=noindex,follow`; otherwise removes that meta. */
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

function setAlternates(alternates: { hreflang: string; href: string }[]) {
  // Remove the ones we manage, then re-add — keeps them correct across SPA
  // route changes without accumulating stale tags.
  document.head
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .forEach(el => el.remove());
  for (const { hreflang, href } of alternates) {
    const el = document.createElement('link');
    el.setAttribute('rel', 'alternate');
    el.setAttribute('hreflang', hreflang);
    el.setAttribute('href', href);
    document.head.appendChild(el);
  }
}

export function useHead({ title, description, image, imageWidth, imageHeight, url, locale, alternates, noindex }: UseHeadOptions) {
  useEffect(() => {
    document.title = title;
    upsertMeta('name', 'description', description);

    // Open Graph
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    if (url) upsertMeta('property', 'og:url', url);
    if (image) {
      upsertMeta('property', 'og:image', image);
      upsertMeta('property', 'og:image:alt', title);
      // Derive the MIME type from the extension so scrapers don't have to sniff it.
      const lower = image.toLowerCase();
      const type = lower.endsWith('.png')
        ? 'image/png'
        : lower.endsWith('.webp')
          ? 'image/webp'
          : 'image/jpeg';
      upsertMeta('property', 'og:image:type', type);
      // Dimensions only when known (varies per page) — remove stale ones on SPA nav otherwise.
      if (imageWidth && imageHeight) {
        upsertMeta('property', 'og:image:width', String(imageWidth));
        upsertMeta('property', 'og:image:height', String(imageHeight));
      } else {
        removeMeta('property', 'og:image:width');
        removeMeta('property', 'og:image:height');
      }
    }
    if (locale) upsertMeta('property', 'og:locale', locale);

    // Twitter
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    if (image) upsertMeta('name', 'twitter:image', image);

    // Canonical
    if (url) upsertLink('canonical', url);

    // hreflang alternates
    setAlternates(alternates ?? []);

    // Robots (only present when noindex)
    if (noindex) {
      // noindex keeps these utility pages out of the index; "follow" still lets
      // crawlers traverse their internal links (preserving link equity).
      upsertMeta('name', 'robots', 'noindex,follow');
    } else {
      removeMeta('name', 'robots');
    }
  }, [title, description, image, imageWidth, imageHeight, url, locale, alternates, noindex]);
}
