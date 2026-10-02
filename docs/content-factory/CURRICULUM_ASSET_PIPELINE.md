# Curriculum Asset Pipeline

Status: Active

Date: 2026-10-02

## Purpose

Deterministically generate Bhavya-branded cover cards for every K–12 AI
curriculum module and lesson from canonical registry data. One canonical
source per concept: content from the registries, ages from `bands.ts`, colors
and fonts from `tokens.css`, watermark from `brand/logo.svg`.

Design: `docs/superpowers/specs/2026-10-02-curriculum-asset-pipeline-design.md`

## Flow

```
Registry data + tokens + logo
  ↓
generate-curriculum-assets.ts (tsx)
  ↓
public/curriculum/{modules,lessons}/<id>.svg + manifest.json
  ↓
committed to git → Cloudflare Workers deploy serves them over CDN
  ↓
assets:check inside `pnpm test` (existing ci.yml test job) fails on drift
```

No direct publishing without regeneration: changing a module title, band
ages, brand token, or logo requires re-running the generator and committing
the result.

## Commands

```bash
pnpm --filter @bhavya/ai-institute assets:generate   # regenerate + prune stale
pnpm --filter @bhavya/ai-institute assets:check      # freshness gate (exit 1 on drift)
pnpm --filter @bhavya/ai-institute test              # assets:check + asset-pipeline.test.ts
```

Run from `apps/ai-institute` (the generator resolves inputs relative to the
package root). `pnpm test` runs the freshness check first, so CI enforces it
without a dedicated workflow. A path-filtered `.github/workflows/assets.yml`
is available as optional optimization but requires a GitHub token with the
`workflow` scope to commit.

Run from `apps/ai-institute` (the generator resolves inputs relative to the
package root).

## Outputs

| Path                                 | Contents                                       |
| ------------------------------------ | ---------------------------------------------- |
| `public/curriculum/modules/<id>.svg` | 1200×630 module cover (86 files)               |
| `public/curriculum/lessons/<id>.svg` | 1200×630 lesson cover (5 files)                |
| `public/curriculum/manifest.json`    | Machine-readable index (future page consumers) |

Generation is deterministic: assets sorted by id, fixed field order, LF
endings, no timestamps. Re-running with unchanged inputs produces zero diff.

## Free-tier mapping

| Concern  | Choice                                                                                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Compute  | GitHub Actions — `assets:check` embedded in the existing CI test job (free for public repos); optional path-filtered `assets.yml` pending a `workflow`-scoped token |
| Serving  | Existing Cloudflare Workers deployment (`public/` ships with the build)                                                                                             |
| Storage  | Committed to git (~1 MB of SVG); revisit Cloudflare R2 only if size warrants                                                                                        |
| Supabase | Deferred — canonical database is Turso; no Supabase credentials exist; would duplicate the database concept                                                         |
| Vercel   | Deferred — active deploy path is Cloudflare Workers; a second host would duplicate serving                                                                          |

## Governance

- The pipeline may only embed colors present in `tokens.css` or the brand
  logo (enforced by `asset-pipeline.test.ts`).
- Manifest counts are derived from the registries, never written by hand.
- The generator owns `public/curriculum/` (prunes stale files there only).
- Future phases: raster exports in CI, module/lesson page wiring through the
  manifest, carousel decks per `MEDIA_GENERATION.md`.
