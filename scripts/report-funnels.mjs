// Sprint 5 funnel and performance report (S5-001, S5-004, S5-012, S5-013, S5-014, S5-017).
//
//   node scripts/report-funnels.mjs --fixture tests/analytics/fixtures/events.json [--out file.md]
//   PLAUSIBLE_API_KEY=… node scripts/report-funnels.mjs --from 2026-09-01 --to 2026-09-30
//
// Input is a flat list of aggregated rows { event, props: {…}, count } (what the Plausible
// Stats API v2 returns for a "goal + custom property" breakdown, or a fixture). The report
// derives every funnel in src/analytics/funnels.ts, segments by locale, placement, age band
// and theme (book ids joined to the taxonomy), classifies top/bottom performers, and marks
// any rate below MIN_SAMPLE. It states the date range, schema version and known gaps.
import { readFileSync, writeFileSync } from 'node:fs';
import { loadFunnels, loadEvents, loadCatalog, loadTaxonomy } from './lib/catalog.mjs';

const args = Object.fromEntries(process.argv.slice(2).map((a, i, all) => (a.startsWith('--') ? [a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true] : [])).filter((x) => x.length));
const { FUNNELS, MIN_SAMPLE } = await loadFunnels();
const { SCHEMA_VERSION, EVENTS } = await loadEvents();
const { books } = await loadCatalog();
const { THEMES, derivePrimaryAgeBand } = await loadTaxonomy();

async function fetchPlausible(from, to) {
  const key = process.env.PLAUSIBLE_API_KEY;
  if (!key) return null;
  const site = process.env.PLAUSIBLE_SITE_ID || 'storytimewitheva.com';
  const rows = [];
  for (const e of EVENTS.filter((x) => !x.reserved)) {
    const dims = [...e.required, ...e.optional].filter((p) => p !== 'results').map((p) => `event:props:${p}`);
    const body = { site_id: site, metrics: ['events'], date_range: [from, to], filters: [['is', 'event:goal', [e.name]]], dimensions: dims.slice(0, 4) };
    const r = await fetch('https://plausible.io/api/v2/query', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) { console.error(`plausible ${e.name}: HTTP ${r.status}`); continue; }
    const j = await r.json();
    for (const row of j.results ?? []) rows.push({ event: e.name, props: Object.fromEntries(dims.slice(0, 4).map((d, i) => [d.replace('event:props:', ''), row.dimensions[i]])), count: row.metrics[0] });
  }
  return rows;
}

let rows; let source;
if (args.fixture) { rows = JSON.parse(readFileSync(args.fixture, 'utf8')); source = `fixture ${args.fixture}`; }
else { rows = await fetchPlausible(args.from ?? '30d', args.to ?? 'now'); source = 'Plausible Stats API v2'; }

const bookById = Object.fromEntries(books.map((b) => [b.id, b]));
const count = (event, where = {}, by = null) => {
  const out = {};
  for (const r of rows ?? []) {
    if (r.event !== event) continue;
    if (Object.entries(where).some(([k, v]) => String(r.props?.[k]) !== v)) continue;
    let key = 'all';
    if (by === 'age') key = r.props?.book && bookById[r.props.book] ? derivePrimaryAgeBand(bookById[r.props.book].ageRange) : '(no book)';
    else if (by === 'theme') key = r.props?.book && bookById[r.props.book] ? (bookById[r.props.book].themeIds[0] ?? '(none)') : '(no book)';
    else if (by) key = r.props?.[by] ?? '(unset)';
    out[key] = (out[key] ?? 0) + (r.count ?? 0);
  }
  return out;
};
const pct = (a, b) => (b ? `${((100 * a) / b).toFixed(1)}%` : 'n/a');
const warn = (n) => (n < MIN_SAMPLE ? ' ⚠︎ below minimum sample' : '');

