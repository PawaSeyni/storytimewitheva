# Merchandising controls (S5-018)

Public ordering is deterministic and explainable; nothing is ranked by a hidden score.

| Control | Where it applies | Rule | Approved |
|---|---|---|---|
| `featured: true` on a book record | home "Find your next favorite story", the signup-success "keep going" links | catalog order among featured titles; at most four featured at a time | yes (existing since Sprint 1) |
| catalog order (position in `books.data.ts`) | `/books`, collections without `bookOrder`, theme top-ups | as written in the file | yes |
| `bookOrder` on a collection record | that collection only | validated subset of members; the rest follow catalog order | yes (Sprint 7, CR-05 for overrides) |
| `relatedBookIds` on a book | "You might also like" editorial tier | signed-off pairs first, theme top-up second, limit 3 | yes (Sprint 6, owner decision) |
| seasonal `window` | seasonal collections | open by date, else empty state | yes (Sprint 7) |

Not approved and not present: sales-based ranking, paid placement, personalization of the public catalog order (personalized suggestions live only on the dashboard and the home "picked for you" block, driven by the visitor's own local library).

Tests: `tests/funnel/related-books.test.mjs` (order, no duplicates, determinism), `tests/funnel/collection-records.test.mjs` (`bookOrder`), `tests/seo/monetization.test.mjs` (featured count, links).
Reports classify performance from measured events (`npm run report:funnels`, S5-004); a decision to feature or reorder is recorded here with the date and the report it came from.
