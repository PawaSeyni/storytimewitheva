# EXP-001: Book detail CTA hierarchy (S5-009)

**Id:** `book-cta-hierarchy-v1` · **Status:** draft, pending baseline approval (release gate 11.1)
**Owner:** growth (PawaSeyni) · **Audience:** all visitors on book detail pages, EN/FR/ES, bots excluded

**Hypothesis.** Offering "Listen to this story" as the primary action above the Buy group increases
retailer clicks per book view, because a parent who has heard the opening is more likely to buy
than one who has only seen the cover.

**Variants (50/50).** `control`: the page as shipped in #191 (status, favorite, share; Buy group).
`listen-first`: a prominent read-aloud button (title, subtitle and description narrated in the
site language) rendered directly above the Buy group, with the same Buy group below.

**Primary metric.** `Purchase Click` per `Purchase CTA View` on book pages, by variant.
**Guardrails.** Read Aloud per Book View does not drop more than 10% relative; axe serious/critical
stays at zero on the variant (it is in the a11y route list); Client Error rate on `/books/:id` does
not rise; Lighthouse mobile performance on `/books` stays above 70.
**Duration.** 28 days. **Minimum sample.** 400 exposures per variant.
**Analysis rule.** Two-proportion z-test at 95% on click-through per exposure, computed from Plausible
with the `experiment` and `variant` properties; below the minimum sample the result is "no decision".
**Stop rule.** Stop early only if a guardrail breaks for three consecutive days, or the variant is at
least 30% worse with 200+ exposures each.

**Accessibility.** Both variants are keyboard-operable; the new button carries the existing
read-aloud accessible name; no focus order change.

**Start checklist.** Baseline approved (BASELINE_2026-09.md) · Plausible properties `experiment`,
`variant` enabled · `startAt` set · status `active` · owner initials here: ______
