# BFAOS V2 — 01 Current-State Inventory

**Date:** 2026-11-13 · **Base:** `master` @ `98388ddbe64a9e969e9afb30367ac65f7edd6566` (confirmed on remote)

All figures below were observed directly during Phase 0 (`VERIFIED`).

## 1. Repository

| Measure | Value |
|---|---|
| Remote | `https://github.com/thebhavyafoundation/Bhavya-OS.git` (public) |
| Default branch | `master` @ `98388ddb` |
| Tracked files | 5,103 |
| Applications | 8 (`admin`, `ai-institute`, `bhavya-intelligence-network`, `design-system`, `docs`, `github-os`, `ioc`, `social-os`) |
| Packages | 67 |
| Workflows | 9 |
| Tracked skills | 20 (24 present on disk) |
| Documentation files | 786 under `docs/` |
| Total commits | 662 · commits in last 30 days: 111 · distinct authors in last 30 days: 2 |
| Package manager | pnpm 10.17.1 (workspace: `apps/*`, `packages/*`) |

Every application declares a `build` script; the canonical deployable is `@bhavya/ai-institute`
(`apps/ai-institute`).

## 2. Branches, pull requests, worktrees, stashes

| Item | Value |
|---|---|
| Local branches | 60 |
| Remote branches | 62 |
| Worktrees | 12 (main checkout + 11 auxiliary, including `D:\Bhavya-OS-wt\` and two `C:\Users\kanta\AppData\Local\Temp\opencode\` trees) |
| Stashes | 5 (all pre-existing, untouched) |
| Untracked files | 184 (181 pre-existing evidence artefacts + 3 Phase 1 evidence reports) |
| Tracked working-tree changes | 0 |

**Open pull requests: 20.** Grouped by origin:

| PR | State | Head | Base | Subject |
|---|---|---|---|---|
| #62 | draft | `6d40870e` | `98388dd` | feat(visual): concept-linked diagram + Ruflo orchestration + visual inventory |
| #63 | draft | `7dcf78b2` | `98388dd` | chore(ci): scope workflow tokens and pin every action to an immutable commit |
| #64 | draft | `7be9114d` | `98388dd` | fix(deploy): stop excluding /content from the Vercel source upload |
| #65 | draft | `a73c7995` | `98388dd` | fix(deploy): point the Vercel output directory at the real Next.js output |
| #61 | ready | `80b29b4` | `98388dd` | chore: install the bhavya-cloud-workflow operating skill |
| #60 | ready | `62c78c1` | `5f61a80` | docs(agents): vendor pinned icm-architect skill |
| #53, #52, #51 | ready | — | `197f31e` | ECC catalog, Ponytail pre-push gate, Ponytail wrapper |
| #49, #48, #46 | ready | — | `9881eb5` | OpenNext instrumentation / materialise conditional exports |
| #45 | ready | `fd905a4` | `197f31e` | fix(ai-institute): add the missing OpenNext and Wrangler configuration |
| #42 | draft | `c04fd47` | `9bad280` | feat(curriculum): lesson shell and lesson-route 404 fix |
| #37, #35 | ready | — | `9bad280` | OpenNext build-gate diagnosis |
| #31, #29, #27, #26 | ready | — | `3a3cbd2` | diagram profile, single Cloudflare path, platform-ui client fix, UX-0 audit |

**Risk (`VERIFIED`):** 15 open PRs have bases that are ancestors of current `master` — merging one
without rebase can revert newer work. PR #53 additionally documents an unresolved constitutional
question (`AGENTS.md` §8 skill count).

## 3. Applications and their verification depth

| App | Files | Test files | Deployment role |
|---|---|---|---|
| `ai-institute` | 729 | **35** | canonical production + preview application |
| `github-os` | 112 | 0 | internal OS surface |
| `ioc` | 41 | 0 | internal OS surface |
| `social-os` | 40 | 0 | internal OS surface |
| `admin` | 29 | 0 | internal OS surface |
| `docs` | 21 | 0 | internal OS surface |
| `design-system` | 20 | 0 | shared UI primitives |
| `bhavya-intelligence-network` | 13 | 0 | internal OS surface |

Repository-wide: **207 test files** — 35 in `ai-institute`, 60 in packages, 0 elsewhere. Only **13 of
67 packages** declare a `test` script (`ai`, `api`, `bee`, `constitution`, `content-core`, `database`,
`events`, `kernel`, `notifications`, `platform`, `runtime`, `security`, `workflows`).

## 4. Learner-facing surface

`ai-institute` exposes **57 route segments** (`VERIFIED`, live): `about`, `accessibility`,
`ai-institute`, `app`, `assessment`, `auth`, `community`, `concepts`, `contact`, `contributing`,
`courses`, `curriculum`, `dashboard`, `donate`, `faq`, `forbidden`, `forest`, `get-involved`,
`governance`, `heritage`, `impact`, `initiatives`, `knowledge`, `knowledge-graph`, `learning-paths`,
`library`, `login`, `mentor`, `mission`, `missions`, `nature`, `onboarding`, `os`, `playground`,
`portfolio`, `press`, `privacy`, `profile`, `programs`, `projects`, `register`, `research`,
`resources`, `schools`, `studio`, `support`, `teachers`, `terms`, `transparency`, `verify`,
`volunteer`, `workspace`.

Content assets: 472 tracked files under `content/` (458 JSON, 8 MDX, 6 HTML), 16 curriculum data
files and 18 lesson-registry files in the app.

## 5. Workflow inventory

| Workflow | Trigger | Role |
|---|---|---|
| `ci.yml` | push→master, PR→master, dispatch | lint-and-typecheck, secret-scan, platform-contract, test, build |
| `deploy-cloudflare.yml` | **push→master** | build + deploy to the production Worker (no path filter) |
| `deploy.yml` | push/PR→`main` | Vercel deploy — **dormant** (no `main` branch exists on origin) |
| `opennext-build-verify.yml` | PR (paths), dispatch | production-equivalent OpenNext build, no deploy |
| `opennext-preview.yml` | PR (paths), dispatch | Cloudflare preview worker deploy |
| `pages.yml` | push→`main`/`feat/immersive-hero-background`, dispatch | GitHub Pages publish |
| `assets-glb.yml`, `assets-ktx2.yml`, `assets-posters.yml` | dispatch only | asset optimisation, artefact upload only |

## 6. Skills

| Skill set | Count | Tracked | Notes |
|---|---|---|---|
| `bhavya-*` project/wrapper skills | 20 | yes | canonical project skills |
| `apple-design` | 1 | **no** | third-party, licence unverified — wrapper stays disabled |
| `design-taste-frontend` | 1 | **no** | third-party, licence unverified — wrapper stays disabled |
| `icm-architect` | 26 | **no** | MIT, provenance recorded; PR #60 proposes vendoring |
| `impeccable` | 54 | **no** | Apache-2.0; needs licence file + provenance |

## 7. Documentation structure

`docs/` contains 786 files across 47 subdirectories, including `adr`, `architecture`, `constitution`,
`decisions`, `governance`, `incidents`, `security`, `standards`, `verification`, `products`,
`project-phoenix`, `platform-*`, `wave-9`/`wave-10`, and `archive`. The repository already carries a
substantial governance and evidence culture — a strong foundation for BFAOS V2 documentation.

## 8. Preservation statement

Nothing in this inventory was modified. The main checkout remains the frozen PR #62 tree
(`feat/visual-learning-batch` @ `6d40870e`); all worktrees, stashes, untracked files and ignored files
are intact; `master` was not modified. This phase added only `docs/bfaos-v2/` on an isolated branch.
