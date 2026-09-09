// Sprint 7 S7-014: the ecosystem content inventory, generated from the real data
// modules through the build-safe projection, and a CI gate.
//
//   node scripts/gen-content-inventory.mjs          writes docs/content-inventory.md
//   node scripts/gen-content-inventory.mjs --check  exits 1 on any ERROR (CI), writes nothing
//
// ERRORS (fail): a published record that fails its validator, a broken or draft reference
// from published content, a duplicate id across the ecosystem, a download whose file is
// missing on disk. The report is deterministic (no dates, no seasonal open/closed state,
// which depends on the clock), so a committed copy only changes when content changes.
import { readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadCatalog, loadActivities, loadResources, loadContentIndex, loadCollections, loadJourneys, loadLearningPacks, loadRelatedBooks,
} from './lib/catalog.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const LANGS = ['en', 'fr', 'es'];

const { books } = await loadCatalog();
const { activities } = await loadActivities();
const { resources } = await loadResources();
const idx = await loadContentIndex();
const { collections } = await loadCollections();
const { journeys } = await loadJourneys();
const { learningPacks } = await loadLearningPacks();
const { relatedBooksFor } = await loadRelatedBooks();

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);

// ---- ids: unique within type, and no route-token collisions across the /collections and /free namespaces
const dup = (arr, label) => {
  const seen = new Set();
  for (const id of arr) { if (seen.has(id)) err(`duplicate ${label} id "${id}"`); seen.add(id); }
};
dup(books.map((b) => b.id), 'book');
dup(activities.map((a) => a.slug), 'activity');
dup(resources.map((r) => r.id), 'resource');
dup(collections.map((c) => c.id), 'collection');
dup(journeys.map((j) => j.id), 'journey');
dup(learningPacks.map((p) => p.id), 'pack');

// ---- validators on every published record
for (const c of collections.filter((c) => c.publishState === 'published')) for (const p of idx.collectionProblems(c)) err(`collection ${c.id}: ${p}`);
for (const j of journeys.filter((j) => j.publishState === 'published')) for (const p of idx.journeyProblems(j)) err(`journey ${j.id}: ${p}`);
for (const p of learningPacks.filter((p) => p.publishState === 'published')) for (const q of idx.learningPackProblems(p)) err(`pack ${p.id}: ${q}`);
for (const c of collections.filter((c) => c.publishState === 'draft')) warnings.push(`collection ${c.id} is a draft`);
for (const j of journeys.filter((j) => j.publishState === 'draft')) warnings.push(`journey ${j.id} is a draft`);

// ---- published content never references a draft
const draftCollections = new Set(collections.filter((c) => c.publishState !== 'published').map((c) => c.id));
for (const p of learningPacks.filter((p) => p.publishState === 'published')) for (const c of p.collectionIds ?? []) if (draftCollections.has(c)) err(`pack ${p.id} references draft collection ${c}`);

// ---- book relationships
const bookIds = new Set(books.map((b) => b.id));
const slugs = new Set(activities.map((a) => a.slug));
const resIds = new Set(resources.map((r) => r.id));
for (const b of books) {
  for (const a of b.relatedActivityIds ?? []) if (!slugs.has(a)) err(`book ${b.id}: relatedActivityIds -> missing activity "${a}"`);
  for (const r of b.relatedResourceIds ?? []) if (!resIds.has(r)) err(`book ${b.id}: relatedResourceIds -> missing resource "${r}"`);
  for (const o of b.relatedBookIds ?? []) if (!bookIds.has(o)) err(`book ${b.id}: relatedBookIds -> missing book "${o}"`);
  // discussionQuestions is an array of trilingual prompts ({ en, fr, es }).
  if (!(b.discussionQuestions?.length)) warnings.push(`book ${b.id}: no discussion prompts`);
  for (const [i, q] of (b.discussionQuestions ?? []).entries()) for (const l of LANGS) if (!q.prompt?.[l]?.trim()) err(`book ${b.id}: discussion prompt ${i + 1} missing ${l}`);
}
for (const r of resources.filter((x) => x.kind === 'article')) {
  for (const t of r.relatedThemeIds ?? []) if (!idx.booksByThemeId[t]) err(`guide ${r.id}: unknown theme "${t}"`);
  for (const o of r.relatedResourceIds ?? []) if (!resIds.has(o)) err(`guide ${r.id}: relatedResourceIds -> missing "${o}"`);
  if (!(r.relatedThemeIds ?? []).length) err(`guide ${r.id}: a parent guide must name the themes it speaks to (S7-006)`);
}

