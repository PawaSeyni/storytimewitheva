// S8-014: npm audit gate. High/critical advisories fail unless allowlisted with a live review date.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const allow = JSON.parse(readFileSync(new URL('../audit-allowlist.json', import.meta.url), 'utf8')).allow;
const today = new Date().toISOString().slice(0, 10);
let out = '';
try { out = execSync('npm audit --json', { stdio: ['ignore', 'pipe', 'ignore'] }).toString(); }
catch (e) { out = e.stdout?.toString() ?? ''; }
const audit = JSON.parse(out || '{"vulnerabilities":{}}');
const blocking = [];
for (const [name, v] of Object.entries(audit.vulnerabilities ?? {})) {
  if (!['high', 'critical'].includes(v.severity)) continue;
  const a = allow.find((x) => x.package === name);
  if (!a) blocking.push(`${name} (${v.severity}) is not allowlisted`);
  else if (a.review < today) blocking.push(`${name} allowlist entry expired on ${a.review}`);
}
const stale = allow.filter((a) => a.review < today).map((a) => a.package);
console.log(`check-audit: ${Object.keys(audit.vulnerabilities ?? {}).length} advisories, ${blocking.length} blocking, ${allow.length} allowlisted${stale.length ? `, stale: ${stale.join(', ')}` : ''}`);
for (const b of blocking) console.error(`FAIL ${b}`);
process.exit(blocking.length ? 1 : 0);
