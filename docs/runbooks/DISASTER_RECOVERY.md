# Disaster Recovery Runbook and Exercise Results (S8-015)

## Objectives

| Asset | Where it lives | RPO | RTO | Basis |
|---|---|---|---|---|
| Code and content | GitHub `main` (every change is a merged PR) | 0 (last merge) | 5 min to republish, 15 min to rebuild from source | exercise below |
| Configuration | `netlify.toml`, `_redirects` (generated), `budgets.json`, workflows in git; Netlify env vars in the dashboard | 0 for git-held config; env vars: owner keeps them in the password manager | 15 min | env vars must be re-entered by hand if the Netlify site is recreated |
| Subscribers | MailerLite (owner account) | MailerLite's | n/a from our side | out of our control; exports are the owner's task |
| Form submissions | Netlify Forms | Netlify's | n/a | forward notifications to email (done) |
| Analytics | Plausible | Plausible's | n/a | aggregates only |
| Deploy history | Netlify keeps every deploy; last known good is always republishable | 0 | 2 min | Netlify UI |

## Procedures

1. **Rollback to the last known good deployment** (a bad deploy is live): Netlify → Deploys →
   pick the previous `ready` production deploy → *Publish deploy*. Takes about two minutes;
   no build. Then `npm run verify:deploy -- <that commit>` confirms what is live. Follow with
   a `git revert` PR so `main` matches production. Owner or engineering; needs Netlify access.
2. **Bad commit, site still fine**: `git revert <sha>` → PR → merge; Netlify rebuilds in
   about one minute; the post-deploy workflow verifies the commit and the routes.
3. **Deleted or corrupt content**: `npm run check:content` names the broken record;
   `git checkout <last-good> -- src/data/<file>` restores it; run the gate again; PR.
4. **Recreate from version-controlled sources** (Netlify site lost): clone, `npm ci`,
   set the four env vars, `npm run build`, deploy (or connect the repo to a new Netlify
   site: build settings are read from `netlify.toml`), re-add DNS, re-enable Forms
   notifications and the Lighthouse plugin (in `netlify.toml` already), and turn OFF
   *Pretty URLs* under Build & deploy → Post processing (site setting, not in the repo;
   set 2026-09-10 for PD-05 so `/books` and `/books/` both serve 200 with no redirect:
   `netlify api updateSite --data '{"site_id":"<id>","body":{"processing_settings":{"html":{"pretty_urls":false}}}}'`).
5. **Build skipped for credits** (Netlify: "Skipped due to account credit usage exceeded"):
   production keeps the last good deploy; the post-deploy job fails with "production never
   reported <sha>". Restore credits in the Netlify billing page, then retry the skipped deploy
   from the dashboard or push a commit. Happened 2026-06-15 and 2026-09-10.
6. **Optional third party unavailable**: Plausible down → pages unaffected, events buffer
   then drop; MailerLite down → signup shows an error, nothing is written; Amazon image host
   down → alt text, featured covers are local; Pinterest API down → swallowed.

## Exercise, 2026-09-09 (timed, real commands)

| Drill | Result |
|---|---|
| Clone `main` fresh into an empty directory | 4 s |
| `npm ci` | 4 s |
| `npm run build` from the clean clone | 175 s, 222 routes, exit 0 |
| **Recreate from source, total** | **183 s** |
| Delete a collection record, run the content gate | detected: exit 1, 3 errors naming the record |
| Restore the file from git, run the gate | 0 errors; under 1 s |
| `git revert HEAD` on a scratch clone | 1 s to a revertible commit; a push then triggers a ~52 s Netlify build |
| Netlify republish of a previous deploy | not exercised on production in this sprint (owner-run; would replace the live site for the drill's duration). Last known good at the time of writing: commit `1503122`, deploy `6aa1d1de541c7c0009f80bda` |

Continuity with third parties blocked is exercised permanently by the cookie-free and
storage-denied suites (analytics aborted, subscribe stubbed) on every PR and daily on
production.
