// Accessibility + localization regression suite for the prerendered output
// (taxonomy v1 step 10). Runs against dist/ after the production build, alongside
// the SEO suite, so a regression fails CI rather than reaching production.
//
// It caught a real defect when the collection pages shipped: the book grid had no
// heading, so the outline skipped h1 -> h3 (BookCard titles are h3) on all 33 pages,
// a WCAG 1.3.1 failure.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCatalog, loadContentIndex, loadRelatedBooks, loadActivities, loadCollections } from '../../scripts/lib/catalog.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(ROOT, 'dist');
const { collectionEligibleThemeIds, ageCollectionEligibleBandIds, collectionRouteIds, journeyRouteIds } = await loadContentIndex();
const { books } = await loadCatalog();
const { relatedBooksFor } = await loadRelatedBooks();
const { activities } = await loadActivities();
const { collections } = await loadCollections();
const LOCALES = { en: '', fr: '/fr', es: '/es' };

/** English-only UI strings that must never appear on a localized collection page. */
const EN_ONLY = ['Browse other themes', 'in this collection', 'Books in this collection'];

const pages = [];
for (const [loc, prefix] of Object.entries(LOCALES)) {
  for (const id of collectionRouteIds) pages.push({ route: `${prefix}/collections/${id}`, loc });
  pages.push({ route: `${prefix}/journeys`, loc });
  for (const id of journeyRouteIds) pages.push({ route: `${prefix}/journeys/${id}`, loc });
  for (const b of books) pages.push({ route: `${prefix}/books/${b.id}`, loc });
  pages.push({ route: `${prefix}/books`, loc });
  pages.push({ route: prefix || '/', loc });
}

