# Sprint 7 Technical Implementation Specification

Project: Story Time with Eva  
Scope: Content and Learning Ecosystem  
Source: Sprint 7 PRD  
Status: Developer-ready, pending live repository path verification

## 1. Purpose

Connect stories, reading, listening, discussion, creation, learning, and discovery through structured editorial relationships. The sprint deepens existing content rather than producing disconnected pages or a second content database.

## 2. Constraints

- Every public ecosystem flow works without cookies.
- Analytics is never a functional dependency.
- Journey persistence uses the Sprint 6 storage abstraction and degrades safely.
- Reuse stable book, activity, resource, theme, age, and locale IDs.
- English, French, and Spanish relationships must remain aligned.
- Do not hard-code large relationship arrays inside components.
- Do not publish thin SEO pages or invented translations.
- Printable content must be accessible on screen and usable when printed.

## 3. Repository Verification Gate

Confirm the current book, activity, resource, discussion-question, theme, age, search, route, localization, SEO, and storage models. Determine whether `src/data/content.ts` reduces duplication before adding it. If existing modules can expose a unified index, keep them as the sources of truth.

## 4. Target Content Model

```ts
type Locale = 'en' | 'fr' | 'es';
type LocalizedText = Record<Locale, string>;

interface Collection {
  id: string;
  kind: 'theme' | 'age' | 'educator' | 'seasonal';
  title: LocalizedText;
  description: LocalizedText;
  bookIds: string[];
  activityIds?: string[];
  resourceIds?: string[];
  themeIds?: string[];
  ageBandIds?: string[];
  publishState: 'draft' | 'published';
}

interface JourneyStep {
  id: string;
  type: 'book' | 'activity' | 'discussion' | 'resource' | 'next-book';
  contentId: string;
  optional?: boolean;
}

interface ReadingJourney {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  ageBandIds: string[];
  themeIds: string[];
  steps: JourneyStep[];
  publishState: 'draft' | 'published';
}

interface DiscussionGuide {
  id: string;
  bookIds: string[];
  audience: 'parent' | 'educator' | 'both';
  prompts: Record<Locale, string[]>;
}
```

Models may use the repository's established localized-field pattern. The invariants, not these exact property names, are mandatory.

## 5. Relationship Rules

- IDs are globally stable within content type and references resolve at build time.
- Published content cannot reference drafts or missing items.
- Every journey has at least one book and one meaningful continuation step.
- Collection ordering is editorial and deterministic.
- All required localized titles, descriptions, labels, and prompts exist before publication.
- Cycles are allowed only when editorially intentional and must not create navigation traps.
- Reverse relationships are derived during validation or indexing, not manually duplicated.

## 6. Work Breakdown and Traceability

| PRD ID | Implementation | Primary verification |
| --- | --- | --- |
| S7-001 | Create editorial thematic collections from established theme IDs. | Stable references, locale parity, and useful-content review. |
| S7-002 | Create age-based collections using the existing age taxonomy. | Unknown age IDs fail validation. |
| S7-003 | Create ordered multi-step reading journeys with localized progress labels. | Journey route and step-order tests. |
| S7-004 | Model Book plus Activity bundles without copying book or activity records. | Relationship and rendering tests. |
| S7-005 | Attach editorial discussion guides through the existing `discussionQuestions` model where possible. | Prompt completeness and audience review. |
| S7-006 | Publish localized parent guides with internal links to relevant stories and resources. | Content, accessibility, and link review. |
| S7-007 | Create educator collections for approved classroom and learning use cases. | Audience labeling and structured relationship tests. |
| S7-008 | Bundle existing printables into coherent learning packs with clear metadata. | Download, print, accessibility, and locale tests. |
| S7-009 | Formalize the Book, Activity, Resource, Collection, and Journey relationship graph using stable IDs. | Full graph validation and reverse-index tests. |
| S7-010 | Persist minimal journey progress through the Sprint 6 adapter. | Resume, reset, stale-ID, and blocked-storage tests. |
| S7-011 | Save journey IDs locally without duplicating journey content. | Save/remove and no-storage tests. |
| S7-012 | Add time-bounded editorial seasonal collections using existing content. | Publish-window and empty-state tests. |
| S7-013 | Validate EN/FR/ES field and relationship parity for all published ecosystem content. | CI lists exact missing locale paths. |
| S7-014 | Generate a content inventory and fail CI on missing, invalid, duplicate, or draft references. | Deterministic validation report. |
| S7-015 | Extend search to collections, journeys, activities, and resources only where useful, with content-type filters. | Relevance, locale, empty-query, and keyboard tests. |
| S7-016 | Track journey starts, steps, completions, saves, downloads, and continuation clicks using stable IDs. | Privacy-safe event contract tests. |
| S7-017 | Run browse, open, progress, save, print/download, search, and continuation flows with cookies disabled. | Permanent browser suite. |
| S7-018 | Validate keyboard, screen-reader, contrast, focus, and printable output. | Zero critical accessibility issues and print QA signoff. |
| S7-019 | Add accurate metadata, canonical links, structured data where appropriate, and internal linking. | SEO suite with no thin pages. |
| S7-020 | Audit all published content, relationships, translations, downloads, analytics, and production routes. | Signed release inventory. |

