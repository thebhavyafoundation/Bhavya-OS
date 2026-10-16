# ASSET-INVENTORY — Large Assets & Media

**Date:** 2026-10-12
**Source:** `find` scan (>5MB), `apps/ai-institute/public/`

---

## Large Files in Repository (>5MB)

| Path                                                                                   | Size  | Type     | Notes               |
| -------------------------------------------------------------------------------------- | ----- | -------- | ------------------- |
| `apps/ai-institute/public/models/poly-haven/portable-generator-4k-blend.zip`           | ~50MB | Blender  | Source 3D asset     |
| `apps/ai-institute/public/models/poly-haven/textures/portable_generator_nor_gl_4k.exr` | ~25MB | EXR      | Normal map (4K)     |
| `apps/ai-institute/public/models/poly-haven/textures/portable_generator_rough_4k.exr`  | ~25MB | EXR      | Roughness map (4K)  |
| `apps/ai-institute/public/models/poly-haven/textures/portable_generator_metal_4k.exr`  | ~25MB | EXR      | Metalness map (4K)  |
| `apps/ai-institute/public/models/poly-haven/textures/portable_generator_diff_4k.jpg`   | ~8MB  | JPG      | Diffuse map (4K)    |
| `homepage-after-preloader.png`                                                         | 548KB | PNG      | Screenshot          |
| `homepage-current.png`                                                                 | 548KB | PNG      | Screenshot          |
| `homepage-full.png`                                                                    | 548KB | PNG      | Screenshot          |
| `homepage-verified.png`                                                                | 548KB | PNG      | Screenshot          |
| `homepage-viewport.png`                                                                | 548KB | PNG      | Screenshot          |
| `library-viewport.png`                                                                 | 738KB | PNG      | Screenshot          |
| `login-viewport.png`                                                                   | 407KB | PNG      | Screenshot          |
| `missions-verified.png`                                                                | 672KB | PNG      | Screenshot          |
| `prod-1280-top.png`                                                                    | 280KB | PNG      | Screenshot          |
| `prod-1440-hero.png`                                                                   | 321KB | PNG      | Screenshot          |
| `prod-1440-top.png`                                                                    | 226KB | PNG      | Screenshot          |
| `prod-390-top.png`                                                                     | 167KB | PNG      | Screenshot          |
| `prod-430-top.png`                                                                     | 192KB | PNG      | Screenshot          |
| `prod-desktop-1440.png`                                                                | 1.5MB | PNG      | Screenshot          |
| `about-current.png`                                                                    | 153KB | PNG      | Screenshot          |
| `curriculum-hub-snapshot.yml`                                                          | 577KB | YAML     | Curriculum snapshot |
| `curriculum-viewport.png`                                                              | 805KB | PNG      | Screenshot          |
| `os-redirect-login.png`                                                                | 41KB  | PNG      | Screenshot          |
| `register-viewport.png`                                                                | 450KB | PNG      | Screenshot          |
| `qa-shot-verify-pr12.png`                                                              | 799KB | PNG      | QA screenshot       |
| `pnpm-lock.yaml`                                                                       | 417KB | Lockfile | —                   |
| `typecheck-out.txt`                                                                    | 128KB | Log      | —                   |
| `typecheck-out2.txt`                                                                   | 129KB | Log      | —                   |
| `typecheck-output.txt`                                                                 | 132KB | Log      | —                   |
| `index.json`                                                                           | 96KB  | JSON     | —                   |

---

## 3D Assets (Poly Haven — Portable Generator)

### Source

- **URL**: https://polyhaven.com/a/portable_generator
- **License**: CC0 (Public Domain) — **Verified**
- **Format**: Blender (.blend), GLTF/GLB, textures

### Files in `public/models/poly-haven/`

```
portable-generator-4k-blend.zip           # 50MB — Source Blender file
textures/
  ├── portable_generator_diff_4k.jpg      # 8MB  — Diffuse/Albedo
  ├── portable_generator_nor_gl_4k.exr    # 25MB — Normal (OpenGL)
  ├── portable_generator_rough_4k.exr     # 25MB — Roughness
  └── portable_generator_metal_4k.exr     # 25MB — Metalness
```

