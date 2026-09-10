# Dependency Policy (S8-014)

## Facts (baseline 2026-09)
7 runtime and 20 dev dependencies, 249 installed; `package-lock.json` committed; Node 20 on
Netlify and CI, 22 locally. After the non-breaking `npm audit fix` in #180 four advisories remained; React Router 7
(2026-09-10) cleared two. Vite 8 + @vitejs/plugin-react 6 (2026-09-10) cleared the last two; `npm audit` is clean and the allowlist is empty. Node is pinned to 22 in `netlify.toml` and both workflows (Vite 8 requires ^20.19 or >=22.12). The two advisories that were: vite 5 and esbuild (dev-server-only path traversal / request
exposure; the production build is static files and unaffected), react-router 6 open redirect
via `//` and `\` paths (the site never navigates to user-supplied paths).

## Rules
1. **Lockfile is the truth.** `npm ci` everywhere; a PR that changes `package-lock.json` says why.
2. **Cadence.** Dependabot opens grouped PRs weekly for minors/patches and monthly for majors (`.github/dependabot.yml`); the full CI suite is the gate; no auto-merge.
3. **Vulnerabilities.** `npm audit --audit-level=high` runs in CI. A high or critical advisory blocks unless it is listed in `audit-allowlist.json` with the advisory id, the reason it does not apply (dev-only, unreachable code path), an owner, and a review date no more than 90 days out.
4. **Majors are their own PRs**, one at a time, with the release notes read and the full suite green: planned order React Router 7 (removes two advisories), Vite 8 + esbuild (removes two), then React 19, Tailwind 4, TypeScript 7, ESLint 10.
5. **Node** is pinned in `netlify.toml` and CI; bump both together, never one.
6. **New dependency** needs: a reason a few lines of code would not do, license compatible with a commercial site, weight noted against the JavaScript budget if it ships to the browser, and a row in the external data-flow inventory if it talks to the network.
7. **Ownership.** Engineering pair owns updates; the owner is informed when a major changes behavior visible to visitors.

## Exceptions
Recorded in `audit-allowlist.json` and reviewed at each release audit.
