# Sprint 3 Technical Implementation Specification

Project: Story Time with Eva  
Scope: SEO, Multilingual Discoverability, and Organic Growth  
Source: Sprint 3 PRD  
Status: Developer-ready, pending live repository path verification  
Architecture: React, TypeScript, Vite, React Router, Puppeteer prerendering, Netlify

## 1. Purpose

Harden and extend the existing SEO stack without changing indexed route conventions or replacing the current architecture. This specification preserves `Seo.tsx`, `JsonLd.tsx`, `language.tsx`, `gen-sitemap.mjs`, prerendering, and the existing SEO test suite.

## 2. Scope and Constraints

- Canonical routes remain `/books/:id`, `/fr/books/:id`, and `/es/books/:id`.
- Do not introduce `/fr/livres` or `/es/libros`.
- Existing indexed URLs must continue resolving.
- English, French, and Spanish pages must have reciprocal canonicals and hreflang links.
- Sitemap generation must use structured catalog data, not regex parsing of TypeScript source.
- Add landing pages only when they contain unique editorial value.
- Analytics must not be required for indexing, routing, or rendering.

## 3. Repository Verification Gate

Before implementation, confirm the actual location and public contracts of:

- `src/components/Seo.tsx`
- `src/components/JsonLd.tsx`
- `src/components/BookCard.tsx`
- `src/lib/language.tsx`
- `src/data/books.ts`
- `src/pages/Books.tsx`
- `src/pages/BookDetail.tsx`
- `scripts/gen-sitemap.mjs`
- `public/robots.txt`
- `tests/seo/seo.test.mjs`

If names differ, update this specification's path map only. Do not create duplicate implementations.

## 4. Target Architecture

Create one build-safe content projection shared by runtime pages, sitemap generation, prerender route discovery, and validation. `Seo` owns document metadata and link tags. `JsonLd` owns valid schema serialization. Route helpers own locale-aware canonical URLs. Build scripts consume serialized catalog content or a pure data module with no browser imports.

Suggested additions:

```text
src/seo/
  metadata.ts
  routes.ts
  schemas.ts
  validation.ts
scripts/
  check-orphans.mjs
  validate-seo.mjs
tests/seo/
  metadata.test.mjs
  sitemap.test.mjs
  structured-data.test.mjs
  production-seo.test.mjs
```

Prefer integrating with existing folders if equivalent utilities already exist.

## 5. Core Contracts

```ts
type Locale = 'en' | 'fr' | 'es';

interface SeoDescriptor {
  title: string;
  description: string;
  canonicalUrl: string;
  alternates: Array<{ locale: Locale | 'x-default'; href: string }>;
  openGraph: { title: string; description: string; url: string; image?: string };
  robots?: { index: boolean; follow: boolean };
}

interface PublicRouteRecord {
  path: string;
  locale: Locale;
  canonicalPath: string;
  contentId?: string;
  indexable: boolean;
  inboundFrom: string[];
}
```

Required invariants:

- Exactly one canonical per indexable page.
- All translated variants produce reciprocal `hreflang` entries plus `x-default`.
- Titles and descriptions are non-empty, localized, and unique within a locale.
- A public indexable route appears once in the sitemap.
- Every indexable route has at least one internal inbound link.
- JSON-LD parses and matches visible page content.

## 6. Work Breakdown and Traceability

