# Bhavya OS — Web-Only Verification Blueprint

**Status:** CONTROL CENTER MACHINE ONLY — All operations on web via GitHub Actions, Vercel, Cloudflare, Playwright
**Last Updated:** 2026-10-12
**Repository:** thebhavyafoundation/Bhavya-OS (default: master)

---

## 1. DEPLOYMENT STACK (Locked In)

| Layer                | Provider                 | Purpose                                   | Free Tier                                  |
| -------------------- | ------------------------ | ----------------------------------------- | ------------------------------------------ |
| **Hosting/Edge**     | Cloudflare Workers/Pages | Global CDN, edge functions, D1, KV, R2    | 100k req/day Workers, unlimited Pages      |
| **Auth**             | Supabase Auth            | OAuth, email, MFA, session management     | 50k MAU, unlimited social providers        |
| **Primary Database** | Turso (libSQL)           | SQLite at edge, 500M rows free            | 500M rows, 1 GB storage, 3 locations       |
| **Frontend Deploy**  | Vercel                   | Next.js builds, preview URLs, analytics   | 100 GB bandwidth, unlimited personal       |
| **Asset Storage**    | Backblaze B2 (Blaze)     | Large assets: 3D models, textures, videos | 10 GB free, $0.005/GB/mo after             |
| **Source Control**   | GitHub                   | Single source of truth, CI/CD triggers    | Unlimited private repos, 2k Actions min/mo |

---

## 2. CI/CD PIPELINE (GitHub Actions Only)

**Triggers:** Push to `master` (Cloudflare), Push to `main` (Vercel), PR to `master`/`main` (CI)

### Workflow Files (`.github/workflows/`)

| File                    | Trigger                  | Purpose                                                                      |
| ----------------------- | ------------------------ | ---------------------------------------------------------------------------- |
| `ci.yml`                | PR to `master`           | `pnpm antislop` → `pnpm lint` → `pnpm typecheck` → `pnpm test` → secret scan |
| `deploy-cloudflare.yml` | Push to `master`         | `opennextjs-cloudflare build` → `deploy` (Cloudflare Workers)                |
| `deploy.yml`            | Push to `main`           | Vercel preview/production deploy                                             |
| `pages.yml`             | Push to `main`, `feat/*` | GitHub Pages for `public/` assets                                            |

### Required GitHub Secrets

| Secret                  | Used By                 | Purpose                       |
| ----------------------- | ----------------------- | ----------------------------- |
| `VERCEL_TOKEN`          | `deploy.yml`            | Vercel CLI auth               |
| `VERCEL_ORG_ID`         | `deploy.yml`            | Vercel org                    |
| `VERCEL_PROJECT_ID`     | `deploy.yml`            | Vercel project                |
| `CLOUDFLARE_API_TOKEN`  | `deploy-cloudflare.yml` | Cloudflare API                |
| `CLOUDFLARE_ACCOUNT_ID` | `deploy-cloudflare.yml` | Cloudflare account            |
| `GITHUB_TOKEN`          | All                     | Built-in (secret scan, pages) |

### Runtime Secrets (Set via CLI, NOT in GitHub)

| Secret                 | Provider           | CLI Command                                                   |
| ---------------------- | ------------------ | ------------------------------------------------------------- |
| `TURSO_DATABASE_URL`   | Cloudflare Workers | `npx wrangler secret put TURSO_DATABASE_URL --env production` |
| `TURSO_AUTH_TOKEN`     | Cloudflare Workers | `npx wrangler secret put TURSO_AUTH_TOKEN --env production`   |
| `SUPABASE_URL`         | Vercel/Cloudflare  | Set in Vercel dashboard / `wrangler secret put`               |
| `SUPABASE_ANON_KEY`    | Vercel/Cloudflare  | Set in Vercel dashboard / `wrangler secret put`               |
| `S3_ENDPOINT`          | B2                 | `https://s3.<region>.backblazeb2.com`                         |
| `S3_BUCKET_NAME`       | B2                 | Bucket name                                                   |
| `S3_ACCESS_KEY_ID`     | B2                 | Application key ID                                            |
| `S3_SECRET_ACCESS_KEY` | B2                 | Application key                                               |

---

## 3. LOCAL MACHINE ROLE (Control Center Only)

### ✅ WHAT WE DO LOCALLY

- Edit code (files in `apps/ai-institute/`, `packages/`, `docs/`)
- Git operations: `git add`, `commit`, `push`, `branch`, `PR`
- Read local files for context
- Run lightweight checks: `npx tsc --noEmit` (single file), `pnpm eslint <file>`

### ❌ WHAT WE NEVER DO LOCALLY

- `pnpm build` (runs in GitHub Actions)
- `pnpm install` (runs in CI)
- `supabase db push` / migrations (run in CI or via Supabase dashboard)
- `wrangler deploy` (runs in GitHub Actions)
- `vercel deploy` (runs in GitHub Actions)
- Asset uploads to B2/Supabase (run in CI or via dashboard)
- Browser testing (Playwright runs in CI)

---

