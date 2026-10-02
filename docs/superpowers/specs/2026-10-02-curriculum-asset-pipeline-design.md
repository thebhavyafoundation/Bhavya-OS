# Curriculum Asset Pipeline — Design

Date: 2026-10-02
Status: v1, executed autonomously under explicit human directive ("get done with all the work autonomously")

## Assumptions (task message truncated)

The task message ended at `## Architecture` with no content following it. This
design was reconstructed from repository authorities instead of the missing
section:

- `docs/production/PRODUCTION_MANIFESTO.md` — Content Factory is the
  "Knowledge Package to educational asset pipeline"; no new operating systems.
- `docs/content-factory/CONTENT_PIPELINE.md` and `MEDIA_GENERATION.md` —
  Knowledge Package generates educational assets; no direct publishing.
- Task constraints: 8 GB thin client, heavy work in the cloud (GitHub +
  Cloudflare + Supabase + Vercel), $0/month free tiers, Bhavya branding
  (forest/ivory/gold tokens, logo watermark, consistent style).

Assumed intent: a pipeline that deterministically produces Bhavya-branded
visual cover assets for every K–12 AI curriculum module and lesson, verified in
the cloud, served by the existing deployment. Script-format outputs (video
scripts, carousels, threads per `MEDIA_GENERATION.md`) are separate Content
Factory outputs and are out of scope for v1.

## Goals

1. Generate one branded SVG cover card per curriculum module (86) and per
   lesson (5) from canonical registry data — no hand-copied content.
2. Single design source: colors and fonts parsed from
   `packages/platform-ui/src/styles/tokens.css`, watermark inlined from
   `apps/ai-institute/public/brand/logo.svg`, ages/bands from
   `apps/ai-institute/src/lib/curriculum/bands.ts`. No duplicated design system.
3. $0 cloud-only verification and delivery: GitHub Actions runs the freshness
   gate; the existing Cloudflare Workers deployment serves assets over its CDN.
4. Drift-proof: outputs are committed; `--check` fails CI when inputs change
   without regeneration (same pattern as `tokens:check` and `file-map:check`).

## Non-goals (v1)

- No rasterization (no native image dependencies), no paid or AI image APIs.
- No new routes, no page UI wiring — `manifest.json` is the future consumer
  contract.
- No Supabase, no Vercel changes (see Decisions).
- No carousel/video/newsletter generation (future Content Factory phases).

## Architecture

```
ai-module-registry.ts (86) ─┐
lesson-registry.ts (5) ─────┤
bands.ts (ages/labels) ─────┼─▶ generate-curriculum-assets.ts (tsx)
tokens.css (colors/fonts) ──┤        │
brand/logo.svg (watermark) ─┘        ▼
                        public/curriculum/modules/<id>.svg
                        public/curriculum/lessons/<id>.svg
                        public/curriculum/manifest.json
                                     │
              ┌──────────────────────────────────────────────┐
              ▼                                              ▼
   pnpm test = assets:check + vitest             assets.yml (optional,
   (freshness gate rides the existing            pending `workflow`-scoped
   ci.yml test job — enforced)                   credential, see below)
```

- Generator: `apps/ai-institute/src/scripts/generate-curriculum-assets.ts`,
  run with `tsx` (matches `db:migrate` script convention).
- Commands (app `package.json`): `assets:generate`, `assets:check`.
- Determinism: assets sorted by id, fixed field order, LF newlines, no
  timestamps — regeneration with unchanged inputs produces zero diff.
- The generator owns `public/curriculum/` (writes current, removes stale
  files within its own output directories only).

## Card format

Fixed 1200×630 (OG-safe) SVG:

- Background `--color-brand-forest`; top rule `--color-brand-gold`.
- Kicker: band label + canonical ages chip (from `BAND_AGES`).
- Title in `--font-display` (Playfair), ivory, word-wrapped with size fallback
  64 → 56 → 48 → 42 px, max 3 lines.
- Module cards: description (trailing "For ages …" sentence stripped as it
  duplicates the chip) + topics line. Lesson cards: parent module title as
  kicker context.
- Watermark: `brand/logo.svg` inlined bottom-right at reduced opacity with
  `id="watermark"`.
- All text nodes escaped; `<title>`/`<desc>` for accessibility.

## Manifest (`public/curriculum/manifest.json`)

```json
{
  "version": 1,
  "moduleCount": 86,
  "lessonCount": 5,
  "assets": [
    {
      "kind": "module",
      "id": "ja-01",
      "slug": "machines-that-listen",
      "title": "Machines That Listen",
      "band": "junior-a",
      "ages": "Ages 6–8",
      "path": "curriculum/modules/ja-01.svg"
    }
  ]
}
```

Counts are derived from the registries, never literal. Lesson entries carry
the parent `moduleId` and inherit band/ages from it.

## Decisions (free-tier mapping and deferrals)

| Concern           | Choice                                | Rationale                                                                                                                                                          |
| ----------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Compute           | GitHub Actions (`assets.yml`)         | Free for public repos; cloud-first per constraints                                                                                                                 |
| Serving           | Existing Cloudflare Workers deploy    | Assets in `public/` ship with the build; CDN included; $0                                                                                                          |
| Storage           | Committed to git (SVG ≈ 1–3 MB total) | Reviewable, deterministic, zero new infrastructure; revisit R2 only if size warrants                                                                               |
| Supabase          | Deferred                              | Canonical database is Turso (`REPOSITORY_SOURCE_OF_TRUTH.md`); no Supabase credentials or config exist in the repo; adding it would duplicate the database concept |
| Vercel            | Deferred                              | `vercel.json` exists but the active deploy path is Cloudflare Workers (`deploy-cloudflare.yml` on `master`); a second host would create a duplicate serving path   |
| Raster (PNG/WEBP) | Deferred                              | Would add native dependencies for no v1 consumer; SVG covers every in-repo use case                                                                                |

## Error handling

- Generate mode: exits non-zero on missing tokens file, unparseable registry,
  or write failure.
- Check mode: exits non-zero and lists `stale`, `missing`, and `orphan` paths.

## Testing

`apps/ai-institute/src/lib/curriculum/__tests__/asset-pipeline.test.ts`:

1. Manifest parses; schema and derived counts match the registries.
2. Coverage is 1:1: every module/lesson id has exactly one asset; no orphans.
3. Every asset's hex colors are within `tokens.css` ∪ brand logo palette.
4. Watermark present (`id="watermark"`) on every card.
5. Band/ages in the manifest equal `BAND_AGES`; titles equal registry titles.

CI: existing gates (antislop, lint, typecheck, test, build). The freshness
gate is embedded in the app `test` script
(`assets:check && vitest run`), so the existing `ci.yml` test job enforces it
on every pull request with no new workflow required. A path-filtered
`assets.yml` workflow is authored but not committable: both available GitHub
tokens lack the `workflow` scope required to write `.github/workflows/*`
(403 from git push and from the contents API). It can be applied manually
from the PR description once a workflow-scoped credential exists; until then
the embedded gate loses only seconds of path filtering, not coverage.

## Security

Static generation only: no network calls, no secrets, no user input. The
workflow runs with `permissions: contents: read`.

## Implementation phases

- **v1 (this change):** generator, 91 cards, manifest, test, workflow, docs.
- **Future:** raster exports in CI, module/lesson page wiring via the manifest,
  carousel decks per `MEDIA_GENERATION.md`, band-level covers.
