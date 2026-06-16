# Profile auth — decision memo

**Question:** should the "My Reading Profile" move from localStorage-only to a
real account system (for multi-device sync), and if so, which?

**Recommendation: No. Keep it localStorage-only.** Optionally add a no-backend
export/import so progress is portable without accounts. Rationale below.

## What is actually at stake

The entire profile is three arrays of non-identifying tokens
(`src/lib/progress.ts`):

```
booksRead:           ["book-id", ...]
booksWantToRead:     ["book-id", ...]
activitiesCompleted: ["activity-slug", ...]
```

No names, no emails, no ages, nothing personal. This is the single biggest fact
in the decision: today the site collects **zero personal data** and has **zero
account-security surface**. For a child-directed site that is a real asset, not
an accident (see [[storytimewitheva]] privacy posture).

The only things accounts would buy:
1. Cross-device / cross-browser sync of that reading list.
2. Survival of the list if the user clears browser storage.

Both are low-value for the audience (parents reading picture books with kids 3
to 9), and the data lost in the worst case is "which of 18 books we ticked."

## Options

### 1. Stay localStorage-only (RECOMMENDED)
- **Cost / maintenance:** zero. No backend, no DB, no auth, no emails.
- **Privacy / legal:** stays completely out of COPPA scope (no personal info
  collected from or about under-13s) and out of GDPR/CCPA data-subject duties.
  This is the same reason the project chose a static, backend-free architecture
  in the first place.
- **Security:** no credentials to leak, no account-takeover surface.
- **Trade-off:** no cross-device sync; clearing storage loses the list.
- **Mitigation (cheap, no backend):** add "Export my progress" (download the
  JSON) + "Import progress" (upload it) on the Profile page. Solves portability
  and backup for the rare power user, still zero PII, still no accounts. ~half a
  day of work, fits the existing localStorage model.

### 2. Netlify Identity
- **Status:** deprecated. Netlify no longer recommends Identity for new projects
  and has stopped provisioning new instances; they point to external providers.
  Treat this as not available. (Verify current status before relying on it.)
- Even if available, it means parent accounts + stored per-user data, i.e. PII
  and COPPA scope, to sync a list of book ids. Not worth it.

### 3. Supabase (Postgres + Auth)
- **Capability:** real accounts, real cross-device sync, row-level security.
- **Cost:** free tier exists (then ~$25/mo Pro at scale), but the true cost is
  not dollars: it adds a backend and a user database, which **reverses the
  deliberate static / no-backend decision** the whole project is built on, adds
  ongoing maintenance and a security surface, and pulls a children's site into
  **COPPA scope** (verifiable parental consent, disclosures, deletion flows).
- **Verdict:** appropriate only if the product later needs genuine user data
  (user-generated content, social features, purchases, multi-device accounts as
  a core promise). Massive overkill for syncing a reading list.

## Decision criteria — when to revisit

Add auth (and prefer a managed external provider over rolling your own) only if
one of these becomes true:
- Cross-device sync becomes a top user request with evidence (watch the feedback
  widget + Plausible).
- You add features that inherently need server-side per-user data (e.g. a
  user-submitted puzzle bank, comments, saved custom content, accounts as a paid
  feature).
- You start collecting any PII for another reason anyway, so the COPPA cost is
  already paid.

Until then, the privacy-first, zero-PII posture is a feature. Keep it, and add
export/import if portability ever actually comes up.

## Suggested next step

If you accept the recommendation: I can build the **export/import** progress
feature (Profile page, download/upload JSON, localized EN/ES/FR, no backend) as
a small, self-contained change. Say the word.
