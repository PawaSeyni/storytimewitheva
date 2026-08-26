// Close the SHA → Netlify deploy → production chain: ask PRODUCTION what it is
// running and compare it to the commit you expect.
//
//   npm run verify:deploy              # expects local HEAD to be live
//   npm run verify:deploy -- <sha>     # expects a specific commit to be live
//   VERIFY_URL=https://deploy-preview-1--storytimewitheva.netlify.app \
//     VERIFY_CONTEXT=deploy-preview VERIFY_BRANCH=pull/1/head npm run verify:deploy -- <sha>
//
// Note for previews: Netlify sets BRANCH to `pull/<n>/head` on PR deploys, NOT
// the branch name — so VERIFY_BRANCH must be that, or left unset. Production
// deploys from main do report `main`, which is why it is the default below.
//
// Exits non-zero on any break in the chain, so it works in a script or a gate,
// not just by eye. Deliberately checks context and branch too: a green
// /version.json from a deploy preview is NOT proof that production shipped.
import { execSync } from 'node:child_process';

const SITE = process.env.VERIFY_URL || 'https://storytimewitheva.com';
// A preview/branch URL is a legitimate target, but then "production" is the
// wrong expectation — allow it to be overridden explicitly.
const EXPECT_CONTEXT = process.env.VERIFY_CONTEXT || (process.env.VERIFY_URL ? null : 'production');
const EXPECT_BRANCH = process.env.VERIFY_BRANCH || (process.env.VERIFY_URL ? null : 'main');

function git(args) {
  try {
    return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
}

const expected = (process.argv[2] || git('rev-parse HEAD')).trim();
if (!/^[0-9a-f]{7,40}$/.test(expected)) {
  console.error('❌ No commit to verify against. Pass a SHA or run inside a git checkout.');
  process.exit(1);
}

const fail = (msg, hint) => {
  console.error(`❌ ${msg}`);
  if (hint) console.error(`   ${hint}`);
  process.exit(1);
};

// Cache-bust as well as trusting the no-store header: a CDN edge that ignored it
// would otherwise hand back the PREVIOUS deploy's SHA and read as a pass.
const url = `${SITE}/version.json?_=${Date.now()}`;
let res;
try {
  res = await fetch(url, { cache: 'no-store', redirect: 'follow' });
} catch (e) {
  fail(`Could not reach ${SITE}: ${e.message}`);
}

if (res.status === 404) {
  fail(
    `${SITE} does not publish /version.json (HTTP 404).`,
    'The deployed build predates deploy provenance, or the build did not run gen:version.',
  );
}
if (!res.ok) fail(`${SITE}/version.json returned HTTP ${res.status}.`);

let live;
try {
  live = await res.json();
} catch {
  fail(`${SITE}/version.json is not valid JSON.`, 'A catch-all rewrite may be serving HTML in its place.');
}

console.log(`Target      ${SITE}`);
console.log(`Expected    ${expected}`);
console.log(`Live        ${live.commit} (${live.branch}, ${live.context})`);
console.log(`Built at    ${live.builtAt}`);
if (live.deployId) console.log(`Deploy ID   ${live.deployId}`);

// Accept a short SHA on either side so `git rev-parse --short` output works.
const n = Math.min(expected.length, String(live.commit || '').length);
if (!live.commit || live.commit.slice(0, n) !== expected.slice(0, n)) {
  fail(
    `Production is NOT running ${expected}.`,
    'The deploy has not finished, the build failed and the last good deploy is still live, or the merge never deployed.',
  );
}
if (EXPECT_CONTEXT && live.context !== EXPECT_CONTEXT) {
  fail(`Expected context "${EXPECT_CONTEXT}" but got "${live.context}".`, 'This looks like a preview URL, not production.');
}
if (EXPECT_BRANCH && live.branch !== EXPECT_BRANCH) {
  fail(`Expected branch "${EXPECT_BRANCH}" but got "${live.branch}".`);
}

console.log(`\n✅ Chain verified: ${expected.slice(0, 7)} → deploy → ${SITE}`);
