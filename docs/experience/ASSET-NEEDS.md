# ASSET-NEEDS — Asset Need Records

**Date:** 2026-10-19
**Branch:** `feat/elite-web-experience`
**Rule:** No download happens without a completed record in this file. A record is created _before_ the fetch, not after.

---

## 0. Method

Each record states: route · section · purpose · **why a visual beats text** · source candidate · licence status · expected size · mobile fallback.

**A record with an empty "why a visual beats text" field is a decoration request and is rejected.** The execution list prohibits decorative assets with no informational purpose, and this file enforces that.

### 0.1 Standing honesty constraints (inherited from `assets/manifest.json`, still binding)

1. No generated people may be presented as Bhavya participants.
2. No stock children may be presented as Bhavya students.
3. No filename may claim a Bhavya programme site for a photograph that is not one.
4. `CC BY-SA` stays on hold pending explicit human approval.
5. Public-domain but off-brand 19th-century material stays rejected.

### 0.2 Approved sources for this execution

Poly Haven · ambientCG · Kenney · Khronos glTF sample assets · Smithsonian Open Access · Wikimedia Commons · NASA / official science sources · OpenGameArt **with per-item licence verification** (site-wide licence is _not_ assumed).

---

## 1. Discovery Result — What Is Already Present

A full inventory was taken before any download decision.

| Class                   | Already in repo                                                                   | State                                                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Documentary photography | 5 images, `apps/ai-institute/public/photography/**`                               | Provenance complete in `assets/manifest.json`. Creator, licence, licence URL, attribution text, byte sizes, honesty notes all recorded |
| 3D source models        | Kenney (CC0) + Poly Haven (CC0), `public/models/**` and `assets/3d/poly-haven/**` | Source present; **no optimised derivative exists**                                                                                     |
| Institutional diagrams  | **6 complete**: manifest JSON + authoring HTML + production SVG, all in Git       | SVG sizes 3.9–6.0 KB. Licence-reviewed generator (diagram-design, MIT). `review.status` fields still `pending`                         |
| Icons                   | open-peeps, reshot                                                                | Present                                                                                                                                |
| Brand                   | logo + SVG set                                                                    | Present                                                                                                                                |

**Conclusion of discovery:** the repository does **not** need new photography, new 3D source models, or new diagram authoring for the two vertical slices. The binding shortage is not assets — it is that existing assets are unsurfaced.

---

## 2. Asset Need Records — New External Sources

### ANR-01 — No new external asset is required for the flagship public slice

| Field                   | Value                                                                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Route                   | `/` (Tier A flagship)                                                                                                                   |
| Section                 | Whole page                                                                                                                              |
| Purpose                 | Cinematic public storytelling                                                                                                           |
| Why a visual beats text | Existing documentary photography + editorial type already carries the narrative. The gap is composition and hierarchy, not asset supply |
| Source candidate        | —                                                                                                                                       |
| Licence status          | —                                                                                                                                       |
| Expected size           | —                                                                                                                                       |
| Mobile fallback         | Already correct: 2400×1600 hero with `fetchPriority="high"`, degrades by CSS                                                            |

**Decision: NO DOWNLOAD.** Adding a 3D hero here would regress the documented 2026-09-26 editorial directive and violate "no cartoonish 3D" / "no 3D on every page".

---

### ANR-02 — No new external asset is required for the curriculum vertical slice

| Field                   | Value                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Route                   | `/curriculum` → `/curriculum/levels/[level]` → `[module]` → `lessons/[lessonId]` (Tier B → C)                               |
| Section                 | Programme entry, module overview, lesson body                                                                               |
| Purpose                 | Explain the pathway, then support calm reading                                                                              |
| Why a visual beats text | The 86-module / 4-band / 8-stage pathway is a _structure_, not a sentence. `curriculum-learning-pathway` already encodes it |
| Source candidate        | In-repo `curriculum-learning-pathway.svg`                                                                                   |
| Licence status          | Generated by diagram-design (MIT), reviewed, 5.5 KB                                                                         |
| Expected size           | 5.5 KB inline SVG                                                                                                           |
| Mobile fallback         | SVG reflows to a stacked list via `<text>` alternative block; no image dependency                                           |

