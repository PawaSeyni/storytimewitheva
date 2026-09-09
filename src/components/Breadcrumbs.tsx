import { Link } from './LocalizedLink';
import { localizePath, type Language } from '../lib/language';

// Shared breadcrumbs (Sprint 3 S3-007). Before this, BookDetail and the collection page
// each carried their own copy of the markup AND their own BreadcrumbList JSON-LD, and
// they had already drifted: one localized the schema URLs per language, the other did
// not; one used "/" as the separator, the other "›". One component, one schema helper.
//
// Labels are supplied by the caller (already localized); URL segments stay the fixed
// English route vocabulary and are localized only by prefix, per the Sprint 3 constraint.

const SITE_URL = 'https://storytimewitheva.com';

export interface Crumb {
  label: string;
  /** Unprefixed internal path. Omit for the current page. */
  to?: string;
}

export default function Breadcrumbs({ crumbs, className = '' }: { crumbs: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
      <ol className="flex flex-wrap items-center gap-1.5 text-gray-500">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={`${c.to ?? 'current'}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden className="text-gray-400">›</span>}
              {last || !c.to ? (
                <span aria-current="page" className="font-medium text-gray-700 truncate max-w-[16rem]">
                  {c.label}
                </span>
              ) : (
                <Link to={c.to} className="font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * schema.org BreadcrumbList for the same crumbs. Item URLs are localized to match the
 * page's canonical, so the FR page's breadcrumbs point at /fr/... — the same URLs the
 * visible links go to. The current page needs a `to` here even though the visible crumb
 * does not link, so pass the page path as the last crumb's `to`.
 */
export function breadcrumbSchema(crumbs: Crumb[], language: Language) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      // Always the trailing-slash form Netlify serves and the canonicals use, including a
      // localized root: `/fr` -> `/fr/`. (The first version dropped the slash there.)
      item: (() => {
        const lp = localizePath(c.to ?? '/', language);
        return `${SITE_URL}${lp}${lp.endsWith('/') ? '' : '/'}`;
      })(),
    })),
  };
}