## 4. WEB VERIFICATION TOOLS (MCP Servers)

### Available MCP Servers (Use for ALL verification)

| Server         | Purpose                              | Tools                                                                                                                                                   |
| -------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GitHub**     | Repo, CI/CD, issues, PRs             | `github_get_file_contents`, `github_list_workflows`, `github_search_repositories`, `github_pull_request_read`                                           |
| **Vercel**     | Deployments, env, logs               | `vercel_get_deployment`, `vercel_list_deployments`, `vercel_get_project`, `vercel_get_project_env`                                                      |
| **Cloudflare** | Workers, D1, KV, R2, Pages           | `cloudflare-bindings_workers_list`, `cloudflare-bindings_d1_database_query`, `cloudflare-bindings_kv_namespaces_list`, `cloudflare-builds_workers_list` |
| **Playwright** | Browser testing, visual verification | `playwright_browser_navigate`, `playwright_browser_snapshot`, `playwright_browser_take_screenshot`, `playwright_browser_evaluate`                       |

---

## 5. VERIFICATION PROTOCOL (Run Before Any Completion Claim)

### Pre-Commit Checklist (Run in Order)

```bash
# 1. Typecheck (single file or full)
npx tsc --noEmit --project apps/ai-institute/tsconfig.json

# 2. Lint (single file or full)
pnpm eslint apps/ai-institute/src/components/three/CinematicHero.tsx

# 3. Full CI (triggers on push - monitor via GitHub)
# Go to: https://github.com/thebhavyafoundation/Bhavya-OS/actions

# 4. Deployment Status
# Vercel: https://vercel.com/bhavya-foundation/bhavya-OS/deployments
# Cloudflare: Check Workers deployment via cloudflare-bindings_workers_list

# 5. Visual Verification (Playwright)
# Navigate to preview URL, capture screenshot, verify 3D renders
```

### Web Verification Commands (MCP)

```javascript
// Check Vercel deployment status
vercel_list_deployments({ projectId: "prj_...", teamId: "team_..." });

// Check Cloudflare Worker
cloudflare_builds_workers_list({});
cloudflare_builds_workers_builds_list_builds({ workerId: "..." });

// GitHub Actions status
github_list_workflow_runs({ owner: "thebhavyafoundation", repo: "Bhavya-OS" });

// Visual test
playwright_browser_navigate({ url: "https://<preview>.vercel.app" });
playwright_browser_take_screenshot({ fullPage: true, scale: "device" });
```

---

## 6. CURRENT STATE (Verified via Web)

### Repository Structure

```
thebhavyafoundation/Bhavya-OS (master)
├── apps/ai-institute/          # Canonical app (/, /app, /os)
├── packages/
│   ├── platform-ui/            # Design system (@bhavya/platform-ui)
│   ├── database/               # @libsql/client (Turso) + better-sqlite3 (local)
│   ├── auth/                   # Session validation (uses database)
│   └── ... 59 more packages
├── .github/workflows/          # 4 workflows (ci, deploy, deploy-cloudflare, pages)
└── vercel.json                 # Vercel config (turbo build filter)
```

### Assets Verified (Web)

| Asset Type          | Location                                | Verified                |
| ------------------- | --------------------------------------- | ----------------------- |
| Brand SVGs          | `public/brand/svg/`                     | 11 files ✅             |
| Kenney 3D (CC0)     | `public/models/kenney/`                 | 13 GLB ✅               |
| Poly Haven 3D (CC0) | `public/models/poly-haven/`             | Generator + textures ✅ |
| Design System Board | `public/brand/assets/`                  | PNG ✅                  |
| Supabase Storage    | Buckets: avatars, submissions, textures | Configured ✅           |
| B2 Storage          | Keys: 3d-models/, textures/, videos/    | Client ready ✅         |

### 3D/Animation Stack (Code Verified)

| Component                          | Status       |
| ---------------------------------- | ------------ |
| `@react-three/fiber` + `drei`      | Installed ✅ |
| `CinematicHero` (4 pillars + home) | Working ✅   |
| `ParticleSystems` (4 missions)     | Working ✅   |
| `GsapProvider` + `ScrollTrigger`   | Working ✅   |
| Motion components (20+)            | Working ✅   |

### Curriculum Data (Verified)

| Data     | Location                                   | Structure                            |
| -------- | ------------------------------------------ | ------------------------------------ |
| 4 Tracks | `src/data/curriculum/index.ts`             | Jr A/B, Core (0-6), Advanced (7-12)  |
| Modules  | `src/data/curriculum/catalog.generated.ts` | Level, mission, objectives, duration |
| Lessons  | `src/data/curriculum/lesson-registry.ts`   | Blocks, widgets, quizzes             |
| Widgets  | `src/components/curriculum/widgets/`       | 6 interactive types                  |

---

## 7. PHASE 1 IMPLEMENTATION PLAN (Homepage 3D Experience)

### Files to Create/Modify (Local Edits → Git Push → Web Verify)

