# Privacy & Terms — review, jurisdiction, and compliance checklist

A structured review of the live Privacy (`src/pages/Privacy.tsx`) and Terms
(`src/pages/Terms.tsx`) pages. This is a non-lawyer review to (a) confirm the
text matches what the site actually does, (b) flag the gaps, and (c) tee up the
one decision the owner must make (jurisdiction). **A lawyer should still do the
final skim** — both files already carry that note in code.

## Verdict

The **Privacy policy is in good shape** and accurately reflects the implemented
data practices. The **Terms page is missing a governing-law / jurisdiction
clause** (the main gap), and both pages need the jurisdiction + "last updated"
date confirmed.

## What's solid (Privacy — matches the code)

Cross-checked each claim against the actual integrations:

| Policy says | Reality in code | OK? |
|---|---|---|
| Newsletter → MailerLite, email + optional first name, double opt-in | `EmailSignup.tsx` | ✅ |
| Contact → Netlify Forms (name, email, subject, message) | `Contact.tsx` + `index.html` | ✅ |
| Analytics → Plausible, cookieless, aggregate, no personal data | `index.html` | ✅ |
| Reading profile → browser localStorage only, never transmitted | `src/lib/progress.ts` | ✅ |
| No child accounts, logins, chat, comments | true | ✅ |
| No data sales, no ad trackers, no cookies-for-tracking | true | ✅ |
| Rights under GDPR / UK GDPR / CCPA / PIPEDA / Law 25 | listed | ✅ |

One small addition to consider: the policy lists MailerLite, Netlify, and
Plausible, but the site also now runs an on-site **feedback widget** that posts
to **Netlify Forms** (rating, comment, page, language — no personal data unless
the user types some into the free-text comment). Worth a one-line mention under
the Netlify Forms section for completeness.

## The gaps to fix

1. **Terms: add a Governing law / jurisdiction clause.** There is currently
   none. Standard ToS names the governing law and where disputes are resolved.
   Blocked on the jurisdiction decision below. Draft clause is ready (see end).
2. **Confirm the jurisdiction** (the one real decision — see next section).
3. **Confirm the entity name** "Pawa Press Inc." is the exact registered legal
   name.
4. **"Last updated" date** — both say "June 2026"; refresh when the jurisdiction
   edit lands.
5. Optional: add the feedback widget to the Privacy data-practices list.

## Jurisdiction — the decision only the owner can make

The governing-law clause must name the jurisdiction whose law applies. That is
normally the entity's **place of incorporation** and/or **principal place of
business**. Signals in the current text point to **Canada** (the Privacy page
foregrounds **PIPEDA** and **Québec Law 25**), but that is an inference, not a
confirmation.

**Owner: confirm where Pawa Press Inc. is incorporated and operates** (country
and province/state). That determines:
- the governing-law + venue clause in the Terms,
- which privacy law is primary (e.g. PIPEDA + Law 25 if Québec; PIPEDA if
  another province; layer GDPR/CCPA for EU/California visitors regardless),
- the "operator" disclosures.

Once you give me the jurisdiction, I will drop the clause into `Terms.tsx`
(EN/ES/FR) and refresh the date.

## Compliance checklist (cross-checked vs actual practice)

Because the site collects **no personal data from children** and only
parent-provided email/contact data, exposure is low. Status against the major
regimes:

- **COPPA (US, under-13):** Site is child-friendly in content but parent-
  directed in function — no child accounts, no collection from children. Policy
  says so and offers a deletion contact. ✅ Low risk. (Keep it that way: do not
  add child logins/UGC without revisiting.)
- **GDPR / UK GDPR (EU/UK):** Lawful basis for newsletter = consent (double
  opt-in ✅). Analytics is cookieless/no-PII ✅. Access/erasure honored via
  email ✅. Consider naming a contact for data requests (already
  contact@storytimewitheva.com ✅).
- **CCPA/CPRA (California):** No sale/share of personal info ✅; disclosure of
  categories collected (email, contact message) present ✅.
- **PIPEDA / Québec Law 25 (Canada):** Consent + purpose limitation ✅. If
  Québec, Law 25 adds a duty to **name a person responsible for privacy** and to
  publish that contact — worth confirming with counsel if Québec applies.
- **General:** privacy policy is plain-language, trilingual, and matches
  practice ✅. Terms cover use, IP, affiliate disclosure, no-warranty, external
  links ✅; only governing-law is missing.

## Ready-to-insert governing-law clause (fill the jurisdiction)

Drop into Terms as a new "Governing law" section once jurisdiction is confirmed.
Replace `[JURISDICTION]` (e.g. "the Province of Québec, Canada").

- EN: "These terms are governed by the laws of [JURISDICTION], without regard to
  conflict-of-laws rules. Any dispute will be subject to the courts located in
  [JURISDICTION]."
- ES: "Estos términos se rigen por las leyes de [JURISDICTION], sin tener en
  cuenta sus normas sobre conflictos de leyes. Cualquier disputa se someterá a
  los tribunales de [JURISDICTION]."
- FR: "Les présentes conditions sont régies par les lois de [JURISDICTION], sans
  égard aux règles de conflits de lois. Tout litige sera soumis aux tribunaux
  de [JURISDICTION]."

(Wording is a starting point; counsel may prefer a specific venue/arbitration
formulation.)

## Next step

Tell me the jurisdiction (and confirm the exact entity name), and I will: add
the governing-law section to `Terms.tsx` in all three languages, optionally add
the feedback widget to the Privacy list, and refresh the "last updated" date.
Then it goes to counsel for the final skim.
