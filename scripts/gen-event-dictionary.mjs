// Generates docs/analytics/EVENT_DICTIONARY.md from src/analytics/events.ts (S5-021).
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEvents, loadFunnels } from './lib/catalog.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { EVENTS, SCHEMA_VERSION } = await loadEvents();
const { FUNNELS, MIN_SAMPLE } = await loadFunnels();
const md = `# Event Dictionary, schema version ${SCHEMA_VERSION} (S5-021)

> Generated from \`src/analytics/events.ts\` by \`npm run gen:events\`; a test fails when this file is
> stale. Live names are what \`track()\` sends and what Plausible goals reference; the spec's
> snake_case names are aliases. Every property is on the default-deny allowlist in
> \`src/lib/analytics.ts\`; UTM keys are attached from the URL automatically.

## Deprecation process
An event is never renamed in place: add the new event, mark the old one deprecated with its
replacement, keep both for one release, remove the old one, and bump the schema version only
when a property's meaning changes. Reports state the schema version they were built on.

## Events

| Live name | Spec alias | Kind | Required | Optional | Allowed values | Owner | Privacy |
|---|---|---|---|---|---|---|---|
${EVENTS.map((e) => `| \`${e.name}\`${e.reserved ? ' (reserved)' : ''}${e.deprecated ? ' (deprecated → ' + e.deprecated.replacedBy + ')' : ''} | ${e.alias ?? ''} | ${e.kind} | ${e.required.map((r) => '`' + r + '`').join(', ')} | ${e.optional.map((r) => '`' + r + '`').join(', ')} | ${Object.entries(e.values ?? {}).map(([k, v]) => `${k}: ${v.join(' \\| ')}`).join('; ')} | ${e.owner} | ${e.reserved ? 'not instrumented: ' + e.reserved : e.privacy} |`).join('\n')}

## Funnels (derived, \`src/analytics/funnels.ts\`)

Minimum sample before a rate is reported without a warning: ${MIN_SAMPLE} events in the segment.

| Funnel | Steps | Group by | Measures |
|---|---|---|---|
${FUNNELS.map((f) => `| ${f.title} | ${f.steps.map((s) => '`' + s.event + '`' + (s.where ? ' {' + Object.entries(s.where).map(([k, v]) => k + '=' + v).join(', ') + '}' : '')).join(' → ')} | ${f.dimensions.join(', ')} | ${f.measures}${f.notes ? ': ' + f.notes : ''} |`).join('\n')}
`;
writeFileSync(path.join(ROOT, 'docs', 'analytics', 'EVENT_DICTIONARY.md'), md);
console.log(`event dictionary: ${EVENTS.length} events, ${FUNNELS.length} funnels`);
