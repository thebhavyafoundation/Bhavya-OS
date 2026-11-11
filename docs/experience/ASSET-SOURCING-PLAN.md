# ASSET-SOURCING-PLAN.md — 3D Asset Pipeline & Sourcing Plan

**Date:** 2026-10-16  
**Branch:** feat/immersive-hero-background  
**Scope:** 3D assets in `apps/ai-institute/src/components/` + `archive/` LFS assets

---

## 1. Current Asset Inventory

| Asset                         | Source        | License | Format | Size | Status          |
| ----------------------------- | ------------- | ------- | ------ | ---- | --------------- |
| Kenney models (14)            | kenney.nl     | CC0     | .glb   | ~LFS | In repo (LFS)   |
| Poly Haven Portable Generator | polyhaven.com | CC0     | .gltf  | 50MB | Source + EXR    |
| Poly Haven Neural Net         | polyhaven.com | CC0     | .glb   | ~LFS | In repo (LFS)   |
| Poly Haven 4K EXR Textures    | polyhaven.com | CC0     | .exr   | 83MB | Source textures |

**Pipeline Status:** No automated optimization, no asset manifest, no checksum verification, no B2 upload automation.

---

## 2. Production Derivatives Required

| Derivative          | Target Format | Max Size | Usage                    |
| ------------------- | ------------- | -------- | ------------------------ |
| Mobile GLB (Draco)  | .glb          | <500 KB  | Mobile hero / 3D canvas  |
| Desktop GLB (Draco) | .glb          | <2 MB    | Desktop hero / 3D canvas |
| Poster AVIF         | .avif         | <100 KB  | 3D fallback poster       |
| KTX2 Textures       | .ktx2         | <500 KB  | GPU-compressed textures  |

---

## 3. Asset Manifest (Missing)

| File                    | Purpose                                | Status     |
| ----------------------- | -------------------------------------- | ---------- |
| `asset-manifest.json`   | Source → production derivative mapping | ❌ Missing |
| `checksums.sha256`      | Source/production verification         | ❌ Missing |
| `b2-upload-config.json` | B2 bucket + signed URL config          | ❌ Missing |

---

## 4. CI Asset Pipeline (Missing)

| Stage                 | Tool                  | Status       |
| --------------------- | --------------------- | ------------ |
| glTF Transform        | `@gltf-transform/cli` | ❌ Not in CI |
| meshoptimizer         | `meshoptimizer`       | ❌ Not in CI |
| KTX2 compression      | `ktx2` / `basisu`     | ❌ Not in CI |
| Checksum verification | `sha256sum`           | ❌ Not in CI |
| B2 upload automation  | `aws-sdk` / B2 CLI    | ❌ Not in CI |

---

## 5. Asset Sourcing Decisions

| Decision                            | Rationale                                                           |
| ----------------------------------- | ------------------------------------------------------------------- |
| CC0 assets only                     | No attribution burden, safe for institutional use                   |
| Kenney models for hero 3D           | Low-poly, stylized, consistent aesthetic across bands               |
| Poly Haven Generator for OS hero    | High-fidelity, thematic fit for "institution building" narrative    |
| Poly Haven Neural Net for knowledge | Thematic alignment with AI education mission                        |
| Draco compression for GLB           | 60–80% size reduction, supported by `@react-three/drei` DRACOLoader |
| KTX2 for textures                   | GPU-native, no CPU decompression overhead                           |
| AVIF for posters                    | Better compression than WebP, wide browser support                  |

---

## 6. Next: Create MOTION-SYSTEM.md
