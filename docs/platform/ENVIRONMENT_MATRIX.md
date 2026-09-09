# Environment Matrix and Secret Isolation (S8-016)

| Environment | URL | Built from | Data written | Secrets available | Purpose |
|---|---|---|---|---|---|
| Local | `vite` dev / `vite preview` | working tree | none (subscribe function absent; forms post nowhere) | none | development |
| Test (CI) | `vite preview` on GitHub Actions | PR head | none (subscribe endpoint and analytics stubbed in-page) | none | gates |
| Deploy preview | `deploy-preview-<n>--storytimewitheva.netlify.app` | PR head, Netlify | **real**: the subscribe function runs with production MailerLite credentials, Netlify Forms capture, Plausible receives events for the preview host | production function secrets | review; treat signups on previews as real |
| Production | `storytimewitheva.com` | `main` | real | production | live |

## Secrets
| Name | Where | Used by | Client bundle? |
|---|---|---|---|
| `MAILERLITE_API_KEY`, `MAILERLITE_GROUP` | Netlify env (all contexts) | `netlify/functions/subscribe.mjs` | never |
| `PINTEREST_CONVERSIONS_TOKEN`, `PINTEREST_AD_ACCOUNT_ID` | Netlify env | `netlify/functions/_pinterest.mjs` | never |
| `SIGNUP_LIMIT_*`, `SIGNUP_LIMITER_STRICT` | Netlify env (optional) | `_ratelimit.mjs` | never |
| Build-provided: `CONTEXT`, `BRANCH`, `DEPLOY_URL`, `DEPLOY_ID`, `COMMIT_REF`, `NETLIFY`, `CI` | Netlify / GitHub | build scripts | `version.json` carries commit + deploy id only |

No `VITE_*` variables exist, so nothing from the environment is inlined into the bundle.
`scripts/check-bundle-secrets.mjs` scans `dist/` for the secret names and token-shaped
strings after every build in CI; Netlify's secret scan runs on every deploy (362 files, 0
matches on the last deploy).

## Isolation gap, recorded
Deploy previews use production function secrets, so a signup on a preview creates a real
subscriber. Netlify deploy contexts can scope `MAILERLITE_GROUP` to a test group for
`deploy-preview`; that is an owner dashboard change and is the recommended fix (readiness
assessment, risk R-03).
