# WEB-EXPERIENCE-ROADMAP

**Date:** 2026-10-19
**Branch:** `feat/elite-web-experience`
**Scope:** `apps/ai-institute` + `packages/platform-ui`
**Status of this document:** the execution plan. Authority for _what is true_ is `EXECUTION-BASELINE.md`; authority for _what tier a route is_ is `ROUTE-EXPERIENCE-TIERS.md`; authority for _what may be downloaded_ is `ASSET-NEEDS.md`.

---

## 0. The Central Finding

Discovery did not find an asset shortage. It found a **delivery** shortage.

The repository already holds:

- 5 licence-documented documentary photographs
- CC0 3D source models from Kenney and Poly Haven
- **Six complete institutional diagrams** — each with a schema-valid manifest, an authoring HTML source, a production SVG (3.9–6.0 KB), accessible text, content sources and a licensing block
- 90 components across 15 directories, including a full motion library

And yet:

- **Zero** diagrams render on any of 166 routes
- **Zero** usages of `EmptyState` or `SkeletonState` anywhere in `src/**`
- A 126 KB single-file stylesheet governing every tier at once
- No asset optimisation in CI, so no model is shippable at any performance tier

Therefore this execution is **not** a build-from-scratch programme. It is:

1. Surface existing work on two vertical slices.
2. Extract the stylesheet so tiers become enforceable.
3. Build the small set of genuinely missing primitives.
4. Add the optimisation pipeline so assets become shippable.

Anything beyond that is scope inflation and is not attempted.

---

## 1. Phase Plan

### Phase 0 — Baseline ✅ complete

Branch cut from `master` @ `197f31e9`, deliberately **not** from `workaround/pre-esbuild-conditional-exports`, so UI work and the OpenNext deploy investigation share no history.

- `EXECUTION-BASELINE.md` — verified current state, 9 carried risks
- `ROUTE-EXPERIENCE-TIERS.md` — all 166 routes tiered, superseding the stale matrix
- `ASSET-NEEDS.md` — 5 need records, 7 explicit rejections, storage contract
- This roadmap

**Gate before coding:** route-tier classification written. Satisfied.

---

### Phase 1 — Design System Hardening

**Goal:** make tiers enforceable and make the proof surface real.

1. **Stylesheet extraction.** Split `apps/ai-institute/src/app/globals.css` (126,652 bytes, 42 sections) into route-scoped modules. Every selector value must remain byte-identical; only the file boundary moves. Pure refactor, fully reversible, verified by screenshot comparison at five viewports.
2. **Design-system app extension.** `apps/design-system` already has `/tokens`, `/typography`, `/icons`, `/patterns`, `/components`, `/playground`. Add proofs for the items the execution list names and the app currently lacks: surfaces, motion rhythm, cards, nav, buttons, infographic frame, diagram container, 3D visual stage shell, loading / empty / error states.
3. **Token discipline holds.** No hardcoded colour, no new primitive where `platform-ui` has one. `pnpm tokens:check` green throughout.

**Explicitly not done:** no token amendment. `AGENTS.md` §7 records an unresolved palette conflict between constitution 01, constitution 05 and `tokens.css`. Resolving it is a human gate and is not touched here.

---

### Phase 2 — Core Experience Components

Build only what §4.2 of the baseline proved missing:

| Component                                     | Tier | Reuses                                          |
| --------------------------------------------- | ---- | ----------------------------------------------- |
| `PublicStoryShell`                            | A    | `ChapterRail`, `ScrollProgress`, `StoryChapter` |
| `StickyVisualStage`                           | A    | `prefers-reduced-motion` unpins entirely        |
| `EditorialDiagram`                            | A/B  | `public/diagrams/**`                            |
| `InfographicFrame`                            | B/C  | `--color-data-*` palette tokens                 |
| `DiagramBlock` / `InfographicBlock`           | A–C  | `manifest.schema.json` as the source of truth   |
| `CourseHero`                                  | B    | `PageHero`                                      |
| `LessonShell`                                 | C    | `AIProgressBar`                                 |
| `EmptyState` / `SkeletonState` / `ErrorState` | all  | zero prior art — new                            |
| `Optional3DExplorer`                          | A/B  | hardens `three/Model3D`                         |

