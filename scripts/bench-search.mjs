// S8-007 search benchmark: index size and query latency at current and projected scale.
// Repeatable: node scripts/bench-search.mjs [--json]
import { loadSearchIndex } from './lib/catalog.mjs';

const { buildSearchIndex, searchRecords } = await loadSearchIndex();
const index = buildSearchIndex();
const QUERIES = ['kindness', 'bonté', 'valentía', 'cloud', 'a', 'story map', 'gratitude', 'zzz', 'emo', 'read aloud'];
const LANGS = ['en', 'fr', 'es'];

function bench(records, rounds) {
  let n = 0;
  const t0 = performance.now();
  for (let i = 0; i < rounds; i++) for (const q of QUERIES) for (const l of LANGS) { searchRecords(records, q, { language: l }); n++; }
  return { queries: n, avgMs: (performance.now() - t0) / n };
}
const scale = (k) => Array.from({ length: k }, (_, i) => index.map((r) => ({ ...r, id: `${r.id}-${i}` }))).flat();

const out = {
  records: index.length,
  jsonBytes: Buffer.byteLength(JSON.stringify(index)),
  byType: Object.fromEntries(['book', 'activity', 'collection', 'journey', 'resource'].map((t) => [t, index.filter((r) => r.type === t).length])),
  current: bench(index, 200),
  x10: { records: index.length * 10, ...bench(scale(10), 40) },
  x50: { records: index.length * 50, ...bench(scale(50), 8) },
};
if (process.argv.includes('--json')) console.log(JSON.stringify(out, null, 2));
else {
  console.log(`search index: ${out.records} records, ${(out.jsonBytes / 1024).toFixed(1)} KB JSON`);
  console.log(`  current: ${out.current.avgMs.toFixed(3)} ms/query (${out.current.queries} queries)`);
  console.log(`  x10 (${out.x10.records}): ${out.x10.avgMs.toFixed(3)} ms/query`);
  console.log(`  x50 (${out.x50.records}): ${out.x50.avgMs.toFixed(3)} ms/query`);
}
