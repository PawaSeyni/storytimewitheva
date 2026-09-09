// S8-016: nothing secret-shaped ships in dist/. Scans every text file for the names of the
// secrets the functions use and for token-shaped strings. Runs after the build in CI.
import { readdirSync, statSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const NAMES = ['MAILERLITE_API_KEY', 'PINTEREST_CONVERSIONS_TOKEN', 'MAILERLITE_GROUP', 'PINTEREST_AD_ACCOUNT_ID'];
const TOKEN_SHAPES = [
  /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/, // JWT
  /\b(sk|pk|ghp|gho|xox[abp])_[A-Za-z0-9]{20,}\b/, // common API key prefixes
  /\bAKIA[0-9A-Z]{16}\b/, // AWS access key
];
const walk = (dir) => readdirSync(dir).flatMap((f) => { const p = path.join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const text = walk(DIST).filter((f) => /\.(js|html|css|json|xml|txt|webmanifest)$/.test(f));
const hits = [];
for (const f of text) {
  const body = readFileSync(f, 'utf8');
  for (const n of NAMES) if (body.includes(n)) hits.push(`${path.relative(DIST, f)}: mentions ${n}`);
  for (const re of TOKEN_SHAPES) { const m = re.exec(body); if (m) hits.push(`${path.relative(DIST, f)}: token-shaped string ${m[0].slice(0, 12)}…`); }
}
console.log(`check-bundle-secrets: ${text.length} files scanned, ${hits.length} hits`);
for (const h of hits) console.error(`FAIL ${h}`);
process.exit(hits.length ? 1 : 0);