**Not built:** a fifth lesson chain, a new route, a new design primitive.

Every component must support: mobile · keyboard · reduced motion · dark/light · loading · error · explicit dimensions.

---

### Phase 3 — Asset Sourcing

Per `ASSET-NEEDS.md`: **no new external download is required.** The records exist so the decision is auditable, and the decision is "no download" for the flagship slice, the curriculum slice and governance.

Real work here is completing §6 of that file: compute SHA-256 for existing assets, verify Kenney and Poly Haven licences, advance the six diagram manifests from `DRAFT` to reviewed with named review evidence.

---

### Phase 4 — Asset Optimisation (GitHub Actions)

`.github/workflows/` today holds only CI and deploy. Added:

- Filtered **GLB optimisation** workflow — glTF-Transform + meshoptimizer, mobile (<500 KB) and desktop (<2 MB) tiers
- Filtered **KTX2 texture** workflow
- Filtered **poster generation** workflow — Playwright capture, AVIF <100 KB
- Filtered **AVIF/WebP derivation** workflow — Sharp

Constraints, non-negotiable:

- Runs on GitHub Actions, never locally
- **Produces review artefacts only**
- **Never writes to Backblaze B2 automatically** — publish is human-gated
- Never triggers a production deploy

---

### Phase 5 — Flagship Public Vertical Slice

**Route:** `/` (Tier A)

Build: strong hero · story chapters · one major visual narrative · one supporting infographic system · selective 3D only if it explains real information · single unambiguous CTA.

Constraints:

- **The current photography-led editorial direction is preserved.** It is a documented directive and it is good. This phase makes it world-class; it does not replace it with 3D.
- Text stays semantic HTML.
- Every visual gains a static fallback in the same commit.
- `prefers-reduced-motion` and no-WebGL paths are first-class, not afterthoughts.

---

### Phase 6 — Curriculum Vertical Slice

**Chain:** `/curriculum` (B) → `/curriculum/levels/[level]` (C) → `/curriculum/levels/[level]/[module]` (C) → `.../lessons/[lessonId]` (C)

Upgrade: information hierarchy · learning flow · pathway visual · one diagram/infographic block · stable progress UX.

Lesson pages stay **calm, readable and predictable**. No scroll-linked motion, no pinning, no autoplay, body measure ≤ 72ch.

The `curriculum-learning-pathway` SVG lands here, and is the diagram that finally renders.

---

### Phase 7 — Diagrams and Infographics

Six manifests exist. This phase **surfaces** them and completes their review:

| Diagram                           | Target route           | Tier                          |
| --------------------------------- | ---------------------- | ----------------------------- |
| `foundation-governance-structure` | `/governance`          | B                             |
| `curriculum-learning-pathway`     | `/curriculum`          | B                             |
| `responsible-ai-lifecycle`        | `/knowledge/ai`        | B                             |
| `environmental-system`            | `/nature` or `/forest` | B/A                           |
| `bhavya-os-architecture`          | `/os`                  | D — functional, no decoration |
| `b2-secured-data-flow`            | internal documentation | D                             |

Each needs: title · description · source · accessible text alternative · mobile layout · manifest entry · **review status advanced from `pending`**.

Charts are used only where numeric interaction genuinely helps. No decorative charts.

---

### Phase 8 — 3D Usage Rules (enforced, not aspirational)

3D is permitted **only** where it improves spatial understanding, system understanding, storytelling impact, or educational clarity.

Every scene must implement all seven:

1. Lazy loading + dynamic import
2. Mobile quality tier
3. Poster fallback
4. No-WebGL fallback
5. Reduced-motion fallback
6. Resource disposal
7. Paused / offscreen behaviour

Tier posture: A cinematic permitted · B selective · C optional educational with justification recorded in `ASSET-NEEDS.md` · **D prohibited**.

