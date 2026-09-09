# ADR-004: Content management — no CMS; records, validators and the inventory are the workflow

**Status:** Accepted (engineering recommendation; owner acceptance in the Platform Readiness Assessment)
**Date:** 2026-09-09
**Sprint:** 8 (S8-003). **Builds on:** ADR-003. **Evidence:** baseline "Editorial operations", register BR-07.

## Context

Sprint 8 asks whether editorial operations are difficult enough to justify a content
architecture (CMS, editorial UI, workflow states). The measured state: 24 content-touching
merges in 30 days, all authored by the engineering pair; each is a PR gated by
`collectionProblems` / `journeyProblems` / `learningPackProblems`, the content inventory
(`npm run check:content`), EN/FR/ES parity tests, a full build with prerender guards, and
the SEO, linking, accessibility and cookie-free suites. Review time is the PR cycle. Five
content defects were caught by these gates in Sprint 7; none reached production. Copy
review by the owner happens on the PR or on the punch list.

## Options

1. **Continue** (records in git, validators, inventory, punch-list copy review). Cost zero; every gate already exists; reversibility total; the only friction is that an editor must use git.
2. **Bounded layer**: a small authoring aid (a script that scaffolds a record from a template and runs the validators; or JSON files edited through GitHub's web UI with the validators as the review). Adds value only for a non-engineer editor.
3. **Headless CMS** with build-time fetch. Adds roles, drafts and previews the current flow already has through PRs and deploy previews; adds credentials, vendor retention, a runtime build dependency, migration and lock-in.

## Decision

Option 1 now; option 2 is pre-approved and should be built the day a second editor exists.
Thresholds that reopen this ADR:

- A non-engineer needs to publish content without a pull request.
- Median time from content ready to live exceeds one working day for two consecutive weeks.
- More than two content defects reach production in a quarter.

## Consequences

- The publish workflow is documented as: edit a record, run `npm run check:content`, open a PR, deploy preview, merge. It is the same for books, collections, journeys, packs and guides.
- Copy review remains a punch-list item with owner sign-off; a CMS would not change that.
- Deploy previews are the editorial preview environment (S8-016 environment matrix).
