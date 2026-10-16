# Asset Sources (Free, Commercial-Use)

> This document is the **working registry** of external image and 3D asset URLs for front-design prototypes.
> It does **not** store binaries. Large assets are referenced by URL (R2 or public CDN) and must respect free-plan limits.
> Entries marked `pending verification` are placeholders — not yet verified canonical assets.

## Governance

- Design authority: `design/CONTEXT.md`
- Implementation: `packages/platform-ui/` (tokens, components)
- Design system: Foundation Mode — forest `#0e382e`, ivory `#f7f4ec`, gold `#d4af37` via `packages/platform-ui/src/styles/tokens.css`. No hardcoded hex in app code. Avoid generic stock / AI-slop per `bhavya-design-system`.
- App usage: e.g. `apps/ai-institute/` will import via TS configs once `storyConfig` exists. No `lib/storyConfig.ts`, `lib/imageAssets.ts`, `lib/assetUrls.ts` exist yet — do not reference as existing.

## Images (background layers only — no standalone image blocks; typography overlays on top)

### Hero Background — `pending verification`

- Source: Unsplash (candidate)
- URL: TBD — `https://unsplash.com/photos/...` is a placeholder, not a real asset
- License: Unsplash License (free commercial use, no attribution required) — verify per-photo page before use
- Intended use: Hero background layer (desktop) with overlay headline/body type on scrim
- Notes: Must fit Foundation Mode (warm editorial, forest/ivory); avoid generic dark-tech stock. Dark palette only if token-aligned.
- Verification: `pending verification`

### Constitution Background — `pending verification`

- Source: Pexels (candidate)
- URL: TBD — `https://www.pexels.com/photo/...` is a placeholder
- License: Pexels License (free commercial use) — verify at https://www.pexels.com/license/ per photo
- Intended use: Constitution background layer with overlay typography
- Notes: Minimalist, document-like feel; cream/ivory surfaces preferred.
- Verification: `pending verification`

### Mission Impact — `pending verification`

- Source: Unsplash or Pexels (candidate)
- URL: TBD
- License: TBD — verify per asset
- Intended use: Mission / impact background layer with overlay typography
- Notes: Energetic, hopeful mood but stay in forest/sage/earth palette; no neon/AI gradients.
- Verification: `pending verification`

## 3D Models

### Brand Core Object — `pending verification`

- Source: Poly Haven (candidate)
- URL: TBD — `https://polyhaven.com/a/...` is a placeholder
- Format: GLB
- License: CC0 (verify per-model page)
- File size: ~2-5 MB target — too large for Git; host on Cloudflare R2, reference by URL only
- Intended use: Central rotating object in hero scene
- Hosting: To be uploaded to Cloudflare R2; reference via future `assetUrls.ts` in app (does not exist yet)
- Verification: `pending verification`

### Mission Particles — `pending verification`

- Source: Khronos glTF Sample Assets
- URL: https://github.com/KhronosGroup/glTF-Sample-Assets/raw/main/Models/Particles/glTF-Binary/Particles.glb
- License: Permissive (check repo per-model license before commercial use)
- Intended use: Particle system visual for mission section
- Verification: `reported` (URL pattern exists in public repo, content/size not verified locally)

> When new assets are added, update this doc first with real URL + license page + verification state. Only after an RFC or app need arises should TS configs (`imageAssets.ts`, `assetUrls.ts`, `storyConfig.ts`) be created in the relevant app.
