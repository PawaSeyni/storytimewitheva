// Shared helper: parse the lead-magnet registry out of EmailSignup.tsx source.
// We parse the source (rather than importing the TSX) for the same reason
// scripts/prerender.mjs does: it keeps the tests dependency-free and runnable
// under `node --test`, with no React/JSX/analytics import chain to satisfy.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..', '..');

const SRC = path.join(ROOT, 'src', 'components', 'EmailSignup.tsx');

/** The six slugs that must ship a landing page. Kept explicit so a magnet
 *  silently disappearing from the registry fails a test instead of passing. */
export const EXPECTED_SLUGS = [
  'bedtime-routine',
  'bilingual-starter-kit',
  'bilingual-bundle',
  'bilingual-flashcards',
  'parents-guide',
  'follow-up-activities',
  'leo-and-the-wolf',
];

/** Parse LEAD_MAGNETS into { slug: { tag, preview|null, pdf:{en,es,fr} } }. */
export function parseMagnets() {
  const src = readFileSync(SRC, 'utf8');
  const start = src.indexOf('const LEAD_MAGNETS');
  const end = src.indexOf('const DEFAULT_MAGNET');
  if (start < 0 || end < 0) throw new Error('Could not locate LEAD_MAGNETS block in EmailSignup.tsx');
  const block = src.slice(start, end);

  // Top-level magnet keys are at 2-space indent: `  'slug': {`
  const keyRe = /\n {2}'([a-z0-9-]+)': \{/g;
  const marks = [];
  let m;
  while ((m = keyRe.exec(block))) marks.push({ slug: m[1], index: m.index });

  const magnets = {};
  for (let i = 0; i < marks.length; i++) {
    const slug = marks[i].slug;
    const seg = block.slice(marks[i].index, i + 1 < marks.length ? marks[i + 1].index : block.length);
    const preview = seg.match(/preview:\s*'([^']+)'/)?.[1] ?? null;
    const tag = seg.match(/tag:\s*'([^']+)'/)?.[1] ?? null;
    const pdfBlock = seg.match(/pdf:\s*\{([^}]*)\}/)?.[1] ?? '';
    const pdf = {
      en: pdfBlock.match(/en:\s*'([^']+)'/)?.[1] ?? null,
      es: pdfBlock.match(/es:\s*'([^']+)'/)?.[1] ?? null,
      fr: pdfBlock.match(/fr:\s*'([^']+)'/)?.[1] ?? null,
    };
    magnets[slug] = { tag, preview, pdf };
  }
  return magnets;
}

/** LANDING_SLUGS array from scripts/prerender.mjs (the build-abort guard). */
export function parseLandingSlugs() {
  const src = readFileSync(path.join(ROOT, 'scripts', 'prerender.mjs'), 'utf8');
  const line = src.match(/const LANDING_SLUGS = \[([^\]]*)\]/)?.[1] ?? '';
  return [...line.matchAll(/'([a-z0-9-]+)'/g)].map((x) => x[1]);
}
