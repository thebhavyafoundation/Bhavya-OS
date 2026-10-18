# EXECUTION-BASELINE — Verified State Before Elite Web Experience Work

**Date:** 2026-10-19
**Branch:** `feat/elite-web-experience` (created from `master` @ `197f31e9`)
**Scope:** `apps/ai-institute` (canonical app) + `packages/platform-ui`
**Method:** Every claim below was verified against the filesystem at the commit above. Nothing here is copied forward from older experience docs; where an older doc disagrees, this file wins and the disagreement is recorded.

---

## 1. Platform Authority Applied

From `docs/architecture/PLATFORM-TRUTH.md` (binding for this work):

| Constraint                              | Applied to this execution                                                         |
| --------------------------------------- | --------------------------------------------------------------------------------- |
| GitHub canonical source                 | All work lands on `feat/elite-web-experience`; no other branch touched            |
| Cloudflare/OpenNext canonical deploy    | No production deploy. Build verification only                                     |
| Backblaze B2 for large assets           | No large binary committed. Existing `/api/b2/*` routes are the delivery path      |
| Supabase auth                           | Untouched. No auth flow modified                                                  |
| Turso production DB                     | No schema change, no migration                                                    |
| Local machine = editor + control centre | No `pnpm build`, no heavy optimisation locally. Heavy work goes to GitHub Actions |
| Vercel preview-only                     | Not used                                                                          |
| **Cloudflare R2 prohibited**            | No R2 bucket, no R2 binding referenced                                            |
| **Paid APIs prohibited**                | Every dependency and asset source below is free/CC0/CC-BY                         |
| Human approval for production actions   | No merge, no deploy, no production asset publish                                  |

**Deploy blocker is isolated.** The OpenNext deploy investigation lives on `workaround/pre-esbuild-conditional-exports` (8 commits ahead of `master`). This branch is cut from `master`, so UI work and deploy work share no history.

---

## 2. Route Surface — Verified Count

**166** route entry points (`page.tsx`) exist under `apps/ai-institute/src/app`.

The prior `docs/experience/ROUTE-EXPERIENCE-MATRIX.md` listed `/faq`, `/library`, `/research`, `/contact`, `/support`, `/teachers`, `/privacy`, `/accessibility` as "not implemented". **All of them now exist.** That matrix is stale on route availability and is superseded for tiering purposes by `ROUTE-EXPERIENCE-TIERS.md` in this folder.

### 2.1 Notable structural observations

1. **Four parallel lesson chains exist.** `/courses/[id]/lessons/[lessonId]`, `/courses/foundations/lessons/[id]`, `/curriculum/levels/[level]/[module]/lessons/[lessonId]`, and `/curriculum/modules/[moduleId]/lessons/[lessonId]` are four separate implementations of the same concept. This is a constitutional-adjacent duplication (one concept → one route per `CANONICAL_ROUTE_MAP.md`) but **consolidation is out of scope for this execution** and is not a human gate I am authorised to cross. Flagged in §7.
2. **`/curriculum/levels/[level]/[module/]/...` directories are malformed.** Literal directory names contain `[` / `]` fragments (e.g. a directory literally named `[level/]`). These are dead paths — Next.js reads `[level]`, not `[level/]`. Harmless today, but they will confuse every future route audit and `pnpm file-map`.
3. **`/dashboard` and `/profile` sit outside `/app/*`.** Authenticated surfaces split across two roots.
4. **`/studio/*` is a 6-route authoring surface** with no visible auth boundary in the route tree.

---

## 3. Design System — Current State

### 3.1 Tokens — canonical and healthy

`packages/platform-ui/src/styles/tokens.css` — **689 lines**, imported via `@import "@bhavya/platform-ui/styles/tokens.css"` in `apps/ai-institute/src/app/globals.css` (line 2). Contains brand palette (forest/ivory/gold/sage/earth), scales, semantic light+dark, type scale (Playfair Display + Inter), 8pt spacing, radii, shadows, transitions, data-viz palette, glass variants, reduced-motion block.

