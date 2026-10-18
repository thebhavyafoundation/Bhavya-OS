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

## 6. Approved Asset Set — Verified 2026-10-19

Provenance is authoritative in `apps/ai-institute/public/photography/metadata/photo_manifest.json` (source URL, creator, licence, licence URL, art direction), with acquisition history in `assets/manifest.json`. Checksums below were computed at this commit. `hero-himalayan-sunset.jpg` is superseded by `hero-sunrise-mountain.jpg` and is retained only as acquisition history, not shipped.

| ID                            | Shipped file                                |   Bytes | SHA-256 (abbrev.)    | Source                                                                                                                                     | Creator               | Licence        | Attribution  |
| ----------------------------- | ------------------------------------------- | ------: | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | -------------- | ------------ |
| `hero-sunrise-mountain`       | `hero/hero-sunrise-mountain.jpg`            | 143,381 | `5fff3ad0…0ffb1d8`   | [Pexels 34046635](https://www.pexels.com/photo/majestic-mountain-sunrise-with-vibrant-sky-34046635/)                                       | Pexels contributor    | Pexels License | not required |
| `forest-cedar-sunlight`       | `forest/forest-cedar-sunlight.jpg`          | 410,146 | `146b6363…5bed37`    | [Wikimedia curid 175571140](https://commons.wikimedia.org/w/index.php?curid=175571140)                                                     | Kavittaa              | CC0 1.0        | not required |
| `heritage-stone-temple`       | `heritage/heritage-stone-temple.jpg`        | 173,273 | `c9e6344c…268436`    | [Wikimedia Shirgul Maharaj Temple](https://commons.wikimedia.org/wiki/File:Shirgul_Maharaj_Temple,_Churdhar,_Himachal_Pradesh,_India.jpg)  | UnpetitproleX         | CC BY 4.0      | **required** |
| `why-terrace-garhwal`         | `why/why-terrace-garhwal.jpg`               |  66,609 | `772c2e68…2221e3fb`  | [Wikimedia terrace farming](https://commons.wikimedia.org/wiki/File:Terrace_farming_on_the_way_to_Ransi_village,_Garhwal,_Uttarakhand.jpg) | Varun Shiv Kapur      | CC BY 2.0      | **required** |
| `knowledge-books-notepad`     | `knowledge/knowledge-books-notepad.jpg`     |  57,425 | `ff9d3b35…c5fd9df2a` | [Wikimedia / Unsplash](<https://commons.wikimedia.org/wiki/File:Plan_a_lifetime_adventure_(Unsplash).jpg>)                                 | Glenn Carstens-Peters | CC0            | not required |
| `community-village-landscape` | `community/community-village-landscape.jpg` | 225,113 | `f78de2e5…94c74a`    | [Wikimedia Himachal Pradesh](https://commons.wikimedia.org/wiki/File:Himachal_Pradesh_India.jpg)                                           | Aashish Chindaliya    | CC0            | not required |

**Approved for public use.** Every image is CC0, public domain, Pexels-licensed, or CC BY with attribution rendered. None implies Bhavya activity on site; all carry honest captions per the standing constraints in §0.1.

Full checksums, unabbreviated:

```
5fff3ad0c7a955ca0a3c097addbfd66536c449a051733f4ec479dec790ffb1d8  hero/hero-sunrise-mountain.jpg
146b63633a6af4f30437ff9c6d49294c55444fd3ba1515f56426e6aaf15bed37  forest/forest-cedar-sunlight.jpg
c9e6344c63ef058d293faa77028bdb2e848b32a91964735285bbfd47ea268436  heritage/heritage-stone-temple.jpg
772c2e68db2b8e2d5c5ce54c4ee3f95dcac65ae60c1759f2778782262221e3fb  why/why-terrace-garhwal.jpg
ff9d3b35a8a4063cde1139cbd19474449b6a5175483ca43838589c5c5fd9df2a  knowledge/knowledge-books-notepad.jpg
f78de2e56c5ac51f95b965203ce3739e15d9766759c6e4e19db3795d1c94c74a  community/community-village-landscape.jpg
```

### 6.1 Diagrams

| ID                                | File                                                             | Bytes | Generator      | Licence | Status                        |
| --------------------------------- | ---------------------------------------------------------------- | ----: | -------------- | ------- | ----------------------------- |
| `curriculum-learning-pathway`     | `public/diagrams/curriculum/curriculum-learning-pathway.svg`     | 5,582 | diagram-design | MIT     | **surfaced** on `/curriculum` |
| `foundation-governance-structure` | `public/diagrams/governance/foundation-governance-structure.svg` | 4,539 | diagram-design | MIT     | **surfaced** on `/governance` |
| `responsible-ai-lifecycle`        | `public/diagrams/science/responsible-ai-lifecycle.svg`           | 5,975 | diagram-design | MIT     | authored, not yet placed      |
| `environmental-system`            | `public/diagrams/science/environmental-system.svg`               | 3,945 | diagram-design | MIT     | authored, not yet placed      |
| `bhavya-os-architecture`          | `public/diagrams/architecture/bhavya-os-architecture.svg`        | 5,697 | diagram-design | MIT     | authored, not yet placed      |
| `b2-secured-data-flow`            | `public/diagrams/governance/b2-secured-data-flow.svg`            | 4,982 | diagram-design | MIT     | authored, not yet placed      |

All six are lightweight reviewed SVGs committed to Git, as the execution list requires for this class of asset.

### 6.2 3D — sourced but not yet shippable

| Source                                      | Assets                                                   | Licence | Status                                  |
| ------------------------------------------- | -------------------------------------------------------- | ------- | --------------------------------------- |
| [Kenney](https://kenney.nl/assets)          | `public/models/kenney/**`                                | CC0 1.0 | `SOURCE_ONLY` — no optimised derivative |
| [Poly Haven](https://polyhaven.com/license) | `public/models/poly-haven/**`, `assets/3d/poly-haven/**` | CC0     | `SOURCE_ONLY` — no optimised derivative |

Not approved for production use until the CI optimisation workflows produce mobile (<500 KB) and desktop (<2 MB) Draco derivatives plus poster fallbacks. Sourcing is not the blocker; optimisation is.

### 6.3 Documentation drift found and recorded

`assets/manifest.json` still lists `forest/forest-cedar-sunlight.jpg` under `still_required`, and does not record `hero-sunrise-mountain.jpg` at all. Both files exist and are wired, and both have complete provenance in `photo_manifest.json`, so nothing is undocumented — the higher-level manifest is simply behind. **Not corrected in this execution**: rewriting an existing acquisition record is better done as its own commit with the owner's intent confirmed.

### 6.4 Not approved

| Item                              | Reason                                                                            |
| --------------------------------- | --------------------------------------------------------------------------------- |
| Kenney / Poly Haven derivatives   | No optimised derivative exists yet. Blocked on CI workflows, not on sourcing      |
| `knowledge-school-children.jpg`   | ASSET REQUIRED. No consent-cleared source. Must not be filled with stock children |
| `community-village-gathering.jpg` | ASSET REQUIRED. Human-subject consent risk                                        |
| `heritage-wooden-temple.jpg`      | ASSET REQUIRED                                                                    |