| PRD ID | Implementation | Primary verification |
| --- | --- | --- |
| S3-001 | Audit every `Seo` consumer, document prop behavior, remove conflicting direct head mutations, and preserve backward compatibility. | Component contract tests and rendered-head snapshots. |
| S3-002 | Centralize localized title, description, canonical, and social metadata resolution. Fail validation on fallback leakage where a translation is required. | EN/FR/ES metadata matrix. |
| S3-003 | Generate reciprocal hreflang links from the canonical route helper, including `x-default`. | Pairwise alternate-link test for every translated route. |
| S3-004 | Refactor sitemap generation to import the build-safe catalog projection. Remove regex source parsing. | Deterministic sitemap snapshot. |
| S3-005 | Compare catalog-supported public routes, prerender routes, and sitemap entries. | CI parity test must report zero missing or extra routes. |
| S3-006 | Add title and description uniqueness validation per locale. | CI failure includes route and duplicated value. |
| S3-007 | Generalize `Breadcrumbs` with localized labels and stable URL segments. | Keyboard, semantic markup, and `BreadcrumbList` parity tests. |
| S3-008 | Materialize Book, Activity, Resource, and Related Book links from stable IDs. | Relationship resolution and link-render tests. |
| S3-009 | Build a route graph and fail on orphan indexable pages. | `scripts/check-orphans.mjs` exits nonzero with actionable diagnostics. |
| S3-010 | Centralize Book, BreadcrumbList, ItemList, Organization, and WebSite generators only where schema is accurate. | Schema validator and visible-content parity tests. |
| S3-011 | Validate `og:title`, `og:description`, `og:url`, and representative image data. | Rendered-head tests for representative routes. |
| S3-012 | Audit `robots.txt`, meta robots, excluded routes, and sitemap reference. | Production-like indexability assertions. |
| S3-013 | Verify real status codes for prerendered routes, unknown routes, and redirects. | 200/301/404 response matrix. |
| S3-014 | Audit descriptive localized alt text, intrinsic dimensions, responsive sources, filenames, and loading priority. | Image markup tests plus manual content review. |
| S3-015 | Create editorial metadata briefs for language, theme, age, book, activity, and resource intent. | Content review rejects stuffing and translation drift. |
| S3-016 | Define a data-driven landing-page template and a minimum-content gate. Do not publish thin pages. | Indexability and uniqueness review per proposed page. |
| S3-017 | Expand regression coverage for canonicals, hreflang, titles, descriptions, OG tags, structured data, status, and robots. | CI suite passes against the production build. |
| S3-018 | Capture Search Console and production crawl baseline, with date and route set. | Baseline artifact exists before release. |
| S3-019 | Generate an inventory of routes, metadata, translation coverage, schema, and inbound links. | Inventory contains every public route. |
| S3-020 | Run post-deploy crawl and spot checks for all locales and major content types. | Release checklist has no critical crawl errors. |

## 7. Implementation Sequence

1. Capture the baseline and repository map.
2. Introduce canonical route and metadata resolvers behind current component APIs.
3. Create the build-safe catalog projection and refactor sitemap generation.
4. Add parity, uniqueness, orphan, and structured-data validators.
5. Generalize breadcrumbs and internal relationship links.
6. Audit robots, images, status codes, and social metadata.
7. Evaluate editorial landing pages against the unique-content gate.
8. Run build, prerender, regression, and production validation.

## 8. Test Plan

- Unit: route generation, locale fallback rules, metadata resolution, schema builders.
- Data: duplicate metadata, invalid relationships, missing translations, sitemap parity.
- Component: head tags, breadcrumbs, structured data, responsive image markup.
- Integration: public routes rendered in all locales with correct status and head data.
- Crawl: sitemap URLs return canonical 200 pages and no orphan routes exist.
- Manual: Search Console inspection, social share previews, representative mobile pages.

CI must run the SEO suite after the production build and prerender step.

## 9. Release and Rollback

- Release metadata and sitemap changes together to prevent temporary divergence.
- Submit the updated sitemap only after production validation.
- Preserve old URLs and use explicit permanent redirects only when an existing URL must change.
- Roll back the release if canonical, hreflang, sitemap, or status-code validation fails.

## 10. Definition of Done

- Canonical, hreflang, unique title, unique description, structured-data, and sitemap coverage reach 100% for supported public routes.
- At least 95% of canonical public pages are indexed after the measurement window.
- Sitemap/catalog parity is 100%, orphan pages are zero, and critical crawl errors are zero.
- Production URLs and route vocabulary remain unchanged.
- The baseline and 90-day measurement plan are recorded.

## 11. Open Decisions

- Which content types meet the minimum editorial-content threshold for indexable landing pages?
- Which source supplies production search performance data and who owns the 90-day review?
- Does the existing prerender route manifest already provide the preferred build-safe catalog projection?