### Production Derivatives Needed

| Variant  | Format        | Target Size | Use Case                |
| -------- | ------------- | ----------- | ----------------------- |
| Mobile   | GLB (Draco)   | <500KB      | Hero 3D on mobile       |
| Desktop  | GLB (Draco)   | <2MB        | Hero 3D on desktop      |
| Poster   | AVIF          | <100KB      | Reduced motion fallback |
| Textures | KTX2 (BasisU) | <500KB each | GPU upload              |

### Optimization Pipeline Required

1. **Convert** Blender → GLB (gltf-transform)
2. **Compress** Geometry (meshoptimizer — Draco)
3. **Compress** Textures (KTX2 — Basis Universal)
4. **Generate** LODs (mobile/desktop)
5. **Upload** to B2 with content-hashed keys
6. **Manifest** in Git (`asset-manifest.json`)

---

## Screenshots & Documentation Assets

### Root Screenshots (19 files, ~8MB total)

- Homepage variants (5 × 548KB)
- Production views (5 × 200-320KB)
- Feature views (library, login, missions, curriculum, register)
- QA verification shots

**Recommendation**: Move to `docs/screenshots/` or delete — not needed in repo

---

## Asset Manifest Template

```json
{
  "assets": [
    {
      "asset_id": "bf-portable-generator-001",
      "title": "Portable Generator 3D Model",
      "type": "model/gltf-binary",
      "source_url": "https://polyhaven.com/a/portable_generator",
      "source_repository": "PolyHaven",
      "creator": "Poly Haven",
      "license": "CC0",
      "license_url": "https://polyhaven.com/license",
      "source_checksum": "sha256:REQUIRED",
      "production_checksum": "sha256:REQUIRED",
      "b2_key": "3d/models/portable-generator/portable-generator.mobile.a81c2.glb",
      "variants": {
        "mobile": "portable-generator.mobile.a81c2.glb",
        "desktop": "portable-generator.desktop.f7341.glb",
        "poster": "portable-generator.poster.91ac3.avif"
      },
      "approved": false,
      "approved_by": null
    }
  ]
}
```

---

## Asset Storage Strategy

| Asset Type          | Storage                   | Delivery                       | Cache              |
| ------------------- | ------------------------- | ------------------------------ | ------------------ |
| **3D Models (GLB)** | B2                        | Presigned URL → Cloudflare CDN | 1 year (immutable) |
| **Textures (KTX2)** | B2                        | Presigned URL → Cloudflare CDN | 1 year (immutable) |
| **Posters (AVIF)**  | B2 / Vercel Blob          | Direct CDN                     | 1 year             |
| **Screenshots**     | Git (small) / B2 (large)  | GitHub Pages / CDN             | 1 year             |
| **Content JSON**    | Git                       | Direct import                  | Build-time         |
| **Fonts**           | Google Fonts (preconnect) | fonts.googleapis.com           | 1 year             |

---

## Missing Asset Pipeline

1. **No automated optimization** — Manual Blender → GLB → Draco → KTX2
2. **No asset manifest** — `asset-manifest.json` not in repo
3. **No checksum verification** — Source/production checksums not recorded
4. **No license verification automation** — Manual per-asset
5. **No B2 upload automation** — Scripts exist but not in CI
6. **4K textures in public/** — Should be optimized derivatives only
7. **Blender source in public/** — 50MB zip should not be in repo

---

## Recommended Actions

1. **Remove source assets from repo** — Keep only optimized derivatives
2. **Add GitHub Action** — `gltf-transform` + `meshoptimizer` + `KTX-Software` pipeline
3. **Create asset manifest** — `public/asset-manifest.json` validated in CI
4. **Upload to B2** — Presigned URL generation in API routes
5. **Update components** — Load from B2 URLs with fallback posters
6. **Add license check** — CI step to verify CC0/compatible licenses
