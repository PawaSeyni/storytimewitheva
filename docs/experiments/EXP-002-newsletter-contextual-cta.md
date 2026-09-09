# EXP-002: Contextual newsletter CTA (S5-010)

**Id:** `newsletter-contextual-cta-v1` · **Status:** draft, pending baseline approval
**Owner:** growth (PawaSeyni) · **Audience:** visitors who scroll to the newsletter block on the
books, activities, resources and about pages, EN/FR/ES

**Hypothesis.** A one-line contextual lead above the newsletter offer on content pages increases
signups per form view compared with the plain offer, because it connects the printables to what
the visitor was just doing.

**Variants (50/50).** `contextual`: the localized contextual line shipped in #191. `plain`: the same
block without the line.

**Primary metric.** `Lead Created` per `Form View`, by variant and placement.
**Guardrails.** Form View per page view unchanged; MailerLite unsubscribe rate does not rise week
over week; axe serious/critical stays at zero.
**Duration.** 28 days. **Minimum sample.** 300 form views per variant and placement cell.
**Analysis rule.** Two-proportion z-test at 95% per placement; per locale only where each cell
reaches the minimum sample.
**Stop rule.** Stop if the unsubscribe rate rises more than 25% relative in any week, or a variant is
at least 30% worse with 150+ form views each.

**Start checklist.** Baseline approved · Plausible properties enabled · `startAt` set · status
`active` · owner initials here: ______