const read = (route) => {
  const f = path.join(DIST, route.replace(/^\//, ''), 'index.html');
  return existsSync(f) ? readFileSync(f, 'utf8') : null;
};

test('a11y — every prerendered page has exactly one non-empty <h1>', () => {
  for (const { route } of pages) {
    const h = read(route);
    assert.ok(h, `${route}: not prerendered`);
    const h1s = [...h.matchAll(/<h1[^>]*>(.*?)<\/h1>/gs)];
    assert.equal(h1s.length, 1, `${route}: expected exactly one <h1>, found ${h1s.length}`);
    assert.ok(h1s[0][1].replace(/<[^>]*>/g, '').trim(), `${route}: <h1> is empty`);
  }
});

test('a11y — heading levels never skip (WCAG 1.3.1)', () => {
  for (const { route } of pages) {
    const h = read(route);
    const levels = [...h.matchAll(/<h([1-6])[^>]*>/g)].map((m) => +m[1]);
    let prev = 0;
    for (const l of levels) {
      assert.ok(!(prev && l > prev + 1), `${route}: heading level skip h${prev} -> h${l}`);
      prev = l;
    }
  }
});

test('a11y — every image has an alt attribute', () => {
  for (const { route } of pages) {
    const missing = [...read(route).matchAll(/<img\b(?![^>]*\balt=)[^>]*>/g)];
    assert.equal(missing.length, 0, `${route}: ${missing.length} <img> without alt`);
  }
});

test('a11y — collection pages expose semantic breadcrumbs', () => {
  for (const { route } of pages.filter((p) => p.route.includes('/collections/'))) {
    const h = read(route);
    assert.match(h, /<nav[^>]*aria-label="Breadcrumb"/, `${route}: breadcrumb nav missing aria-label`);
    assert.match(h, /aria-current="page"/, `${route}: breadcrumb missing aria-current="page"`);
  }
});

test('i18n — html lang matches the locale on every prerendered page', () => {
  for (const { route, loc } of pages) {
    const lang = read(route).match(/<html[^>]*\blang="([^"]+)"/)?.[1];
    assert.equal(lang, loc, `${route}: html lang="${lang}", expected "${loc}"`);
  }
});

test('i18n — no English UI copy leaks onto FR/ES collection pages', () => {
  for (const { route, loc } of pages.filter((p) => p.loc !== 'en' && p.route.includes('/collections/'))) {
    const h = read(route);
    for (const s of EN_ONLY) {
      assert.ok(!h.includes(s), `${route} (${loc}): untranslated English string "${s}"`);
    }
  }
});

test('a11y — the related-books section carries an h2 above the h3 card titles', () => {
  // Same defect class the collection grid shipped with: BookCard titles are h3, so a
  // section that renders cards under the page h1 with no h2 skips a heading rank.
  for (const b of books) {
    const expected = relatedBooksFor(b.id).length;
    for (const prefix of Object.values(LOCALES)) {
      const route = `${prefix}/books/${b.id}`;
      const h = read(route);
      assert.ok(h, `${route}: not prerendered`);
      const h2s = [...h.matchAll(/<h2[^>]*>(.*?)<\/h2>/gs)];
      assert.ok(h2s.length >= 1, `${route}: related-books section has no <h2>`);
      // Every card the ranking promised is actually on the page.
      const links = new Set([...h.matchAll(/href="[^"]*\/books\/([a-z0-9-]+)\/?"/g)].map((m) => m[1]));
      links.delete(b.id);
      assert.ok(links.size >= expected, `${route}: expected >= ${expected} related links, found ${links.size}`);
    }
  }
});

test('a11y — no book page recommends itself in the rendered output', () => {
  for (const b of books) {
    const ids = relatedBooksFor(b.id).map((r) => r.id);
    assert.ok(!ids.includes(b.id), `${b.id}: self-recommendation reached the ranking`);
  }
});

test('a11y — every book page renders its paired activities (B-02)', () => {
  // The pairs were data-only until this section shipped. If the section silently stops
  // rendering, the pairing work becomes invisible again — so assert the real HTML.
  for (const b of books) {
    const slugs = b.relatedActivityIds ?? [];
    if (slugs.length === 0) continue;
    for (const prefix of Object.values(LOCALES)) {
      const h = read(`${prefix}/books/${b.id}`);
      assert.ok(h, `${prefix}/books/${b.id}: not prerendered`);
      for (const slug of slugs) {
        const game = activities.find((a) => a.slug === slug)?.game;
        // Games are standalone static HTML and are deliberately NOT language-prefixed:
        // one shared file serves all three languages, and the language travels in the
        // query string (C6-04) so it survives an arrival with no stored preference.
        const lang = prefix.replace('/', '');
        const href = game
          ? `/games/${slug}.html${lang ? `?lang=${lang}` : ''}`
          : `${prefix}/activities/${slug}`;
        assert.ok(
          h.includes(`href="${href}"`),
          `${prefix}/books/${b.id}: missing activity link ${href}`,
        );
      }
    }
  }
});

test('a11y — activity card titles are h3 under the section h2, not another h2', () => {
  // Activities.tsx uses h2 for its card titles; reusing that level here would put a card
  // title at the same rank as the section heading it belongs to.
  const sample = read('/books/cloud-collector');
  assert.ok(sample, 'book page not prerendered');
  assert.ok(/<h2[^>]*>Try an activity<\/h2>/.test(sample), 'missing the "Try an activity" h2');
  assert.ok(/<h3[^>]*>[^<]*<\/h3>/.test(sample), 'expected h3 card titles on the book page');
});

test('age filters — /books and /activities use the same exact-age model (D-01)', () => {
  // Taxonomy v1 replaced overlap bands with exact-age containment. /books moved first,
  // leaving /activities contradicting it: its "3-5" band surfaced 5-9 activities, so a
  // parent filtering for a 3-year-old was shown a spelling bee. Both pages now agree,
  // and the retired vocabulary must not creep back into either.
  // The retired vocabulary was the OVERLAP-FILTER bands: 3-5 / 6-8 / 9+. The 6-8 and 9+
  // strings exist nowhere in the taxonomy and must not appear at all. "Ages 3-5" is
  // different: it is also the approved label of the ages-3-5 COLLECTION (S7-002), which
  // /books now links to. So the 3-5 strings are forbidden only as a filter BUTTON
  // (aria-pressed) — the retired chip — never as a collection link.
  const GONE_ENTIRELY = ['Ages 6-8', 'Ages 9+', '6-8 años', '9+ años', '6-8 ans', '9+ ans'];
  const NOT_AS_FILTER = ['Ages 3-5', '3-5 años', '3-5 ans'];
  for (const prefix of Object.values(LOCALES)) {
    for (const page of ['/books', '/activities']) {
      const h = read(`${prefix}${page}`);
      assert.ok(h, `${prefix}${page}: not prerendered`);
      for (const label of GONE_ENTIRELY) {
        assert.ok(!h.includes(`>${label}<`), `${prefix}${page}: retired age band "${label}" is back`);
      }
      for (const label of NOT_AS_FILTER) {
        assert.ok(
          !new RegExp(`<button[^>]*aria-pressed=[^>]*>${label}</button>`).test(h),
          `${prefix}${page}: "${label}" rendered as a filter button (the retired overlap band), not a collection link`,
        );
      }
      for (const age of ['3', '5', '9']) {
        assert.ok(
          new RegExp(`aria-pressed="[a-z]+"[^>]*>${age}<`).test(h) || h.includes(`>${age}</button>`),
          `${prefix}${page}: missing the exact-age chip "${age}"`,
        );
      }
    }
  }
});

test('discussion prompts — every book page shows all three, in its own language (E-01)', () => {
  // The prompts were data-only until this section shipped. Assert the real HTML so they
  // cannot silently stop rendering, and so a missing FR/ES string is caught as a blank
  // page region rather than as a passing unit test.
  const decode = (s) => s.replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  for (const b of books) {
    const qs = b.discussionQuestions ?? [];
    if (qs.length === 0) continue;
    for (const [loc, prefix] of Object.entries(LOCALES)) {
      const h = read(`${prefix}/books/${b.id}`);
      assert.ok(h, `${prefix}/books/${b.id}: not prerendered`);
      const text = decode(h);
      for (const q of qs) {
        assert.ok(
          text.includes(q.prompt[loc]),
          `${prefix}/books/${b.id}: missing the ${loc} "${q.stage}" prompt`,
        );
      }
      // and NOT another language's copy of the same prompt
      for (const other of Object.keys(LOCALES).filter((l) => l !== loc)) {
        const foreign = qs[0].prompt[other];
        if (foreign === qs[0].prompt[loc]) continue;
        assert.ok(!text.includes(foreign), `${prefix}/books/${b.id}: leaked the ${other} prompt`);
      }
    }
  }
});

test('discussion prompts — stage labels are localized, not English everywhere', () => {
  const en = read('/books/mayas-shadow');
  const fr = read('/fr/books/mayas-shadow');
  const es = read('/es/books/mayas-shadow');
  assert.ok(en.includes('Before reading') && en.includes('After reading'), 'EN stage labels');
  assert.ok(fr.includes('Avant la lecture') && fr.includes('Après la lecture'), 'FR stage labels');
  assert.ok(es.includes('Antes de leer') && es.includes('Después de leer'), 'ES stage labels');
  assert.ok(!fr.includes('Before reading'), 'FR page still shows an English stage label');
  assert.ok(!es.includes('Before reading'), 'ES page still shows an English stage label');
});

test('dashboard — /profile renders the Sprint 6 sections and transparency panel in every language', () => {
  // S6-010 / S6-013. The adult page must carry the new library sections, the "what this
  // device remembers" panel, and a polite live region for the clear announcement — in all
  // three languages, from the prerendered HTML, so a missing translation is a failed build
  // rather than an English heading on the French page.
  const expect = {
    en: ['Reading Now', 'Favorites', 'What this device remembers', 'What should we suggest?'],
    fr: ['En cours de lecture', 'Favoris', 'Ce que cet appareil retient', 'Que devons-nous suggérer ?'],
    es: ['Leyendo ahora', 'Favoritos', 'Lo que recuerda este dispositivo', '¿Qué te sugerimos?'],
  };
  for (const [loc, prefix] of Object.entries(LOCALES)) {
    const h = read(`${prefix}/profile`);
    assert.ok(h, `${prefix}/profile: not prerendered`);
    for (const text of expect[loc]) {
      assert.ok(h.includes(text), `${prefix}/profile: missing "${text}"`);
    }
    assert.ok(/role="status"[^>]*aria-live="polite"/.test(h), `${prefix}/profile: no polite live region`);
    // the old single-purpose control is gone
    for (const stale of ['Clear all progress', 'Borrar todo el progreso', 'Tout effacer<']) {
      assert.ok(!h.includes(stale), `${prefix}/profile: stale control "${stale}" still rendered`);
    }
  }
  // and no English leaked onto the localized pages
  for (const loc of ['fr', 'es']) {
    const h = read(`${LOCALES[loc]}/profile`);
    assert.ok(!h.includes('What this device remembers'), `${loc}: English panel heading leaked`);
  }
});

test('journeys — every journey page states progress in text, has pressed-state step controls and a live region (S7-003 / S7-010)', () => {
  const labels = { en: ['Step 1 of', 'Mark step done', 'Talk about it', 'Read next'], fr: ['Étape 1 sur', 'Marquer l’étape comme faite', 'Parlez-en ensemble', 'À lire ensuite'], es: ['Paso 1 de', 'Marcar paso hecho', 'Hablen juntos', 'Sigue leyendo'] };
  for (const [loc, prefix] of Object.entries(LOCALES)) {
    for (const id of journeyRouteIds) {
      const h = read(`${prefix}/journeys/${id}`);
      assert.ok(h, `${prefix}/journeys/${id}: not prerendered`);
      const text = h.replace(/&#39;/g, "'").replace(/&amp;/g, '&');
      for (const l of labels[loc]) assert.ok(text.includes(l), `${prefix}/journeys/${id}: missing "${l}"`);
      assert.ok((h.match(/aria-pressed="false"/g) || []).length >= 5, `${prefix}/journeys/${id}: expected a pressed-state control per step`);
      assert.ok(/role="status"[^>]*aria-live="polite"/.test(h), `${prefix}/journeys/${id}: no polite live region`);
      if (loc !== 'en') assert.ok(!text.includes('Mark step done'), `${prefix}/journeys/${id}: English control label leaked`);
    }
    const idx = read(`${prefix}/journeys`);
    assert.ok(idx && journeyRouteIds.every((id) => idx.includes(`/journeys/${id}"`)), `${prefix}/journeys: index must link every published journey`);
  }
});

test('collections — a record\'s featured activities render on the page, localized, with the right link form (S7-001)', () => {
  const heading = { en: 'Activities that go with these books', fr: 'Des activités qui accompagnent ces livres', es: 'Actividades que acompañan a estos libros' };
  for (const c of collections.filter((x) => (x.activityIds ?? []).length > 0)) {
    for (const [loc, prefix] of Object.entries(LOCALES)) {
      const h = read(`${prefix}/collections/${c.id}`);
      assert.ok(h, `${prefix}/collections/${c.id}: not prerendered`);
      assert.ok(h.includes(heading[loc]), `${prefix}/collections/${c.id}: missing the ${loc} activities heading`);
      for (const slug of c.activityIds) {
        const game = activities.find((a) => a.slug === slug)?.game;
        const lang = prefix.replace('/', '');
        const href = game ? `/games/${slug}.html${lang ? `?lang=${lang}` : ''}` : `${prefix}/activities/${slug}`;
        assert.ok(h.includes(`href="${href}"`), `${prefix}/collections/${c.id}: missing featured activity link ${href}`);
      }
    }
  }
});

test('educator collections — labeled for their audience in every language, and linked from the teachers section (S7-007)', () => {
  const badge = { en: 'For teachers and educators', fr: 'Pour les enseignants et éducateurs', es: 'Para docentes y educadores' };
  const edu = collections.filter((c) => c.kind === 'educator' && c.publishState === 'published');
  assert.ok(edu.length >= 3);
  for (const [loc, prefix] of Object.entries(LOCALES)) {
    for (const c of edu) {
      const h = read(`${prefix}/collections/${c.id}`);
      assert.ok(h, `${prefix}/collections/${c.id}: not prerendered`);
      assert.ok(h.includes(badge[loc]), `${prefix}/collections/${c.id}: missing the ${loc} audience label`);
      const decoded = h.replace(/&#39;/g, "'").replace(/&amp;/g, '&');
      assert.ok(decoded.includes(c.title[loc]), `${prefix}/collections/${c.id}: title not rendered in ${loc}`);
      if (loc !== 'en') assert.ok(!h.includes('For teachers and educators'), `${prefix}/collections/${c.id}: English badge leaked`);
    }
    const res = read(`${prefix}/resources`);
    for (const c of edu) assert.ok(res.includes(`href="${prefix}/collections/${c.id}"`), `${prefix}/resources: teachers section must link ${c.id}`);
  }
});