**Decision: NO DOWNLOAD. Reuse existing SVG.**

---

### ANR-03 — No new external asset is required for governance

| Field                   | Value                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| Route                   | `/governance` (Tier B)                                                                           |
| Section                 | Structure                                                                                        |
| Purpose                 | Show who governs whom and by what instrument                                                     |
| Why a visual beats text | Reporting lines and policy hierarchy are relational; prose forces the reader to reconstruct them |
| Source candidate        | In-repo `foundation-governance-structure.svg`                                                    |
| Licence status          | diagram-design (MIT)                                                                             |
| Expected size           | 4.5 KB                                                                                           |
| Mobile fallback         | Same                                                                                             |

**Decision: NO DOWNLOAD.**

---

### ANR-04 — Optimised 3D derivatives (mobile + desktop tiers)

| Field                   | Value                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Route                   | Tier B explanatory routes only                                                                                                             |
| Section                 | Optional object explorer                                                                                                                   |
| Purpose                 | Spatial/system understanding — permitted only if it teaches something the text cannot                                                      |
| Why a visual beats text | **Conditional.** Recorded as a _need to be satisfied_, not a need to be filled. Each 3D use must name the specific spatial fact it conveys |
| Source candidate        | Already in repo: `public/models/kenney/**`, `public/models/poly-haven/**`, `assets/3d/poly-haven/**`                                       |
| Licence status          | Kenney CC0 1.0; Poly Haven CC0                                                                                                             |
| Expected size           | Mobile GLB+Draco <500 KB · Desktop GLB+Draco <2 MB · KTX2 <500 KB each · Poster AVIF <100 KB                                               |
| Mobile fallback         | Poster image; no-WebGL fallback; reduced-motion fallback                                                                                   |

**Decision: NO NEW SOURCE. Derivative optimisation required** — must run in GitHub Actions, never locally. Output target: Backblaze B2 under hashed immutable names. **No production upload in this execution.**

---

### ANR-05 — Poster images for every 3D stage

| Field                   | Value                                                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Route                   | Any Tier A/B route carrying 3D                                                                                                |
| Section                 | 3D visual stage                                                                                                               |
| Purpose                 | First-paint image before WebGL initialises; prevents a black box and is the reduced-motion and no-WebGL fallback in one asset |
| Why a visual beats text | Prevents layout shift and gives non-WebGL users the same scene                                                                |
| Source candidate        | Derived from the scene itself — Playwright capture in CI                                                                      |
| Licence status          | Inherits source licence (CC0 for current models)                                                                              |
| Expected size           | AVIF <100 KB, WebP fallback <150 KB                                                                                           |
| Mobile fallback         | **This asset _is_ the mobile fallback**                                                                                       |

**Decision: DERIVED, not sourced. GitHub Actions generates it.**

---

## 3. Records Explicitly Rejected

| Candidate                                       | Reason                                                                   | Status                                             |
| ----------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------- |
| Any AI-generated photograph of people           | Violates honesty constraint 1                                            | **REJECTED**                                       |
| Any stock photograph of children in a classroom | Violates honesty constraint 2                                            | **REJECTED**                                       |
| Unsplash direct page fetch                      | HTTP 401 without API key; CDN URL unresolvable                           | **BLOCKED** (recorded from `assets/manifest.json`) |
| CC BY-SA place/heritage candidates              | ShareAlike requires explicit human approval                              | **HELD** (carried forward unchanged)               |
| OpenGameArt "any asset" bulk import             | Site licence is not uniform; per-item verification required and not done | **NOT ATTEMPTED**                                  |
| Adding a 3D hero to `/`                         | Regresses documented directive; decorative                               | **REJECTED**                                       |
| `lattice-drift-kavtuai`                         | Unverified source; cannot be cited as authority                          | **UNVERIFIED** (carried forward)                   |