**Hardcoded-colour audit of `globals.css`: 3 raw hex literals across 126,652 bytes.** Token discipline is good. `pnpm tokens:check` is the gate.

**Known open item carried forward (not introduced here):** `AGENTS.md` §7 records that hex/palette alignment between `docs/constitution/01`, `05-DESIGN-SYSTEM.md`, and `tokens.css` is **unresolved and is a human gate**. This execution therefore treats `tokens.css` as implementation SoT and does not amend it.

### 3.2 `globals.css` is the real design-system risk

`apps/ai-institute/src/app/globals.css` is **126,652 bytes / 42 banner-delimited sections** in a single file, holding homepage, curriculum, missions, governance, OS, and auth styles together. Consequences:

- No route-level style isolation; any change risks cross-route bleed.
- Not reviewable at review speed.
- Impossible to enforce per-tier visual budgets.

This is the single highest-value structural fix in the design-system phase. It is a **pure extraction** (move rules into route-scoped CSS modules, keep every selector identical) and therefore reversible.

### 3.3 Design proof surface already exists

`apps/design-system/` is a live Next app with routes: `/tokens`, `/typography`, `/icons`, `/patterns`, `/components`, `/playground`. **Phase 1 does not need a new proof route built from zero** — it needs the existing surface hardened and extended to cover the specific proofs the execution list names (surfaces, motion rhythm, cards, nav, buttons, infographics, diagram containers, 3D visual stage shell, loading/empty/error states).

---

## 4. Component Inventory — Verified

`apps/ai-institute/src/components` contains **90 TSX files** across 15 directories.

### 4.1 Present and reusable

| Need from execution list         | Existing component                                                                                                                                                                         | Path                                            | Verdict                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- | ----------------------- |
| StoryChapter                     | `StoryChapter`                                                                                                                                                                             | `site/StoryChapter.tsx`                         | reuse                   |
| StoryChapter (editorial variant) | `MissionChapter`                                                                                                                                                                           | `editorial/MissionChapter.tsx`                  | reuse                   |
| ScrollProgress                   | `ScrollProgress`                                                                                                                                                                           | `motion/ScrollProgress.tsx`                     | reuse                   |
| Optional3DExplorer               | `Model3D`, `Card3D`, `Card3DSimple`                                                                                                                                                        | `three/`                                        | reuse + harden          |
| 3D hero                          | `CinematicHero`, `HeroBackground`                                                                                                                                                          | `three/CinematicHero.tsx`, `HeroBackground.tsx` | reuse                   |
| Optional3DExplorer (curriculum)  | `Hero3DCanvas`, `CurriculumHero3D`                                                                                                                                                         | `curriculum/`                                   | reuse + harden          |
| CurriculumPathway                | `AICurriculumTimeline`, `AIBandFilter`                                                                                                                                                     | `curriculum/`                                   | extend, not create      |
| LessonProgress                   | `AIProgressBar`                                                                                                                                                                            | `curriculum/AIProgressBar.tsx`                  | extend                  |
| ModuleOverview                   | `AIModuleRow`, `BentoModuleGrid`                                                                                                                                                           | `curriculum/`                                   | extend                  |
| Infographic frame (partial)      | `DiagramRenderer`                                                                                                                                                                          | `curriculum/diagram/DiagramRenderer.tsx`        | **ORPHANED — see §4.3** |
| Hero / sections / nav            | `SplitHero`, `FourPillars`, `MissionTiles`, `SmallTiles`, `QuoteBand`, `FinalCta`, `PageHero`, `Section`, `SectionHeader`, `CTABand`, `HubCard`, `ChapterRail`, `SiteHeader`, `SiteFooter` | `home/`, `site/`                                | reuse                   |

### 4.2 Genuinely missing