let md = `# Funnel and performance report\n\n`;
md += `Source: ${source}. Range: ${args.from ?? (args.fixture ? 'fixture' : 'last 30 days')} to ${args.to ?? 'now'}. Event schema version ${SCHEMA_VERSION}. Minimum sample ${MIN_SAMPLE} events per segment. Rates are INTENT unless the funnel says outcome.\n\n`;
if (!rows) {
  md += `## No data\n\nNo \`PLAUSIBLE_API_KEY\` in the environment and no \`--fixture\`. The report definitions ran; the numbers cannot. See docs/analytics/BASELINE_2026-09.md for the gap.\n`;
} else {
  for (const f of FUNNELS) {
    md += `## ${f.title} (${f.measures})\n\n`;
    if (f.notes) md += `${f.notes}\n\n`;
    md += `| Step | Events | Rate from previous |\n|---|---|---|\n`;
    let prev = null;
    for (const st of f.steps) {
      const n = count(st.event, st.where).all ?? 0;
      md += `| ${st.event}${st.where ? ' ' + JSON.stringify(st.where) : ''} | ${n}${warn(n)} | ${prev === null ? '' : pct(n, prev)} |\n`;
      prev = n;
    }
    md += '\n';
    const last = f.steps.at(-1);
    for (const dim of f.dimensions) {
      const seg = count(last.event, last.where, dim === 'age' ? 'age' : dim === 'theme' ? 'theme' : dim);
      const keys = Object.keys(seg);
      if (!keys.length) continue;
      md += `By ${dim}: ${keys.sort((a, b) => seg[b] - seg[a]).map((k) => `${k} ${seg[k]}${warn(seg[k])}`).join(' · ')}\n\n`;
    }
  }
  // S5-004 classification: retailer intent per book view, top and bottom, with minimum-sample guard.
  const views = count('Book View', {}, 'book'); const clicks = count('Purchase Click', {}, 'book');
  const rowsB = Object.keys(views).map((b) => ({ book: b, views: views[b], clicks: clicks[b] ?? 0, rate: views[b] ? (clicks[b] ?? 0) / views[b] : 0 }));
  const eligible = rowsB.filter((r) => r.views >= MIN_SAMPLE).sort((a, b) => b.rate - a.rate);
  md += `## Book performance (S5-004): retailer clicks per book view\n\n${eligible.length ? `| Book | Views | Retailer clicks | Rate |\n|---|---|---|---|\n${eligible.map((r) => `| ${r.book} | ${r.views} | ${r.clicks} | ${pct(r.clicks, r.views)} |`).join('\n')}\n\nTop: ${eligible.slice(0, 3).map((r) => r.book).join(', ') || 'n/a'}. Bottom: ${eligible.slice(-3).map((r) => r.book).join(', ') || 'n/a'}. ${rowsB.length - eligible.length} book(s) below the minimum sample are not classified.` : `No book reached ${MIN_SAMPLE} views; nothing is classified.`}\n\n`;
  // S5-013 locale parity
  const byLang = (e) => count(e, {}, 'language');
  const lv = byLang('Form View'); const ll = byLang('Lead Created');
  md += `## Locale parity (S5-013)\n\n| Locale | Form views | Leads | Rate |\n|---|---|---|---|\n${['en', 'fr', 'es'].map((l) => `| ${l} | ${lv[l] ?? 0}${warn(lv[l] ?? 0)} | ${ll[l] ?? 0} | ${pct(ll[l] ?? 0, lv[l] ?? 0)} |`).join('\n')}\n\nA locale whose rate is under half of English with a full sample is a translation or parity gap to investigate.\n\n`;
  // S5-014 age segmentation (only the taxonomy's bands; unknown book ids are surfaced, never invented)
  const unknown = [...new Set((rows ?? []).filter((r) => r.props?.book && !bookById[r.props.book]).map((r) => r.props.book))];
  md += `## Age-band segmentation (S5-014)\n\nBook views by primary age band: ${Object.entries(count('Book View', {}, 'age')).map(([k, v]) => `${k} ${v}`).join(' · ') || 'none'}.\n${unknown.length ? `\n⚠︎ ${unknown.length} unknown book id(s) in the data: ${unknown.join(', ')}. These rows are excluded; validation failed.` : ''}\n\n`;
  md += `## Known gaps\n\n- Retailer purchases are not observable; every purchase figure is an outbound click (intent).\n- Format (paperback / eBook) is chosen on Amazon and is not measurable.\n- Plausible custom properties must be enabled per property in the dashboard for breakdowns to populate.\n`;
}
if (args.out) { writeFileSync(args.out, md); console.log(`report written: ${args.out}`); } else console.log(md);
if (rows) {
  const themeCheck = Object.keys(count('Book View', {}, 'theme')).filter((t) => t !== '(no book)' && t !== '(none)' && !THEMES[t]);
  if (themeCheck.length) { console.error('unknown themes', themeCheck); process.exit(1); }
}