---

## 4. Storage Contract

### In Git (commit)

- Manifests — `assets/manifest.json`, `assets/cinematic-manifest.json`, `content/diagrams/manifests/*.json`
- Licence records — embedded in manifests; `docs/tools/diagram-design/LICENSE-REVIEW.md`, `docs/diagrams/licences/`
- Checksums — recorded per asset in manifests
- Lightweight reviewed SVGs — `apps/ai-institute/public/diagrams/**` (3.9–6.0 KB each)
- Diagram authoring sources — `content/diagrams/sources/html/*.html`

### Backblaze B2 (never committed)

```
assets/
  3d/        GLB/GLTF derivatives (Draco, mobile + desktop tiers)
  textures/  KTX2 transcodes
  hdri/      HDR environment maps
  images/    large image derivatives (AVIF/WebP)
  diagrams/  rasterised diagram derivatives, if ever needed
  audio/     lesson audio
  video/     course video
  captions/  caption sidecars (required for any video/audio)
  posters/   3D poster images
  downloads/ user-downloadable exports
```

Naming for production: **hashed immutable** — `assets/3d/<asset-id>.<content-hash>.glb`. Never overwritten, never renamed.

Delivery: server-side signed URLs via the existing `/api/b2/signed-url` route. **B2 credentials must never reach browser code.**

### Prohibited

- Cloudflare R2 — prohibited by `PLATFORM-TRUTH.md`
- Any binary over ~1 MB in Git
- Any credential, key, or B2 identifier in client bundle

---

## 5. Optimisation Workflow Requirement

Local machine is an editor only. Every transformation below runs in GitHub Actions, produces **review artefacts first**, and never auto-publishes to production.

| Transformation           | Tool                          | Output target                          |
| ------------------------ | ----------------------------- | -------------------------------------- |
| GLB optimisation + Draco | glTF-Transform, meshoptimizer | CI artefact → B2 on manual approval    |
| Texture conversion       | KTX-Software                  | CI artefact → B2 on manual approval    |
| Poster generation        | Playwright capture            | CI artefact                            |
| AVIF / WebP derivation   | Sharp                         | CI artefact                            |
| Audio / video handling   | FFmpeg                        | CI artefact, captions sidecar required |
| Diagram rasterisation    | Only if ever required         | CI artefact                            |

**No workflow added by this execution may write to B2 automatically.** Publishing is a human-gated step.

---

## 6. Per-Asset Review Status Table

To be completed as assets are actually produced. A row may not be marked `APPROVED` without: source URL · creator · licence · licence URL · checksum · intended route · derivative outputs · reviewer.

| ID       | Asset               | Source               | Creator                    | Licence                     | Licence URL                   | SHA-256              | Route                               | Derivatives                      | Status                    |
| -------- | ------------------- | -------------------- | -------------------------- | --------------------------- | ----------------------------- | -------------------- | ----------------------------------- | -------------------------------- | ------------------------- |
| EXISTING | 5 photography items | Wikimedia            | see `assets/manifest.json` | CC0 / CC BY 2.0 / CC BY 4.0 | see manifest                  | recorded in manifest | `/`, missions                       | JPEG + WebP                      | `ACQUIRED`                |
| EXISTING | Kenney models       | kenney.nl            | Kenney                     | CC0 1.0                     | https://kenney.nl/assets      | to verify            | Tier B 3D                           | none — **needs CI optimisation** | `SOURCE_ONLY`             |
| EXISTING | Poly Haven models   | polyhaven.com        | Poly Haven                 | CC0                         | https://polyhaven.com/license | to verify            | Tier B 3D                           | none — **needs CI optimisation** | `SOURCE_ONLY`             |
| EXISTING | 6 diagram SVGs      | diagram-design (MIT) | Bhavya Foundation          | MIT                         | recorded in each manifest     | to compute           | `/governance`, `/curriculum`, `/os` | none                             | `DRAFT` — reviews pending |