| Missing component                   | Why it is needed                                                                                                    | Tier |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---- |
| `PublicStoryShell`                  | No single composition root for long-form public narrative. Currently each public route hand-rolls its section stack | A    |
| `StickyVisualStage`                 | Scroll-pinned narrative visuals have no shared, reduced-motion-safe implementation                                  | A    |
| `EditorialDiagram`                  | Diagrams have a renderer but no branded container                                                                   | A/B  |
| `InfographicFrame`                  | No branded chart/figure frame; data-viz palette tokens are unused                                                   | B/C  |
| `CourseHero`                        | `/courses` chain has no consistent entry composition                                                                | B    |
| `LessonShell`                       | Lesson pages have no calm/predictable outer frame; two competing lesson implementations exist                       | C    |
| `EmptyState`                        | Zero usages anywhere in `src/**`                                                                                    | A–D  |
| `SkeletonState`                     | Zero usages anywhere in `src/**`                                                                                    | A–D  |
| `ErrorState` (component)            | `errors/RouteError.tsx` exists but is a route-level error element, not a reusable state component                   | A–D  |
| `Optional3DExplorer`                | `three/Model3D.tsx` exists but has no poster / no-WebGL / offscreen-pause contract                                  | A/B  |
| `DiagramBlock` / `InfographicBlock` | See §4.3                                                                                                            | A–C  |

### 4.3 The single largest finding: six finished diagrams are invisible

`content/diagrams/manifests/` contains **six complete, schema-valid diagram manifests**:

- `bhavya-os-architecture.json`
- `curriculum-learning-pathway.json`
- `foundation-governance-structure.json`
- `responsible-ai-lifecycle.json`
- `environmental-system.json`
- `b2-secured-data-flow.json`

`content/diagrams/sources/html/` contains the matching authoring sources for all six. `manifest.schema.json` requires title, accessible text, content sources, review status, licensing, version.

**A grep for `DiagramBlock`, `DiagramRenderer`, `EditorialDiagram`, and `InfographicFrame` across all of `apps/ai-institute/src/**/*.tsx` returns zero matches.** The `DiagramRenderer` component exists but is imported by nothing.

Consequence: institutional diagrams that were authored, reviewed and manifested are **not rendered on any route**. `/governance` has no governance diagram. `/curriculum` has no pathway diagram. `/os` has no architecture diagram. This is simultaneously the cheapest and the highest-value visual upgrade available — the assets and manifests already exist and are already licence-reviewed.

---

## 5. 3D — Current State

Present: `three/` (`CinematicHero`, `MistScene`, `Model3D`, `ParticleSystems`, `PillarSphere`, `Card3D`, `Card3DRenderer`, `Card3DSimple`), `curriculum/Hero3DCanvas.tsx`, `curriculum/CurriculumHero3D.tsx`, `HeroBackground.tsx`.

**The homepage does not currently use 3D.** `app/page.tsx` composes `SplitHero` (full-bleed documentary photograph + editorial type) → `FourPillars` → `MissionTiles` → `SmallTiles` → `QuoteBand` → `FinalCta`. This is a deliberate, documented editorial choice (poster-stagger split-hero per the 2026-09-26 directive), and the asset manifest enforces an honesty rule against fabricated people and stock children as Bhavya participants.

**Implication for Phase 5:** the flagship public slice should be judged on whether _this_ photographic-editorial direction can be made world-class, not on whether 3D can be added. Adding 3D to the homepage would be a regression against both the existing directive and the "no cartoonish 3D / no decorative 3D on every page" constraint. 3D belongs on Tier B explanatory routes and as an optional educational tool on Tier C.

**Missing 3D contract (must be added, not assumed):** poster fallback, no-WebGL fallback, reduced-motion fallback, resource disposal, offscreen/pause behaviour, mobile quality tier, explicit dimensions. Current components do not demonstrably implement all seven.

---

## 6. Assets — Current State

### 6.1 In Git (verified)

