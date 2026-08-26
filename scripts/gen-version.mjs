// Stamp the build with the commit that produced it, so "which SHA is in
// production?" is answerable from production itself instead of from the Netlify
// dashboard (or from trust). Writes dist/version.json, served uncached — see the
// /version.json header rule in netlify.toml.
//
// Runs AFTER `vite build` (which wipes dist/) and BEFORE the prerender step.
//
// Failing to resolve a SHA is FATAL. A build that cannot say what it is must not
// ship: an unprovenanced deploy silently breaks the verification chain, and the
// whole point is that the chain cannot be silently broken.
import { writeFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const DIST = path.resolve('dist');

function git(args) {
  try {
    return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
}

// Netlify sets COMMIT_REF/BRANCH/CONTEXT/DEPLOY_ID in the build image; git is the
// local fallback so `npm run build` on a laptop produces the same shape.
const commit = process.env.COMMIT_REF || git('rev-parse HEAD');
const branch = process.env.BRANCH || git('rev-parse --abbrev-ref HEAD') || 'unknown';

if (!/^[0-9a-f]{40}$/.test(commit)) {
  console.error('❌ gen:version could not resolve a commit SHA.');
  console.error('   Set COMMIT_REF (Netlify does this automatically) or build from a git checkout.');
  console.error('   Refusing to emit an unprovenanced build.');
  process.exit(1);
}

if (!existsSync(DIST)) {
  console.error(`❌ gen:version: ${DIST} does not exist — run this after \`vite build\`.`);
  process.exit(1);
}

const version = {
  commit,
  shortCommit: commit.slice(0, 7),
  branch,
  // "production" | "deploy-preview" | "branch-deploy" on Netlify, "local" off it.
  // This is what stops a deploy preview from being mistaken for production.
  context: process.env.CONTEXT || 'local',
  deployId: process.env.DEPLOY_ID || null,
  deployUrl: process.env.DEPLOY_URL || null,
  builtAt: new Date().toISOString(),
};

writeFileSync(path.join(DIST, 'version.json'), JSON.stringify(version, null, 2) + '\n');
console.log(`Stamped dist/version.json — ${version.shortCommit} (${branch}, ${version.context}).`);
