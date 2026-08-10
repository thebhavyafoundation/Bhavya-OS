# Deployment Matrix

**Generated:** 2026-08-06 02:45 IST

---

## Deployable Applications

| App           | Expected Target | Actual Vercel Project           | Root Dir | Build Command                        | Output Dir                 | Production URL                         | Status   | Health        |
| ------------- | --------------- | ------------------------------- | -------- | ------------------------------------ | -------------------------- | -------------------------------------- | -------- | ------------- |
| website       | `website`       | **bhavya-foundation-website**   | (root)   | (root vercel.json)                   | (root vercel.json)         | bhavya-foundation-website.vercel.app   | DEPLOYED | **ERROR**     |
| website       | `website`       | **bhavya-foundation-dashboard** | (root)   | `vercel-build-app.mjs website`       | `apps/website/.next`       | bhavya-foundation-dashboard.vercel.app | DEPLOYED | **DUPLICATE** |
| website       | `website`       | **website**                     | (root)   | (empty)                              | (empty)                    | website-ten-vert-90.vercel.app         | DEPLOYED | **ORPHANED**  |
| admin         | `admin`         | admin                           | (root)   | `vercel-build-app.mjs admin`         | `apps/admin/.next`         | admin-orpin-beta-40.vercel.app         | DEPLOYED | READY         |
| dashboard     | `dashboard`     | dashboard                       | (root)   | `vercel-build-app.mjs dashboard`     | `apps/dashboard/.next`     | dashboard-sooty-six-74.vercel.app      | DEPLOYED | READY         |
| design-system | `design-system` | design-system                   | (root)   | `vercel-build-app.mjs design-system` | `apps/design-system/.next` | design-system-one-pi.vercel.app        | DEPLOYED | READY         |
| docs          | `docs`          | docs                            | (root)   | `vercel-build-app.mjs docs`          | `apps/docs/.next`          | docs-seven-alpha-44.vercel.app         | DEPLOYED | READY         |
| forest        | `forest`        | forest                          | (root)   | `vercel-build-app.mjs forest`        | `apps/forest/.next`        | forest-two-ochre.vercel.app            | DEPLOYED | READY         |
| heritage      | `heritage`      | heritage                        | (root)   | `vercel-build-app.mjs heritage`      | `apps/heritage/.next`      | heritage-omega-dun.vercel.app          | DEPLOYED | READY         |
| knowledge     | `knowledge`     | knowledge                       | (root)   | `vercel-build-app.mjs knowledge`     | `apps/knowledge/.next`     | knowledge-woad-six.vercel.app          | DEPLOYED | READY         |
| library       | `library`       | library                         | (root)   | `vercel-build-app.mjs library`       | `apps/library/.next`       | library-eight-rosy.vercel.app          | DEPLOYED | READY         |
| research      | `research`      | research                        | (root)   | `vercel-build-app.mjs research`      | `apps/research/.next`      | research-rho-ten.vercel.app            | DEPLOYED | READY         |
| transparency  | `transparency`  | transparency                    | (root)   | `vercel-build-app.mjs transparency`  | `apps/transparency/.next`  | transparency-gold.vercel.app           | DEPLOYED | READY         |
| volunteer     | `volunteer`     | volunteer                       | (root)   | `vercel-build-app.mjs volunteer`     | `apps/volunteer/.next`     | volunteer-sepia.vercel.app             | DEPLOYED | READY         |
| bhavya-ai-lab | `bhavya-ai-lab` | bhavya-ai-lab                   | (root)   | `vercel-build-app.mjs bhavya-ai-lab` | `apps/bhavya-ai-lab/.next` | bhavya-ai-lab.vercel.app               | DEPLOYED | READY         |

---

## NOT DEPLOYED (10 apps)

| App                         | Has Vercel Config | Reason                            |
| --------------------------- | ----------------- | --------------------------------- |
| ai-institute                | NO                | No vercel.json, no lint/typecheck |
| bhavya-intelligence-network | NO                | No vercel.json, no lint/typecheck |
| capability-center           | NO                | Level 1 — scaffolded only         |
| github-intelligence-lab     | NO                | Level 1 — scaffolded only         |
| github-os                   | NO                | No vercel.json, no lint           |
| ioc                         | NO                | No vercel.json, no lint           |
| knowledge-studio            | NO                | No vercel.json, no lint/typecheck |
| lesson-studio               | NO                | No vercel.json                    |
| open-source-intelligence    | NO                | Level 1 — scaffolded only         |
| social-os                   | NO                | No vercel.json                    |

---

## Deployment Anomalies

### 1. THREE projects for one app (website)

| Project                     | Builds                         | Status |
| --------------------------- | ------------------------------ | ------ |
| bhavya-foundation-website   | website (via root vercel.json) | ERROR  |
| bhavya-foundation-dashboard | website (misconfigured)        | READY  |
| website                     | nothing (Astro, orphaned)      | ERROR  |

**Action:** Consolidate to ONE project named `website`.

### 2. KNOWLEDGE has no GitHub link

- Build config is correct
- Deployed and READY
- But not connected to GitHub — manual deploys only

### 3. ROOT vercel.json conflicts with app-level configs

12 apps have their own `vercel.json`. The root `vercel.json` targets `website`. If a project doesn't have its own config, it falls back to root — but root builds website, not the correct app.

---

## Deployment Health Summary

| Status       | Count | Projects                                                                                                                                                                    |
| ------------ | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| READY        | 11    | admin, dashboard, design-system, docs, forest, heritage, knowledge, library, research, transparency, volunteer, bhavya-ai-lab                                               |
| ERROR        | 2     | bhavya-foundation-website, website                                                                                                                                          |
| DUPLICATE    | 1     | bhavya-foundation-dashboard (builds website)                                                                                                                                |
| NOT DEPLOYED | 10    | ai-institute, bhavya-intelligence-network, capability-center, github-intelligence-lab, github-os, ioc, knowledge-studio, lesson-studio, open-source-intelligence, social-os |

---

## Vercel Project Count

| Metric                       | Count                                    |
| ---------------------------- | ---------------------------------------- |
| Total Vercel projects        | 15                                       |
| Correct 1:1 mappings         | 11                                       |
| Duplicate projects           | 2 (bhavya-foundation-dashboard, website) |
| Orphaned projects            | 1 (website — Astro)                      |
| Projects missing GitHub link | 1 (knowledge)                            |
| **Canonical target**         | **13 projects**                          |