| Class            | Location                                                        | Notes                                                   |
| ---------------- | --------------------------------------------------------------- | ------------------------------------------------------- |
| Photography      | `apps/ai-institute/public/photography/**`                       | 5 acquired images, provenance in `assets/manifest.json` |
| 3D source models | `apps/ai-institute/public/models/**`, `assets/3d/poly-haven/**` | Kenney (CC0) + Poly Haven (CC0)                         |
| Diagrams         | `content/diagrams/**`                                           | 6 manifests + 6 HTML sources                            |
| Icons            | `apps/ai-institute/public/icons/**`                             | open-peeps, reshot                                      |
| Brand            | `apps/ai-institute/public/brand/**`                             | logo + svg                                              |

`assets/manifest.json` (330 lines) is an exemplary provenance record: source page, direct download URL, creator, licence, licence URL, attribution text, retrieval date, original and shipped dimensions, byte sizes, processing steps, honesty notes, `human_subjects` and `bhavya_activity_implied` booleans, and an explicit `rejected_or_held` list with reasons.

**Two honesty constraints are binding on any new asset work:**

- No generated people may be presented as Bhavya participants.
- No stock children may be presented as Bhavya students.
  These are enforced in `manifest.json` and must be enforced in any new `ASSET-NEEDS.md` record.

### 6.2 Intended for B2

`apps/ai-institute/src/app/api/b2/` provides `signed-url`, `upload`, `list`, `delete`. Optimised GLB/KTX2/AVIF/poster derivatives belong on B2 behind hashed immutable names. **No production upload is performed by this execution.**

### 6.3 Gap

No asset optimisation workflow exists in GitHub Actions. `.github/workflows/` contains only `ci.yml`, `deploy.yml`, `deploy-cloudflare.yml`, `opennext-build-verify.yml`, `opennext-diagnose.yml`, `opennext-workaround-test.yml`, `pages.yml`. GLB optimisation, KTX2 transcoding, poster generation and AVIF/WebP derivation are all absent.

---

## 7. Baseline Risks Carried Into This Execution

| #   | Risk                                                                 | Severity | Handling                                                                         |
| --- | -------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------- |
| R1  | `globals.css` is a 126 KB single-file stylesheet across all tiers    | High     | Extract route-scoped, selector-identical. Pure move                              |
| R2  | Six manifested diagrams render nowhere                               | High     | Surface them; this is the cheapest large visual win                              |
| R3  | Four parallel lesson chains                                          | High     | Out of scope to consolidate. Will not add a fifth. Flagged for human gate        |
| R4  | No asset optimisation in CI                                          | Medium   | Add filtered, review-artefact-only workflows                                     |
| R5  | 3D components lack a documented fallback contract                    | Medium   | Add contract + tests before adding any new 3D                                    |
| R6  | `EmptyState`/`SkeletonState` unused; zero loading/empty states       | Medium   | Build and adopt on the two vertical slices                                       |
| R7  | Malformed `[level/]` directories pollute route audits and `file-map` | Low      | Report; deletion is a destructive op needing approval                            |
| R8  | Design-system token/constitution palette conflict                    | Medium   | **Human gate.** Do not touch tokens to force agreement                           |
| R9  | Local machine cannot run `pnpm build`                                | Info     | Verification limited to local `typecheck`/`lint`/gates; heavy verification in CI |

---

## 8. Local Verification Contract (per AGENTS.md §14)

Allowed locally: `pnpm typecheck`, `pnpm lint`, `pnpm antislop`, `pnpm tokens:check`, `pnpm file-map:check`, `pnpm registry:check`, `pnpm drift:check`, `git diff --check`.

Forbidden locally: `pnpm build`, `turbo build`, `next build`, `opennextjs-cloudflare build`, full monorepo `pnpm test`. These run in GitHub Actions on the PR branch.

Visual verification is against the **deployed Cloudflare URL**, not a local build. Since this execution does not deploy, visual claims in the final report are limited to static review and to CI artefacts — and are labelled as such.

---

## 9. Gates That Will Be Run Before Any "Done"

`pnpm typecheck` · `pnpm lint` · `pnpm antislop` · `pnpm tokens:check` · `pnpm file-map:check` · `pnpm registry:check` · `pnpm drift:check` · `git diff --check` · CI: test + build + secret-scan.

Unverified "done" is not done.
