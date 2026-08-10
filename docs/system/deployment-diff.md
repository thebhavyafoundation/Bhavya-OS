# Cross Validation Report — GitHub ↔ Repository ↔ Workspace ↔ Vercel

**Generated:** 2026-08-06 02:05 IST

---

## Mapping Table

| App           | GitHub Path           | Vercel Project                  | Root Directory | Build Command                                     | Output Directory           | Status | Issue                                                   |
| ------------- | --------------------- | ------------------------------- | -------------- | ------------------------------------------------- | -------------------------- | ------ | ------------------------------------------------------- |
| website       | `apps/website/`       | **bhavya-foundation-website**   | (root)         | (root vercel.json)                                | (root vercel.json)         | READY  | DUPLICATE — also built by `bhavya-foundation-dashboard` |
| website       | `apps/website/`       | **bhavya-foundation-dashboard** | (root)         | `node scripts/vercel-build-app.mjs website`       | `apps/website/.next`       | READY  | DUPLICATE — builds website, not dashboard               |
| website       | `apps/website/`       | **website**                     | (root)         | (empty)                                           | (empty)                    | ERROR  | ORPHANED — Astro framework, no link                     |
| admin         | `apps/admin/`         | admin                           | (root)         | `node scripts/vercel-build-app.mjs admin`         | `apps/admin/.next`         | READY  | OK                                                      |
| dashboard     | `apps/dashboard/`     | dashboard                       | (root)         | `node scripts/vercel-build-app.mjs dashboard`     | `apps/dashboard/.next`     | READY  | OK                                                      |
| design-system | `apps/design-system/` | design-system                   | (root)         | `node scripts/vercel-build-app.mjs design-system` | `apps/design-system/.next` | READY  | OK                                                      |
| docs          | `apps/docs/`          | docs                            | (root)         | `node scripts/vercel-build-app.mjs docs`          | `apps/docs/.next`          | READY  | OK                                                      |
| forest        | `apps/forest/`        | forest                          | (root)         | `node scripts/vercel-build-app.mjs forest`        | `apps/forest/.next`        | READY  | OK                                                      |
| heritage      | `apps/heritage/`      | heritage                        | (root)         | `node scripts/vercel-build-app.mjs heritage`      | `apps/heritage/.next`      | READY  | OK                                                      |
| knowledge     | `apps/knowledge/`     | knowledge                       | (root)         | `node scripts/vercel-build-app.mjs knowledge`     | `apps/knowledge/.next`     | READY  | NO GitHub link                                          |
| library       | `apps/library/`       | library                         | (root)         | `node scripts/vercel-build-app.mjs library`       | `apps/library/.next`       | READY  | OK                                                      |
| research      | `apps/research/`      | research                        | (root)         | `node scripts/vercel-build-app.mjs research`      | `apps/research/.next`      | READY  | OK                                                      |
| transparency  | `apps/transparency/`  | transparency                    | (root)         | `node scripts/vercel-build-app.mjs transparency`  | `apps/transparency/.next`  | READY  | OK                                                      |
| volunteer     | `apps/volunteer/`     | volunteer                       | (root)         | `node scripts/vercel-build-app.mjs volunteer`     | `apps/volunteer/.next`     | READY  | OK                                                      |
| bhavya-ai-lab | `apps/bhavya-ai-lab/` | bhavya-ai-lab                   | (root)         | `node scripts/vercel-build-app.mjs bhavya-ai-lab` | `apps/bhavya-ai-lab/.next` | READY  | OK                                                      |

---

## Identified Mismatches

### 1. DUPLICATE: Three projects for one app (website)

**Problem:** `bhavya-foundation-website`, `bhavya-foundation-dashboard`, and root `vercel.json` all deploy `@bhavya/website`.

**Evidence:**

- `bhavya-foundation-website`: No build config — uses root `vercel.json` which builds `website`
- `bhavya-foundation-dashboard`: Build command is `node scripts/vercel-build-app.mjs website` (not dashboard)
- Root `vercel.json`: `buildCommand: "node scripts/vercel-build-app.mjs website"`

**Impact:** Confusion. Multiple URLs for the same app. Deployments may go to the wrong project.

**Canonical per architecture:** ONE project named `website` should exist.

### 2. ORPHANED: `website` project is misconfigured

**Problem:** The `website` Vercel project has framework set to `astro`, no GitHub link, no build config, and status ERROR.

**Evidence:**

- Framework: `astro` (website is Next.js)
- No `link` property (not connected to GitHub)
- No `buildCommand`, `installCommand`, or `outputDirectory`
- Latest deployment status: ERROR

**Impact:** This project cannot deploy. It's a leftover from an earlier prototype.

### 3. MISSING GitHub Link: `knowledge`

**Problem:** The `knowledge` project has correct build config but no GitHub repository link.

**Evidence:**

- No `link` property in API response
- Deployments were done manually

**Impact:** Pushing to GitHub will NOT trigger deployments for this project.

### 4. MISNAMED: `bhavya-foundation-dashboard` builds website

**Problem:** Project named `bhavya-foundation-dashboard` actually builds `@bhavya/website`, not `@bhavya/dashboard`.

**Evidence:**

- Build command: `node scripts/vercel-build-app.mjs website`
- Output directory: `apps/website/.next`

**Impact:** If someone expects this to be the dashboard, they'll get the website instead.

---

## Summary

| Metric                         | Count                             |
| ------------------------------ | --------------------------------- |
| Total Vercel projects          | 15                                |
| Correct projects (1:1 mapping) | 11                                |
| Duplicate projects (website)   | 3 (should be 1)                   |
| Orphaned projects              | 1 (`website` — Astro)             |
| Missing GitHub links           | 1 (`knowledge`)                   |
| Misnamed projects              | 1 (`bhavya-foundation-dashboard`) |
| Apps without Vercel projects   | 10 (expected — not ready)         |

---

## What Should Exist (Canonical Architecture)

Per the canonical architecture directive:

| App           | Vercel Project  | Status            |
| ------------- | --------------- | ----------------- |
| website       | `website`       | FIX NEEDED        |
| admin         | `admin`         | OK                |
| docs          | `docs`          | OK                |
| library       | `library`       | OK                |
| dashboard     | `dashboard`     | OK                |
| design-system | `design-system` | OK                |
| forest        | `forest`        | OK                |
| heritage      | `heritage`      | OK                |
| knowledge     | `knowledge`     | NEEDS GITHUB LINK |
| transparency  | `transparency`  | OK                |
| research      | `research`      | OK                |
| volunteer     | `volunteer`     | OK                |
| bhavya-ai-lab | `bhavya-ai-lab` | OK                |
| **TOTAL**     | **13 projects** |                   |

**Current: 15 projects. Target: 13 projects.**

Projects to remove:

1. `bhavya-foundation-website` (duplicate of website)
2. `bhavya-foundation-dashboard` (misnamed duplicate of website)
3. `website` (orphaned Astro project)

Projects to fix:

1. `knowledge` — add GitHub link
