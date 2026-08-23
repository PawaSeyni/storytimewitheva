# Story Time with Eva — Backlog

Running backlog distilled from the 2026-08-10 full site audit and items parked across
recent sessions. Priority: **P1** (do soon) · **P2** (worth doing) · **P3** (someday / owner call).
Status: `ready` (actionable now) · `decision` (needs an owner call first) · `human` (needs a
person, not code) · `blocked`.

> **Sources folded in:** the full site audit (2026-08-10) and the **Lead-Magnet Remediation
> Plan** PDF (2026-08-10) — the latter is tracked as its own section at the bottom with a
> status-vs-current mapping, since ~half of it already shipped in PRs #86–#88.

---

## Engineering — ready to build

| ID | Item | Pri | Effort | Notes |
|----|------|-----|--------|-------|
| E1 | **Remove dead translation keys** `t.blurb` / `t.bullets` / `t.submit` in `EmailSignup.tsx` (0 references after PR #88, all 3 langs) | P2 | XS | One-commit cleanup. Audit finding #1. |
| E2 | **Remove the `?lm=` hydration reflow** — offer currently jumps to the top on deep-link load (prerender has it bottom, client re-renders to top). Reorder via CSS `order`/flex instead of DOM position so there's no flash. | P2 | S–M | Cosmetic only; end state already correct. Flagged in PR #86. |
| E3 | **Content-Security-Policy header** — the one remaining best-practice gap. Needs per-path handling (SPA strict vs `/games/*` relaxed for inline scripts). Recommend shipping **report-only** first. | P3 | M | Low security value here (near-zero XSS surface). Owner call. |
| E4 | **Capture UTM params + store `source`/`campaign` on the subscriber** (remediation §4/§7). Read `utm_*` from the URL, pass through the subscribe function into MailerLite fields (today only `language` + `lead_magnet` are stored). | P1 | S–M | Needs new MailerLite fields. Pairs with D6. |
| E5 | **Remove distractions on paid landing** (remediation P1) — strip the navbar/catalog/Activities CTAs from the paid-traffic experience. Only meaningful once D5 is decided. | P2 | S–M | Depends on D5. |

## Decision-gated — need an owner call before code

| ID | Item | Pri | Notes |
|----|------|-----|-------|
| D1 | **Organic homepage = bundle pitch?** After #88 the no-`?lm=` signup pitches the 5-resource bundle it delivers. Intended, but confirm it's the desired default vs. a softer newsletter framing. | P3 | Product/copy decision. |
| D2 | **User-submitted puzzle bank** — lets visitors submit puzzles. Requires a backend + moderation, which reverses the no-backend static architecture. | P3 | Architecture decision. |
| D3 | **Marketplace localization (Amazon OneLink)** — link `.ca/.es/.fr` (+`.co.uk`) Associates accounts, then drop the OneLink `<script>` into `index.html`. Feasibility confirmed; blocked on owner account linking. | P3 | `blocked` on owner. |
| D4 | **Host the QA spec at a public URL** (Option B) — noindexed `/qa/` path on Netlify so an external tester gets a real link (no Claude login). Ready on say-so. | P2 | Optional; file already delivered. |
| D5 | ✅ **DECIDED + SHIPPED** — templated dedicated landing pages. One `LandingPage` component serves `/free/:magnet` (localized `/es/free/…`, `/fr/free/…`), reusing `EmailSignup`'s money-path logic; distraction-free (no navbar/footer/feedback), noindex, prerendered, out of the sitemap. All 5 magnets × 3 langs populated from config. Proven with Spanish Bedtime Routine. **Owner remaining:** repoint ad/pin URLs to `/free/…` (optional `?lm=` still works, so no redirects needed). | P1 | — |
| D6 | ✅ **DECIDED + SHIPPED (privacy-first v2)** — switched Cloudflare → **Plausible** (cookieless, aggregate, no PII), instrumented the 8-event funnel taxonomy (Landing View → Form View → Form Start → Form Submit → Lead Created → Magnet Download; Book View, Purchase Click) via the existing `track()` layer with a hard PII guard + auto-UTM. **NO** Meta Pixel/GA4/cookies/session-replay/visitor-IDs — preserves the brand's privacy promises and reconciles the (previously stale) privacy policy. CPAS from MailerLite. | P1 | Owner: ensure the Plausible account has storytimewitheva.com added. |

## Marketing / content

| ID | Item | Pri | Notes |
|----|------|-----|-------|
| M1 | **Solicit honest Amazon reviews** — all 18 titles have **0** reviews, so the compliant `aggregateRating` pipeline (built, dormant) shows nothing. The single unlock for star rich-snippets; `npm run refresh-ratings` lights them up automatically once reviews exist. | P1 | Highest-leverage growth item. |
| M2 | **Re-verify Amazon prices periodically** — site says "See price on Amazon" (no number), so low-risk; spot-check listings stay live/buyable. | P3 | `human`, recurring. |

## Verification — needs a person (not code)

| ID | Item | Pri | Notes |
|----|------|-----|-------|
| V1 | **Welcome email reflects the bundle** — the on-page 5-link delivery is verified; confirm the MailerLite welcome email content also reflects the bundle (dashboard access needed). | P1 | Owner / MailerLite. |
| V2 | **Amazon author link** — returned 503 to automated checks (likely bot-throttling); click it in a real browser to confirm it's live. | P2 | Quick human check. |
| V3 | **External QA pass** — hand `docs/qa-funnel-conversion-spec.md` (or the HTML page) to a tester; run the P0 cases. §D needs owner MailerLite confirmation. | P2 | `human`. |
| V4 | **Privacy/Terms final lawyer skim** — governing-law / no-warranty wording (Pawa Press Inc., Ontario). | P3 | Legal. |
| V5 | **Usability testing** — recruit 4–6 parent/child pairs, run the 6-task test (`docs/usability-test-plan.md`). | P3 | `human`. |

## Explicitly decided — NOT doing (recorded so they don't get re-opened)

- **Sitemap `<lastmod>`** — a naive uniform build-date is worthless-to-harmful (Google distrusts it); accurate per-URL git dates aren't worth the effort. Leave absent.
- **`offers`/price in Book JSON-LD** — the site shows no on-page price (owner's defer-to-Amazon decision) and Google requires marked-up price to be visible; would risk a manual action. Owner chose "ratings only."
- **Article schema on Resources** — all 6 articles live on one `/resources/` URL; per-page Article markup is non-compliant there.

---

## Lead-Magnet Remediation Plan — status vs. current build

Source: `Story_Time_with_Eva_Lead_Magnet_Remediation_Plan.pdf` (2026-08-10), cross-referenced
against PRs #86–#88. **The plan and the shipped work agree on the diagnosis**, and the recent
funnel PRs already satisfy roughly half of it. Two things stand out:

- **Architecture fork (D5):** the plan wants *dedicated landing pages separate from the
  homepage*; we shipped *offer-first on the homepage* — which the plan's Core Principle
  explicitly argues against ("do not make the homepage perform two incompatible jobs"). This is
  a real strategic decision, not a bug.
- **Analytics gap (D6) — RESOLVED (PR #93):** funnel instrumentation shipped on **Plausible** (custom
  8-event taxonomy), replacing the earlier page-views-only Cloudflare tier. The Meta Lead event was
  intentionally dropped (privacy-first — no ad pixel); conversion signal to Pinterest is server-side CAPI.

| Plan item | Pri | Status | Where / next step |
|---|---|---|---|
| Match offer to ad (headline/image/CTA/download) | P0 | ✅ **done** | #86–88: per-magnet copy + preview + correct delivery |
| Language routing via `/es/` `/fr/` | P0 | ✅ site-ready · ⚠️ ads | routes render; **repoint ad URLs to paths** (owner) |
| Form above the fold | P1 | ✅ **done** | offer-first (#86) |
| Connect magnet logic (URL → asset) | P1 | ✅ **done** | `?lm=` → correct magnet/bundle |
| Confirmation + immediate delivery | P1 | ✅ **done** | success screen + download link(s) |
| QA before advertising resumes | P1 | ✅ **done** | `docs/qa-funnel-conversion-spec.md` |
| Stop mismatched traffic (pause legacy ad URLs) | P0 | ⬜ owner | pause/repoint ads in Meta/Pinterest |
| Dedicated landing pages (separate from homepage) | P0 | ✅ **done (D5)** | templated `/free/:magnet`, all 5×3 combos |
| Clean path URLs (`/free/bedtime-routine`) | P0 | ✅ **done (D5)** | `?lm=` still works too, so no redirects needed |
| Remove distractions (nav/catalog on paid pages) | P1 | ✅ **done (D5)** | landing pages render zero site chrome |
| Instrument funnel + **Meta Lead event** | P1 | ✅ **funnel done (D6)** · Meta Lead dropped (privacy) | Plausible 8-event taxonomy (#93); no ad pixel by design |
| Capture + store UTM `source`/`campaign` on subscriber | P1 | ❌ → E4 | only `language`+`lead_magnet` stored today |
| Post-signup: recommend books after download | P1 | ⚠️ partial | success delivers; doesn't yet cross-sell |
| Nurture sequence (5 value-first emails, Day 0/1/3/5/7) | P2 | ⚠️ partial | MailerLite automation exists; align cadence (owner) |
| A/B test key conversion elements | P2 | ❌ not done | owner; needs D6 first |
| Controlled relaunch (Spanish bedtime-routine first) | — | ⬜ owner | ads strategy, after the above |

**Bottom line:** the "match/deliver/QA" half is shipped and live. The outstanding half is
either **owner/ads work** (pause & repoint ads, nurture, relaunch) or hangs off the two
decisions **D5** (dedicated pages vs. homepage) and **D6** (an analytics tool that can measure
the funnel). Nothing else is code-blocked.
