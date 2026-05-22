# Story Time with Eva — Operational Runbook

Single source of truth for operating, monitoring, and troubleshooting every service used by the site. Read top-to-bottom on first encounter; later, jump to the section you need via the table of contents.

**Site:** https://storytimewitheva.com
**Repo:** https://github.com/PawaSeyni/storytimewitheva
**Local path:** `/Users/papasnguer/Desktop/Organized/17_Completed_Books_Archive/Completed Books/Eva/storytimewitheva`
**Owner:** Eva Gallo (`galloeva2612@gmail.com`)
**Last updated:** 2026-05-21

---

## 📑 Contents

1. [Quick reference table](#quick-reference-table)
2. [GitHub (source code)](#1-github-source-code)
3. [Netlify (hosting + forms)](#2-netlify-hosting--forms)
4. [IONOS (DNS for storytimewitheva.com)](#3-ionos-dns-for-storytimewithevacom)
5. [MailerLite (email + automation)](#4-mailerlite-email--automation)
6. [Plausible (analytics)](#5-plausible-analytics)
7. [Facebook Page](#6-facebook-page)
8. [Instagram](#7-instagram)
9. [Amazon KDP (referenced)](#8-amazon-kdp-referenced)
10. [Pinterest (verification only)](#9-pinterest-verification-only)
11. [Common scenarios](#common-scenarios)
12. [Emergency procedures](#emergency-procedures)
13. [Credentials & access hygiene](#credentials--access-hygiene)
14. [Cadence calendar](#cadence-calendar)

---

## Quick reference table

| Service | Login URL | Account | Tier / Cost | Key ID |
|---|---|---|---|---|
| GitHub | github.com | `PawaSeyni` org | Free | repo: `PawaSeyni/storytimewitheva` |
| Netlify | app.netlify.com | galloeva2612@gmail.com (Google SSO) | Free (`nf_team_dev`) | site_id `4dad1660-e50b-4fa6-ad71-309b87569282` |
| IONOS | login.ionos.com | Eva's IONOS account | Annual renewal (~$15/yr typical) | domain `storytimewitheva.com` |
| MailerLite | dashboard.mailerlite.com | galloeva2612@gmail.com | Trial → Free or $9/mo | account `2363396` |
| Plausible | plausible.io | galloeva2612@gmail.com | 30-day trial → $9/mo (or migrate to GoatCounter free) | script `pa-gzJ4DP5LRQ39ZXessq04G` |
| Facebook | facebook.com | profile id `61590158550516` | Free | Page `facebook.com/storytimewitheva` |
| Instagram | instagram.com | `@galloeva2612` | Free | — |
| Amazon KDP | kdp.amazon.com | Eva's KDP account | Per-book royalties | author URL `amazon.com/author/evagallo` |
| Pinterest | pinterest.com | Eva's account (verified) | Free | domain verify code `54badc00b81b728d0e9295635e297353` |

---

## 1. GitHub (source code)

**Purpose:** Stores all site source, deploys auto-trigger to Netlify on push to `main`.

**Repo:** https://github.com/PawaSeyni/storytimewitheva
**Branch model:** Push directly to `main`. No PR/review workflow yet. (Add one if collaborators join.)

### Routine

| Frequency | Task |
|---|---|
| On every change | Local edit → `git add` → `git commit -m "feat/fix(scope): summary"` → `git push origin main` |
| Weekly | Glance at commit history to confirm no stray commits |
| Quarterly | Bump npm dependencies (`npm outdated`, then `npm update` with care) |

### How to push from this machine

```bash
cd "/Users/papasnguer/Desktop/Organized/17_Completed_Books_Archive/Completed Books/Eva/storytimewitheva"
rm -f .git/index.lock .git/HEAD.lock   # Cowork-sandbox quirk; harmless on Mac
git add <files>
git commit -m "feat(scope): one-line summary"
git push origin main
```

### Troubleshooting

| Symptom | Fix |
|---|---|
| `Permission denied (publickey)` | Re-add SSH key to GitHub or switch to HTTPS + PAT |
| `fatal: not a git repository` | Wrong cwd — re-run `cd` to repo root |
| `stale .git/index.lock` | `rm -f .git/index.lock .git/HEAD.lock` |
| Pre-push test/lint failure | Read the error, fix locally, retry |

---

## 2. Netlify (hosting + forms)

**Purpose:** Builds the Vite project on each push, serves the static site at storytimewitheva.com, captures Contact form submissions, runs Lighthouse audits.

**Dashboard:** https://app.netlify.com/projects/storytimewitheva
**Project name:** `storytimewitheva`
**Site ID:** `4dad1660-e50b-4fa6-ad71-309b87569282`
**Build command:** `npm run build` (defined in `netlify.toml`)
**Publish dir:** `dist`
**Plan:** Free tier (`nf_team_dev`)

### Custom domain

- Primary: `storytimewitheva.com` (HTTPS via Let's Encrypt, auto-renews ~60 days before expiry)
- Alias: `www.storytimewitheva.com` (CNAME → netlify.app)
- Legacy: `storytimewitheva.netlify.app` (301-redirects to apex via `netlify.toml` rule)

### Forms

- Active form: `contact` (defined as hidden static `<form>` in `index.html`, scanned by Netlify's HTML build scanner)
- Submissions visible at: **Site → Forms** in the dashboard
- Email notification rule: forwards every submission to `galloeva2612@gmail.com` (set up under **Project configuration → Notifications → Form submission notifications**)

### Routine

| Frequency | Task |
|---|---|
| Push-driven | Watch deploy status. Builds auto-trigger on every push to `main`. Typical build ~12 s. |
| Weekly | Check **Forms** tab for new contact submissions. (Email notifications already fire, but keep an eye out for spam.) |
| Monthly | Glance at **Analytics → Bandwidth** to make sure free-tier limits aren't approaching |
| Per major change | Watch the Lighthouse plugin report in the deploy summary |

### Troubleshooting

| Symptom | First check | Then check |
|---|---|---|
| **Build failed** | Deploy log in dashboard | TypeScript errors? Push a fix. |
| **Site shows old version** | Hard reload (`Cmd+Shift+R`); deploy "Published" status | Cloudflare DNS cache; wait up to TTL (3600s) |
| **Form submissions not arriving** | Forms tab — are submissions showing? | If yes → notification rule. If no → form-name match between Contact.tsx and index.html |
| **HTTPS broken** | Domain settings → SSL/TLS status | Re-trigger "Verify DNS configuration" — Let's Encrypt should auto-retry |
| **Custom domain not resolving** | DNS resolution via `dns.google/resolve?name=storytimewitheva.com&type=A` (must return `75.2.60.5`) | IONOS DNS settings (see section 3) |

### Smoke tests

After any deploy, navigate to:
- `https://storytimewitheva.com/` — home loads
- `https://storytimewitheva.com/books` — book grid renders, images load
- `https://storytimewitheva.com/bilingual-starter-kit.pdf` — PDF serves
- `https://storytimewitheva.netlify.app/` — should 301-redirect to apex

---

## 3. IONOS (DNS for storytimewitheva.com)

**Purpose:** Domain registrar and DNS provider. Domain points to Netlify.

**Dashboard:** Log into IONOS customer area → Domains & SSL → click `storytimewitheva.com` → DNS section.

### Current DNS records (DO NOT MODIFY without need)

| Type | Host | Value | Purpose |
|---|---|---|---|
| A | `@` | `75.2.60.5` | Apex → Netlify load balancer |
| CNAME | `www` | `storytimewitheva.netlify.app` | www → Netlify |
| MX | `@` | `mx00.ionos.com` | Email routing |
| MX | `@` | `mx01.ionos.com` | Email routing |
| TXT | `@` | `v=spf1 include:_spf-us.ionos.com ~all` | SPF email auth |
| CNAME | `_dmarc` | `dmarc.ionos.com` | DMARC email auth |
| CNAME | `_domainconnect` | `_domainconnect.ionos.com` | IONOS internal |
| CNAME | `s1-ionos._domainkey` | `s1.dkim.ionos.com` | DKIM email signing |
| CNAME | `s2-ionos._domainkey` | `s2.dkim.ionos.com` | DKIM email signing |
| CNAME | `s42582890._domainkey` | `s42582890.dkim.ionos.com` | DKIM email signing |
| CNAME | `autodiscover` | `adsredir.ionos.info` | Outlook autodiscovery |

**⚠️ The A record and `www` CNAME are website infrastructure. Everything else is email infrastructure — leave it alone unless you're intentionally changing email providers.**

### Routine

| Frequency | Task |
|---|---|
| Annual | Watch for IONOS renewal email; renew before expiry to avoid downtime |
| If switching email providers | Update MX, SPF, DKIM (intentional change — plan carefully) |
| If switching hosts | Update A record `@` and CNAME `www` (and update Netlify accordingly) |

### Troubleshooting

| Symptom | Action |
|---|---|
| Site stops resolving | Verify A record still says `75.2.60.5`. If not, restore it. |
| Email stops working | Verify all MX/SPF/DKIM records intact. If accidentally deleted, copy from this runbook. |
| Let's Encrypt SSL renewal fails | Check for any new CAA records that would block Let's Encrypt. If any non-Let's-Encrypt CAA records exist, delete them. |
| DNS changes not propagating | Wait up to TTL (3600s = 1 hour). Verify via https://dnschecker.org/#A/storytimewitheva.com |

---

## 4. MailerLite (email + automation)

**Purpose:** Captures signups from the site, runs welcome automation (4-email drip).

**Dashboard:** https://dashboard.mailerlite.com
**Account ID:** `2363396`
**Workspace:** `Storytimewitheva` (currently on 14-day trial — must convert or downgrade before expiry)

### Key resources

| Resource | ID | URL fragment |
|---|---|---|
| Group | `187942568670005101` | `storytimewitheva-signups` |
| Embed form | `187942934227715798` | `jsonp/2363396/forms/187942934227715798/subscribe` |
| Welcome automation | `187944859858895989` | `/automations/187944859858895989` |
| Custom field | (system) | `language` (text: en/es/fr) |
| Custom field | (system) | `lead_magnet` (text: starter-kit + others as added) |

### How the funnel works (data flow)

1. Visitor fills out `EmailSignup.tsx` on storytimewitheva.com
2. `EmailSignup.tsx` POSTs (no-cors) to the MailerLite JSONP endpoint with `fields[email]`, `fields[name]`, `fields[language]`, `fields[lead_magnet]`
3. MailerLite creates a subscriber, sends double-opt-in confirmation
4. Subscriber clicks confirmation → joins `storytimewitheva-signups` group
5. Welcome automation triggers (subscriber joined group → fire Email 1 immediately, then delays 3 / 4 / 5 days between Emails 2, 3, 4)

### Welcome automation contents (current)

| # | Email | Subject | Delay | PDF link |
|---|---|---|---|---|
| 1 | Welcome | 🎉 Your Bilingual Starter Kit is here! · ¡Aquí está! · Le voici ! | Immediate | bilingual-starter-kit.pdf |
| 2 | Reading habits | Make bilingual reading stick 📖 · ¡Que se quede! · Que ça reste ! | +3 days | parents-guide.pdf |
| 3 | Flashcards | Printable bilingual flashcards inside ✂️ · Tarjetas · Cartes | +4 days | bilingual-flashcards.pdf |
| 4 | Bedtime | Calmer bedtimes in 5 steps 🌙 · Noches calmadas · Soirées calmes | +5 days | bedtime-routine.pdf |

### Routine

| Frequency | Task |
|---|---|
| Daily (launch phase) | Check **Subscribers** count growth |
| Weekly | Review **Automation stats** (Sent / Opened / Clicked / Unsubscribed) for welcome sequence. Watch open rates < 20% as a signal subject lines need work |
| Monthly | Export subscriber list (Subscribers → Export) as backup CSV. Save to `/Eva/MailerLite_Backups/YYYY-MM.csv` |
| Quarterly | Refresh email copy / images if open rates trending down |
| As-needed | Add new lead magnets (upload PDF, create new automation, tag with new `lead_magnet` value) |

### Troubleshooting

| Symptom | First check |
|---|---|
| **Subscribers not joining group** | Test the form on the live site → check MailerLite Subscribers list for new entry within ~30 sec. If POST returns HTTP 503 to browser: that's normal under `no-cors` — the subscriber still records. |
| **Emails not sending** | Automation enabled? (`enabled: true` via MailerLite MCP, or top-right shows "Pause" not "Activate"). Subscriber confirmed double-opt-in? |
| **Wrong subject / wrong banner on an email** | Open automation → click email → edit. Subject in the side panel, banner inside the block editor. Click Save → Done editing. Re-verify via MailerLite MCP. |
| **Subscriber complains they didn't receive Email N** | Subscribers tab → search subscriber → Activity tab → check delivery status for each automation step |
| **Trial expired** | Pick plan (Free for ≤1K subs, or Growing Business $10/mo for more). Or migrate to GoatCounter/MailerLite competitor — see migration playbook in scenarios. |

### How to edit the welcome automation safely

1. Pause the automation first (top-right button). **Warning:** pausing may remove subscribers currently queued mid-sequence.
2. Make your edits (subject lines via right panel; design via Edit content → block editor).
3. Click Save / Done editing.
4. Click Activate to re-enable.
5. Verify via MailerLite MCP that `enabled: true`.

### Adding a new lead magnet (e.g., a Halloween coloring pack)

1. Upload PDF to `/public/halloween-coloring.pdf` in the repo, push.
2. In MailerLite → Forms → create a new embedded form or add a new tag/group.
3. Update the `lead_magnet` field value in the new signup form's hidden field.
4. (Optional) Create a new automation triggered by `lead_magnet: halloween-coloring`.

---

## 5. Plausible (analytics)

**Purpose:** Privacy-friendly pageview + event tracking. GDPR-compliant, no cookies, no consent banner needed.

**Dashboard:** https://plausible.io
**Site:** `storytimewitheva.com`
**Script ID:** `pa-gzJ4DP5LRQ39ZXessq04G`
**Trial:** 30 days from signup; then ~$9/mo (Growth plan, ≤10K monthly pageviews)

### Goals enabled (already configured)

- File Download — fires on any PDF download (starter kit, nurture PDFs, etc.)
- Outbound Link Click — fires on every external link click (Amazon, Instagram, Facebook)
- Form Submission — fires on contact form submissions
- 404 — fires on broken page errors

### Routine

| Frequency | Task |
|---|---|
| Daily (launch phase) | Check pageview trend + top pages + top sources |
| Weekly | Review conversion goals: PDF downloads, Amazon clicks, signups |
| Monthly | Export raw stats CSV for archival. Note any unusual traffic patterns. |
| When trial ends | Decide: pay for Plausible OR migrate to GoatCounter (free up to 100K pageviews) |

### Troubleshooting

| Symptom | Fix |
|---|---|
| No pageviews showing | Open site in browser, view DevTools → Network → confirm `pa-gzJ4DP5LRQ39ZXessq04G.js` loads (status 200). Then DevTools → Console → type `window.plausible` — should be a function. |
| Specific goal not firing | In Plausible: Site settings → Goals → check the goal exists. For outbound clicks: ensure links have `target="_blank"` (most do, check `<a>` tags). |
| Plausible dashboard offline | Plausible occasionally has outages — check status.plausible.io. Stats backfill once they're back. |

### Migration path to GoatCounter (free alternative)

If trial ends and you'd rather not pay:
1. Sign up at goatcounter.com (free for personal, up to 100K pageviews/mo)
2. Get the script tag from GoatCounter
3. Replace the Plausible script in `index.html` with the GoatCounter one
4. Push, deploy. Goals migrate manually.

---

## 6. Facebook Page

**Purpose:** Brand presence for Story Time with Eva. Linked from site Footer + Contact.

**URL:** https://facebook.com/storytimewitheva
**Vanity URL secured:** Yes (`storytimewitheva`)
**Admin:** Eva Gallo (personal profile `61590158550516`)
**Profile pic:** Rooster-at-sunrise illustration (`Headshots/evagallo_authorpic_v2_chatgpt.png`)
**Cover photo:** Not yet uploaded (deferred — see PUNCH_LIST long-term backlog)

### Routine

| Frequency | Task |
|---|---|
| Weekly | Post once (book recommendation, behind-the-scenes, parent tip). Respond to comments/messages. |
| Monthly | Check Insights → Followers + reach + engagement |
| Quarterly | Refresh cover photo for seasonal relevance |

### Troubleshooting

| Symptom | Fix |
|---|---|
| Lost admin access | Use Facebook account recovery via `galloeva2612@gmail.com` |
| Page got unpublished accidentally | Settings → General → Page Visibility → toggle back to "Page published" |
| Spam comments | Settings → Profanity Filter → set to Strong, manually delete obvious spam |
| Want to run ads later | Switch to Meta Business Suite. Cover photo + filled About section required for ad approval. |

### Posting cadence ideas (for when content engine is ready)

- Mondays: book of the week
- Wednesdays: parent reading tip
- Fridays: behind-the-scenes (illustration, craft demo)

---

## 7. Instagram

**Account:** https://www.instagram.com/galloeva2612/
**Linked from:** site Footer + Contact

Less developed than Facebook. No automated wiring. Posts are manual.

### Routine (when active)

| Frequency | Task |
|---|---|
| Weekly | 1-2 posts (book covers, illustration teasers, family reading moments) |
| Monthly | Stories highlights refresh |

### Future expansion notes

- 9-grid book cover collage idea (designed in Canva from existing covers in `src/assets/covers/`)
- Reels: bring picture book activities to life (read-alouds, craft demos)
- Cross-post to Facebook for amplification

---

## 8. Amazon KDP (referenced)

**Author URL:** https://www.amazon.com/author/evagallo
**Dashboard:** https://kdp.amazon.com (Eva's account)

This site references KDP — book cards link to Amazon product pages or author URL. It does NOT manage KDP directly.

### Books currently linked from the site (`src/data/books.ts`)

8 live on Amazon with ASIN-based URLs, 3 newer titles falling back to author URL until they list (Colors Mixed Up, Rainbow Symphony, Tower That Touched the Sky).

### Routine (KDP-side, not site-side)

- Monthly: KDP Reports → check royalties, sales
- After each new title listing: update `src/data/books.ts` — swap author URL fallback for the real ASIN URL, push

### When a new book launches

1. KDP-side: publish via KDP (see `pawa-press-ads` skill for full launch playbook)
2. Site-side: edit `src/data/books.ts` → add new book entry with localized title/subtitle/description/theme + ASIN URL + cover image
3. Add cover image to `src/assets/covers/`
4. Push to main, Netlify auto-deploys
5. (Optional) Send an announcement to MailerLite subscribers — new Campaign

---

## 9. Pinterest (verification only)

**Account:** Eva's Pinterest
**Site verification:** Added via `<meta name="p:domain_verify" content="54badc00b81b728d0e9295635e297353"/>` in `index.html`

This site is verified with Pinterest but no Pin-related code is on the site yet. Pinterest pins exist in `/Eva/Online Strategy/` and `/Eva/Social_Media_Complete_Package/` — to be scheduled with a tool like Tailwind or posted manually.

### Future expansion notes

See PUNCH_LIST long-term backlog → "Social & marketing channels" cluster.

---

## Common scenarios

### "The site is down" / users report 502

1. Open https://storytimewitheva.com/ in incognito → does it load?
2. If yes, your local cache was stale. Hard refresh `Cmd+Shift+R`.
3. If no, check Netlify dashboard → Deploys → latest deploy status
4. If "Failed" → click deploy → read logs, fix, push fix
5. If "Published" but site still down → check `dns.google/resolve?name=storytimewitheva.com&type=A` returns `75.2.60.5`
6. If A record changed → restore at IONOS (see section 3)
7. If everything looks right and still broken → check Netlify status page: https://www.netlifystatus.com

### "A subscriber didn't receive their welcome email"

1. MailerLite → Subscribers → search by email
2. Check Status: `unconfirmed` means they didn't click double-opt-in → resend confirmation (Actions → Resend confirmation)
3. Check `language` field is populated correctly (`en/es/fr`)
4. Check Activity tab → look for "Automation queued" entries for `Storytimewitheva — Welcome + Bilingual Starter Kit`
5. If no automation entries → subscriber didn't actually join the group; check form submission flow
6. Ask the subscriber to check spam folder — `galloeva2612@gmail.com` sender on free Gmail can land in spam

### "Want to add a new book to the site"

1. Add cover image: `src/assets/covers/new-book.jpg` (square, ~800×800, ~150-200 KB)
2. Edit `src/data/books.ts`:
   ```ts
   {
     id: 'new-book-slug',
     coverImage: newBookCover,  // import at top of file
     ageRange: '4-7 years',
     languages: ['🇺🇸', '🇪🇸', '🇫🇷'],
     amazonUrl: dp('ASINHERE'),  // or AUTHOR_URL fallback
     featured: false,
     title: { en: '...', es: '...', fr: '...' },
     subtitle: { en: '...', es: '...', fr: '...' },
     description: { en: '...', es: '...', fr: '...' },
     theme: { en: '...', es: '...', fr: '...' },
   },
   ```
3. Run `npm run build` locally to verify TypeScript compiles
4. Commit + push: `git commit -m "feat(books): add <title>" && git push`
5. Netlify auto-deploys ~12s later
6. Smoke test on production: navigate to `/books` and confirm the new card appears with all 3 languages working

### "Want to add a new lead magnet (PDF)"

1. Drop PDF into `public/your-new-magnet.pdf` (kebab-case filename, no spaces)
2. Commit + push
3. Verify URL: `https://storytimewitheva.com/your-new-magnet.pdf` returns 200, application/pdf
4. (Optional) Add to MailerLite welcome automation as a new email step, OR create a new standalone campaign linking to it

### "Welcome automation needs an update (e.g., new subject line)"

1. Open automation: https://dashboard.mailerlite.com/automations/187944859858895989
2. Click **Pause** top-right. ⚠️ Pausing may remove subscribers currently queued mid-sequence — review impact first.
3. Edit the email (click email card → side panel for subject/preheader → Edit content for body).
4. Click Save → Done editing.
5. Click **Activate** to re-enable.
6. Verify via MailerLite MCP (if available in your session) or smoke-test by signing up a fresh test email.

### "Pre-launch checklist for a new book"

- [ ] Book added to `src/data/books.ts` with real ASIN once live
- [ ] Cover image added to `src/assets/covers/`
- [ ] MailerLite Campaign drafted (subject + body + CTA to Amazon listing)
- [ ] Facebook post drafted
- [ ] Instagram post drafted
- [ ] (Optional) Pinterest pin uploaded
- [ ] Smoke test all links: book card → Amazon, social → Pages
- [ ] Schedule everything for launch day
- [ ] Update PUNCH_LIST.md with launch date

### "Custom domain renewal is coming up"

1. Watch for IONOS renewal email (~30 days before expiry)
2. Log into IONOS → renew domain (~$15/yr typical)
3. If you let it lapse: domain enters grace period (~30 days) then becomes available to anyone. Don't let this happen — it's catastrophic for SEO + brand.

### "Need to undo a bad push to main"

```bash
cd "/Users/papasnguer/Desktop/Organized/17_Completed_Books_Archive/Completed Books/Eva/storytimewitheva"
git log --oneline -10                # find the bad commit hash
git revert <hash>                    # creates a new commit that undoes the bad one
git push origin main                 # Netlify auto-deploys the revert
```

Never use `git reset --hard` + `git push --force` on `main` — it rewrites history and breaks anyone else's clone.

---

## Emergency procedures

### Site is completely down for >30 minutes

1. Check Netlify status: https://www.netlifystatus.com
2. Check DNS resolution via Google's DoH
3. If both fine but still down: revert the last commit (see scenario above)
4. If catastrophic (e.g., domain hijacked): contact IONOS support immediately, change all account passwords

### MailerLite is sending wrong/broken emails to real subscribers

1. **Pause automation immediately:** https://dashboard.mailerlite.com/automations/187944859858895989 → Pause top-right
2. Identify the affected step(s) by viewing recent activity (Activity tab)
3. Edit the broken email
4. Test send to yourself before re-activating
5. Re-activate

### Account compromise (Google, GitHub, Netlify, etc.)

1. Change password immediately on the affected service
2. Revoke all active sessions (Settings → Sessions or Security)
3. Audit recent activity for unauthorized changes
4. If GitHub: rotate any committed secrets (none should be committed, but verify)
5. Enable 2FA if not already on

### MailerLite trial expires unexpectedly

- The welcome automation **stops sending** the moment the trial expires
- Subscribers can still sign up via the form (free tier allows up to 1K subs and 12K emails/mo)
- Options:
  - Upgrade to a paid plan ($10+/mo)
  - Stay on free tier (good for ≤1K subs + ≤12K emails)
  - Migrate to a free competitor (GoatCounter for analytics, MailerLite competitor for email — note these are different products)

---

## Credentials & access hygiene

**Rule #1: Never commit secrets to git.** No API keys, no passwords, no private tokens.

### Where credentials live

| Credential | Storage |
|---|---|
| GitHub password | Eva's password manager (1Password, Bitwarden, etc.) |
| Netlify access | Google SSO (galloeva2612@gmail.com) |
| MailerLite | Browser session (galloeva2612@gmail.com) |
| IONOS | Eva's password manager |
| Plausible | Browser session |
| Facebook/Instagram | Standard social login |

### Hardening recommendations

- Enable 2FA on: Google account (gates Netlify + MailerLite + Plausible), GitHub, IONOS, Facebook
- Use a password manager for all logins; no password reuse
- Review active sessions quarterly (Google → Security → Your devices)

### Public IDs that are safe to share

- MailerLite group/form/automation IDs (in this runbook)
- Netlify site ID
- Plausible script ID
- Facebook/Instagram URLs
- Pinterest domain verify code

These are public identifiers, not secrets. Anyone can see them in browser DevTools.

---

## Cadence calendar

A reference rhythm for ongoing operations:

### Daily (5 min, launch phase)

- Plausible dashboard quick-look (pageviews, top pages)
- Netlify deploy status (any failures?)

### Weekly (~30 min)

- MailerLite: subscriber growth, automation open/click rates
- Netlify: Forms tab for new contact submissions
- Facebook: post 1× and respond to comments
- Instagram: post 1-2× (if active)
- Plausible: weekly conversion review (PDF downloads, Amazon clicks)

### Monthly (~1 hour)

- Export MailerLite subscriber CSV → archive to `/Eva/MailerLite_Backups/YYYY-MM.csv`
- Plausible: monthly traffic summary, identify trends
- KDP: royalty review
- Check IONOS for any account/billing notices
- Review PUNCH_LIST.md and update

### Quarterly (~2 hours)

- npm dependency update on the repo
- Refresh Facebook cover photo / Instagram bio for seasonal relevance
- Review automation email copy for any stale content
- Lighthouse re-audit (check Performance/A11y/SEO scores still 95+)
- Account security audit: rotate sessions on critical accounts

### Annual

- Domain renewal at IONOS (~$15)
- Plausible subscription review ($108/yr if continuing)
- MailerLite plan review (free vs paid)

---

## Update log

- **2026-05-21** — Initial runbook created after full Gate A/B/C launch session. All services documented as of this date.
- _(Add entries here as services / processes change)_