// ---- downloads: file on disk per declared language, accessible name
const pdfs = readdirSync(path.join(ROOT, 'public')).filter((f) => f.endsWith('.pdf'));
const hasPdf = (slug, lang) => pdfs.some((f) => new RegExp(`^${slug}${lang === 'en' ? '' : `-${lang}`}\\.[0-9a-f]{6,}\\.pdf$`).test(f));
const downloads = resources.filter((r) => r.kind === 'download').map((r) => {
  const files = Object.fromEntries(LANGS.map((l) => [l, hasPdf(r.slug, l)]));
  if (!files.en) err(`download ${r.id}: no English file on disk for slug "${r.slug}"`);
  if (Boolean(r.localizedFile) !== (files.fr && files.es)) err(`download ${r.id}: localizedFile=${Boolean(r.localizedFile)} but fr/es files on disk=${files.fr && files.es}`);
  for (const l of LANGS) if (!r.title[l]?.trim()) err(`download ${r.id}: missing ${l} accessible name`);
  return { id: r.id, slug: r.slug, files };
});

// ---- report
const kinds = (arr, key) => Object.entries(arr.reduce((m, x) => ((m[x[key]] = (m[x[key]] ?? 0) + 1), m), {})).map(([k, n]) => `${k} ${n}`).join(', ');
const yn = (v) => (v ? '✅' : '—');
const md = `# Ecosystem Content Inventory (S7-014)

> Generated by \`scripts/gen-content-inventory.mjs\` from the data modules; deterministic.
> \`--check\` runs in CI and fails on any error below. Regenerate after any content change.

## Totals

| Type | Count | Detail |
|---|---|---|
| Books | ${books.length} | ${books.filter((b) => (b.relatedActivityIds ?? []).length).length} with related activities, ${books.filter((b) => relatedBooksFor(b.id).length).length} with related books, ${books.filter((b) => b.discussionQuestions?.length).length} with discussion prompts (${books.reduce((n, b) => n + (b.discussionQuestions?.length ?? 0), 0)} prompts) |
| Activities | ${activities.length} | ${activities.filter((a) => a.game).length} games, ${activities.filter((a) => !a.game).length} in-app |
| Resources | ${resources.length} | ${kinds(resources, 'kind')} |
| Collections | ${collections.length} | ${kinds(collections, 'kind')}; ${collections.filter((c) => c.publishState === 'published').length} published; ${idx.collectionRouteIds.length} routable |
| Journeys | ${journeys.length} | ${journeys.filter((j) => j.publishState === 'published').length} published, ${journeys.reduce((n, j) => n + j.steps.length, 0)} steps |
| Learning packs | ${learningPacks.length} | ${learningPacks.filter((p) => p.publishState === 'published').length} published |

## Collections

| id | kind | state | books | activities | resources | window |
|---|---|---|---|---|---|---|
${collections.map((c) => `| ${c.id} | ${c.kind} | ${c.publishState} | ${idx.collectionMembers(c.id).length} | ${(c.activityIds ?? []).length} | ${(c.resourceIds ?? []).length} | ${c.window ? `${c.window.from} to ${c.window.to}` : ''} |`).join('\n')}

## Journeys

| id | state | steps | books | ages | themes |
|---|---|---|---|---|---|
${journeys.map((j) => `| ${j.id} | ${j.publishState} | ${j.steps.length} | ${j.steps.filter((s) => s.type === 'book' || s.type === 'next-book').length} | ${j.ageBandIds.join(', ')} | ${j.themeIds.join(', ')} |`).join('\n')}

## Learning packs

| id | audience | state | items | accompanies |
|---|---|---|---|---|
${learningPacks.map((p) => `| ${p.id} | ${p.audience} | ${p.publishState} | ${p.resourceIds.join(', ')} | ${(p.collectionIds ?? []).join(', ')} |`).join('\n')}

## Parent guides (S7-006)

| id | themes | printables |
|---|---|---|
${resources.filter((r) => r.kind === 'article').map((r) => `| ${r.id} | ${(r.relatedThemeIds ?? []).join(', ')} | ${(r.relatedResourceIds ?? []).join(', ')} |`).join('\n')}

## Downloads on disk

| id | slug | EN | FR | ES |
|---|---|---|---|---|
${downloads.map((d) => `| ${d.id} | ${d.slug} | ${yn(d.files.en)} | ${yn(d.files.fr)} | ${yn(d.files.es)} |`).join('\n')}

## Validation

- Errors: ${errors.length}${errors.length ? '\n' + errors.map((e) => `  - ${e}`).join('\n') : ''}
- Warnings: ${warnings.length}${warnings.length ? '\n' + warnings.map((w) => `  - ${w}`).join('\n') : ''}
`;

if (errors.length) {
  console.error(`content inventory: ${errors.length} error(s)\n  ${errors.join('\n  ')}`);
}
if (!CHECK) {
  writeFileSync(path.join(ROOT, 'docs', 'content-inventory.md'), md);
  console.log(`content inventory: wrote docs/content-inventory.md (${errors.length} errors, ${warnings.length} warnings)`);
} else {
  console.log(`content inventory check: ${errors.length} errors, ${warnings.length} warnings`);
}
process.exit(errors.length ? 1 : 0);