| File                                      | Action                         | Assets Used                                         |
| ----------------------------------------- | ------------------------------ | --------------------------------------------------- |
| `components/three/HomeScene.tsx`          | **NEW** — "home" pillar        | Kenney nature, mountain SVGs, sun SVG, leaf pattern |
| `components/three/BTreeLogo.tsx`          | **NEW** — SVG → 3D             | `logo.svg`, `icon.svg`                              |
| `components/three/MountainLayers.tsx`     | **NEW** — Parallax planes      | `mountain-layer.svg`, `atmosphere-layers.svg`       |
| `components/three/InstancedNature.tsx`    | **NEW** — InstancedMesh        | Kenney `tree.glb`, `plant.glb`, `mountain.glb`      |
| `components/site/ScrollTelling.tsx`       | **NEW** — 4-section scroll     | `CinematicHero` (4 pillars)                         |
| `components/site/MissionInfographics.tsx` | **NEW** — Animated charts      | `@bhavya/charts`, mission SVGs                      |
| `app/page.tsx`                            | **MODIFY** — Replace SplitHero | All above                                           |
| `components/three/CinematicHero.tsx`      | **EXTEND** — Add "home"        | —                                                   |

### Verification Gates (Per AGENTS.md §9)

1. `pnpm typecheck` — 0 errors
2. `pnpm lint` — 0 errors
3. `pnpm build` — exit 0 (in GitHub Actions)
4. `pnpm tokens:check` — no hardcoded colors
5. **Playwright**: 60fps on preview, reduced-motion fallback works

---

## 8. WEB VERIFICATION CHECKLIST (Per Feature)

### For Each New Component/Page:

| Check                     | Tool       | Command                                        |
| ------------------------- | ---------- | ---------------------------------------------- |
| TypeScript compiles       | Local      | `npx tsc --noEmit --project apps/ai-institute` |
| ESLint clean              | Local      | `pnpm eslint <file>`                           |
| CI passes                 | GitHub     | Check Actions tab                              |
| Vercel preview deploys    | Vercel     | `vercel_list_deployments`                      |
| Cloudflare Worker deploys | Cloudflare | `cloudflare-builds_workers_list`               |
| Visual renders correctly  | Playwright | Navigate + screenshot                          |
| 3D scene loads            | Playwright | Evaluate `THREE.WebGLRenderer`                 |
| Reduced motion works      | Playwright | Emulate `prefers-reduced-motion: reduce`       |
| Mobile responsive         | Playwright | Resize to 375px + screenshot                   |
| No console errors         | Playwright | Check console messages                         |
| Accessibility             | Playwright | Check ARIA, contrast                           |

---

## 9. ASSET UPLOAD WORKFLOWS (Web-Only)

### B2 (3D Models, Textures, Videos)

```yaml
# GitHub Action: .github/workflows/upload-assets.yml
# Trigger: workflow_dispatch or push to assets/
# Steps:
# 1. Checkout
# 2. Install b2 CLI: pip install b2
# 3. b2 authorize-account <keyId> <appKey>
# 3. b2 sync public/models/ b2://<bucket>/3d-models/
# 4. b2 sync public/brand/svg/ b2://<bucket>/brand/
```

### Supabase Storage (Avatars, Submissions)

```bash
# Via Supabase Dashboard → Storage → Buckets
# Buckets: avatars (public), submissions (private), textures (public)
# Policies: authenticated users can upload to own folder
```

---

## 10. QUICK START: VERIFY CURRENT DEPLOYMENT

### Run These Web Checks Now:

```bash
# 1. Check latest CI run
# https://github.com/thebhavyafoundation/Bhavya-OS/actions

# 2. Check Vercel deployments
# https://vercel.com/bhavya-foundation/bhavya-OS/deployments

# 3. Check Cloudflare Workers
# Via MCP: cloudflare_builds_workers_list({})

# 4. Visual test production
# playwright_browser_navigate({ url: "https://bhavya-os.vercel.app" })
# playwright_browser_take_screenshot({ fullPage: true })

# 5. Test 3D scene
# playwright_browser_navigate({ url: "https://bhavya-os.vercel.app" })
# playwright_browser_evaluate({ function: "() => document.querySelector('canvas')?.width" })
```

---

## 11. NEXT ACTIONS (Awaiting Your Approval)

### Option A: Phase 1 Homepage 3D Experience

- Create 8 files (listed in §7)
- Push → CI → Vercel preview → Playwright verify → Merge to main

### Option B: Full Stack Audit First

- Run all web verification checks (§10)
- Document gaps in CI/CD, secrets, asset sync
- Then proceed to Phase 1

### Option C: Curriculum Player (Phase 2)

- Build `/app/learn` with module grid + 3D thumbnails
- Integrate `KnowledgeAlignedLessonPlayer` + widgets

---

**Your Decision:** A / B / C / Custom

Once you approve, I'll:

1. Create implementation plan (if architectural)
2. Edit files locally
3. `git push` → GitHub Actions runs CI
4. Verify on web via Playwright/MCP
5. Report results with evidence

---

**Remember:** This machine = code editor only. Web = everything else.