**No new 3D scene is added until the existing ones satisfy all seven.**

---

### Phase 9 — Testing

Locally (allowed): `pnpm typecheck` · `pnpm lint` · `pnpm antislop` · `pnpm tokens:check` · `pnpm file-map:check` · `pnpm registry:check` · `pnpm drift:check` · `git diff --check`

In CI only (never local — machine is i3/8 GB): full `pnpm test`, `pnpm build`, OpenNext build.

Viewports: **375×812 · 390×844 · 768×1024 · 1280×800 · 1440×900**

Also: axe accessibility check · reduced-motion check · broken-asset check · route screenshot review · bundle size comparison · console and network failure check.

---

### Phase 10 — PR Preparation

- Small, single-purpose commits
- Asset, component and page work kept in separate commits
- PR opened **only after** one public slice and one curriculum slice are genuinely polished
- **No merge. No production deploy.**

---

## 2. Commit Sequence

```
1. docs(experience): baseline, tiers, asset needs, roadmap
2. refactor(styles): extract route-scoped CSS from globals.css
3. feat(design-system): proof surface for surfaces, motion, states
4. feat(components): EmptyState, SkeletonState, ErrorState
5. feat(components): EditorialDiagram, InfographicFrame, DiagramBlock
6. feat(components): PublicStoryShell, StickyVisualStage
7. feat(components): Optional3DExplorer fallback contract
8. feat(lessons): LessonShell, CourseHero, ModuleOverview
9. feat(public): flagship slice
10. feat(curriculum): curriculum chain slice
11. feat(diagrams): surface + review manifests
12. ci(assets): GLB / KTX2 / poster / AVIF workflows
13. docs(experience): final report
```

Each commit leaves `typecheck`, `lint`, `antislop` and `tokens:check` green.

---

## 3. Success Criteria

| Criterion                 | Evidence required                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------- |
| Elite but controlled      | Screenshot review at all five viewports, stated as review not as measured quality            |
| Correct infra usage       | No R2 reference; no large binary in Git; no credential in client code; heavy work only in CI |
| Assets in the right place | Manifest + licence + checksum for every asset; B2 only for derivatives                       |
| No paid dependencies      | Dependency diff shows zero paid additions                                                    |
| No broken routes          | All pre-existing routes still resolve; route count still 166                                 |
| Good mobile UX            | 375 and 390 verified                                                                         |
| Accessible fallbacks      | Every new visual has a static fallback in the same commit; axe clean on touched routes       |
| Production-safe           | Branch only. No merge. No deploy                                                             |

---

## 4. Explicit Non-Goals

Not attempted, and why:

| Non-goal                                      | Reason                                                           |
| --------------------------------------------- | ---------------------------------------------------------------- |
| Rebuilding the app                            | Prohibited                                                       |
| Replacing Next.js App Router                  | Prohibited                                                       |
| Breaking routes or auth                       | Prohibited                                                       |
| Consolidating the four lesson chains          | Architecture consolidation is a human gate under `AGENTS.md` §11 |
| Deleting the malformed `[level/]` directories | Destructive; requires explicit approval                          |
| Amending tokens or constitution docs          | Human gate under `AGENTS.md` §7 and §11                          |
| Adding 3D to the homepage                     | Decorative; regresses a documented directive                     |
| Any production deploy                         | Human gate under `PLATFORM-TRUTH.md`                             |
| Merging to `master`                           | Prohibited                                                       |

---

## 5. Rollback

Every phase is additive or a pure move. Full rollback:

```bash
git checkout feat/elite-web-experience
git log --oneline master..feat/elite-web-experience   # review
git branch -D feat/elite-web-experience                # delete branch, PR untouched
git push origin --delete feat/elite-web-experience      # delete remote
```

Single-phase rollback:

```bash
git log --oneline --reverse master..feat/elite-web-experience
git revert <first-commit-of-phase>^..<last-commit-of-phase>
```

Stylesheet extraction is reversible in one step because it moves rules without changing values.

**No migration, no deploy, no state mutation means there is nothing to roll back operationally.**