## 7. Journey Progress Contract

```ts
interface JourneyProgressV1 {
  version: 1;
  journeyId: string;
  completedStepIds: string[];
  lastStepId?: string;
  updatedAt: string;
}
```

Progress is advisory and local. Completing a step must not require analytics, a network write, or identity. Invalid steps are removed on read. If a journey changes, keep progress only for step IDs still present.

## 8. Search Design

Extend the existing search index rather than introducing external infrastructure. Each record contains stable ID, content type, localized title and summary, theme IDs, age IDs, route, and searchable editorial terms. Search runs within the active locale by default. Results expose content type and must preserve keyboard and screen-reader usability.

## 9. Validation Pipeline

The build-time validator checks:

- ID uniqueness and allowed formats.
- Reference existence and published-state consistency.
- Required EN/FR/ES content.
- Theme and age taxonomy membership.
- Journey step ordering and minimum viable structure.
- Collection non-emptiness and duplicate members.
- Search index coverage and route existence.
- Download file existence, metadata, and accessible name.
- Orphan content and unreachable public routes.

Warnings may cover optional editorial improvements. Broken references, missing required translations, duplicate IDs, and invalid routes are errors.

## 10. Accessibility and Print Requirements

- Journey progress is communicated through text and programmatic state, not color alone.
- Completion controls are keyboard operable and announce changes.
- Printables have descriptive links, usable contrast, logical reading order, and no essential information that depends on color.
- Print layouts avoid clipped content and remove irrelevant navigation.
- Content cards use semantic headings and lists with consistent focus behavior.

## 11. Implementation Sequence

1. Audit content sources and approve the relationship model.
2. Implement validators, reverse indexes, and inventory generation.
3. Add collections, bundles, guides, learning packs, and routes.
4. Add journeys, saved journeys, and local progress.
5. Extend search and SEO/internal links.
6. Add analytics, seasonal publishing, accessibility, and print behavior.
7. Complete cookie-free and production audits.

## 12. Test Plan

- Unit: content schemas, reverse relationships, journey progress, search records.
- Content: all IDs, translations, routes, references, downloads, and publish states.
- Component: cards, steps, progress, save controls, search filters, print links.
- Integration: Story to Activity to Discussion to Resource to Next Story.
- Resilience: cookies disabled, storage blocked, stale progress, removed content.
- Accessibility and print: screen reader, keyboard, zoom, print preview, PDF/download inspection.
- Production: representative collections and journeys in all locales.

## 13. Release Gates

- All published relationship references and routes validate.
- EN/FR/ES parity is complete for required fields.
- CI detects invalid or incomplete content.
- All learning journeys function without cookies and without persistent storage.
- No critical accessibility, print, search, SEO, or production defect remains.

## 14. Open Decisions

- Whether a unified `content.ts` index is beneficial or would duplicate current sources.
- Minimum editorial content required for a thematic, educator, or seasonal collection.
- Whether printable packs are static files, generated files, or curated groups of existing downloads.
