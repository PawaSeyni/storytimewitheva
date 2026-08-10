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
| D5 | **⭐ Architecture fork: dedicated landing pages vs. offer-first homepage.** The remediation plan's Core Principle says the homepage must not do two jobs — it wants dedicated paid-landing pages (`/free/bedtime-routine`) separate from the site. We shipped offer-first *on the homepage* (#86). Decide: keep offer-first (done, simpler) or build dedicated pages (plan's rec — cleaner separation, distraction removal, clean URLs, redirects). | P1 | The biggest strategic call. Everything in E5 / remediation "clean URLs / dedicated pages" hangs off this. |
| D6 | **Events-capable analytics for the funnel** (remediation P1/§7). Cloudflare's free tier is **page-views only** — it cannot fire `lead_form_start` / `lead_submit` / `lead_created` / `download` or the **Meta Lead** event. Choose a tool (Meta Pixel + a funnel-events analytics such as paid Plausible / PostHog / GA4), then instrument. | P1 | Blocks measurable ROI on paid traffic. Also unblocks E4. |

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
- **Analytics gap (D6):** the plan's funnel instrumentation + Meta Lead event **cannot** run on
  the current page-views-only Cloudflare tier.

| Plan item | Pri | Status | Where / next step |
|---|---|---|---|
| Match offer to ad (headline/image/CTA/download) | P0 | ✅ **done** | #86–88: per-magnet copy + preview + correct delivery |
| Language routing via `/es/` `/fr/` | P0 | ✅ site-ready · ⚠️ ads | routes render; **repoint ad URLs to paths** (owner) |
| Form above the fold | P1 | ✅ **done** | offer-first (#86) |
| Connect magnet logic (URL → asset) | P1 | ✅ **done** | `?lm=` → correct magnet/bundle |
| Confirmation + immediate delivery | P1 | ✅ **done** | success screen + download link(s) |
| QA before advertising resumes | P1 | ✅ **done** | `docs/qa-funnel-conversion-spec.md` |
| Stop mismatched traffic (pause legacy ad URLs) | P0 | ⬜ owner | pause/repoint ads in Meta/Pinterest |
| Dedicated landing pages (separate from homepage) | P0 | ❌ **decision → D5** | current = offer-first homepage |
| Clean path URLs (`/free/bedtime-routine`) + redirects | P0 | ❌ → D5 | current uses `?lm=` query params |
| Remove distractions (nav/catalog on paid pages) | P1 | ❌ → E5 | depends on D5 |
| Instrument funnel + **Meta Lead event** | P1 | ❌ **gap → D6** | Cloudflare = page views only |
| Capture + store UTM `source`/`campaign` on subscriber | P1 | ❌ → E4 | only `language`+`lead_magnet` stored today |
| Post-signup: recommend books after download | P1 | ⚠️ partial | success delivers; doesn't yet cross-sell |
| Nurture sequence (5 value-first emails, Day 0/1/3/5/7) | P2 | ⚠️ partial | MailerLite automation exists; align cadence (owner) |
| A/B test key conversion elements | P2 | ❌ not done | owner; needs D6 first |
| Controlled relaunch (Spanish bedtime-routine first) | — | ⬜ owner | ads strategy, after the above |

**Bottom line:** the "match/deliver/QA" half is shipped and live. The outstanding half is
either **owner/ads work** (pause & repoint ads, nurture, relaunch) or hangs off the two
decisions **D5** (dedicated pages vs. homepage) and **D6** (an analytics tool that can measure
the funnel). Nothing else is code-blocked.
