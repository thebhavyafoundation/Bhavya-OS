# Bhavya Foundation v2 — Truth, Homepage, Curriculum, Gallery, Certification

**Date:** 2026-09-26
**Status:** Approved for autonomous implementation (user directive: "do not ask any question do all these task autonomously i will share my feedback once you done with all this")
**Supersedes:** `2026-09-26-homepage-cinematic-rebuild-design.md` (homepage section)
**Authority:** user directives this session > `docs/constitution/*` (legacy 15-doc set for mission content) > design tokens

---

## 1. Goals (user directives, in locked order 1→5 + additions)

1. **Truth first** — Foundation has not launched; no invented numbers, no place names in photo credits, honest mission states.
2. **Homepage redesign** — replace the current layout entirely with the user-provided reference mockup; keep mission/pillar order.
3. **3D & motion** — premium feel via open-source animation/3D libraries already in deps.
4. **Curriculum navigability** — every module of the master curriculum reachable by route; no dead ends.
5. **World-class study material, ages 6–15** — benchmarked to USA (AI4K12/CSTA) and China (MOE) AI-education standards; missing modules/lessons created; every lesson carries graphics; interaction depth matched to age band; projects and experiments; certification with the official logo stamped on it.
6. **Gallery** — authenticated upload → images publicly displayed on the site (also the future home of mission-accomplishment photos).
7. **Future (spec'd, not built now):** AI Institute as an installable offline app, after the gallery ships.

## 2. Autonomous decisions (documented; user reviews at the end)

| #   | Decision                                                                                                                                                                                                                                                                                                                                                            | Rationale                                                                                                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **Numbers policy = structural-only.** Zero impact/statistics numbers on any marketing/public surface (homepage, missions, donate, about, programs). Structural curriculum counts (levels/modules/lessons) allowed **only in curriculum navigation UI**, computed from data, never hardcoded. Every displayed value registered in the claims registry.               | User: "make sure you dont display any numbers"; confirmed 74 as real curriculum count.                                                  |
| D2  | **Create missing modules.** The 74 catalog modules remain the canonical spine; two Junior tracks (12 new modules) are added to genuinely cover ages 6–11. Total becomes data-computed (86).                                                                                                                                                                         | User: "if the modules are not present create them"; ages 6–15 cannot be served by the current older-skewing catalog alone.              |
| D3  | **Age architecture:** Junior 6–8 (new), Junior 9–11 (new), Core 12–15 (catalog L0–L6), Advanced 15+/mentor-led (catalog L7–L12, labeled honestly). Each module/lesson carries an explicit `ageBand`.                                                                                                                                                                | Catalog levels L7–L12 (products, research, entrepreneurship, mentorship) are not 6–15 material; labeling beats silently mis-banding.    |
| D4  | **Photos:** user supplies hero (person over snow-peak sunrise) + quote-band panorama later; I source mission-tile photos; existing `public/photography/` JPEGs used as interim; credits = author + license only, **no place names** (also stripped from alt text).                                                                                                  | User directive.                                                                                                                         |
| D5  | **Gallery storage:** R2 bucket (`GALLERY_BUCKET` binding in `wrangler.json`) for image blobs + Turso table for metadata. **Fallback if R2 binding fails in deploy:** WebP ≤ 200 KB base64 blobs in Turso (same API surface).                                                                                                                                        | Blobs don't belong in the DB; app already has Turso; binding-based R2 needs no credentials.                                             |
| D6  | **Certificate:** client-rendered React certificate (ivory/gold, guilloche border, **logo mark as gold seal**, Playfair name, ID + QR) → PNG download (`html-to-image`) + print CSS. Verification at `/verify/[id]` backed by a Turso `certificates` row. Issued per **module completion** (all lessons + quiz ≥ 80). No puppeteer/react-pdf (won't run on Workers). | Research finding; "Learning Before Certification" (Doc 14 Art. 3) honored — certificate records completion, never claims accreditation. |
| D7  | **Logo integration:** header, footer, favicon/apple-touch/OG (mark cropped from `C:\Users\kanta\Downloads\logo.png` via System.Drawing), hero watermark, auth + 404 + empty states, certificate seal, `/verify`, print/PDF artifacts. Dark surfaces: logo sits on an ivory chip (PNG has baked white bg).                                                           | User: official logo "everywhere you think it should be integrated".                                                                     |
| D8  | **3D approach (open source, already in deps):** GSAP + Lenis + `@gsap/react` scroll/micro-motion; one signature lazy WebGL scene (`three` + `@react-three/fiber`) — low-poly ridgeline + drifting mist inside the dark Four Pillars section; GSAP 3D tilt on pillar/mission cards; all gated by `prefers-reduced-motion` and lazy-mounted.                          | User asked for 3D; brand is institutional/editorial — atmosphere over spectacle; no new dependencies needed.                            |
| D9  | **Route authority:** concrete paths below are provisional; `docs/architecture/CANONICAL_ROUTE_MAP.md` + `bhavya-route-audit` consulted at implementation before finalizing.                                                                                                                                                                                         | Repo rule: one concept → one route.                                                                                                     |
| D10 | **Shipping pipeline** (authorized): local gates → commit → push (GitHub API fallback if `git push` hangs) → PR → CI green → merge → Cloudflare deploy → Playwright on live URL.                                                                                                                                                                                     | User wants complete work, feedback at the end.                                                                                          |
| D11 | **Scope excludes:** offline PWA (next session, after gallery), `deploy.yml`/`main` wiring, 01-vs-05 palette conflict (human gate), any constitutional text edits.                                                                                                                                                                                                   | Explicit non-goals / human gates.                                                                                                       |

## 3. Standards basis (research summary — the "deep research" layer)

**USA**

- **AI4K12 Five Big Ideas** (BI1 Perception, BI2 Representation & Reasoning, BI3 Learning, BI4 Natural Interaction, BI5 Societal Impact) with K-2 / 3-5 / 6-8 / 9-12 progressions → primary content framework; every module and lesson tagged with the big ideas it teaches.
- **CSTA 2017** (e.g. 3B-AP-08/09, 3A-IC-25) + **CSTA × AI4K12 2025 AI Learning Priorities** (5 categories × 4 grade bands) → citation chips on module pages.
- **UNESCO AI Competency Framework 2024** (12 competencies × Human-Centered / Ethics of AI / Technical Aspects / System Design) → ethics/system threads in senior modules.

**China**

- 2017 State Council《新一代人工智能发展规划》(AI education in primary/secondary + 2030 national plan) → framing note.
- 2022《义务教育信息科技课程标准》— standalone subject grades 3–8, six logic lines incl. 人工智能, four 学段 (1–2, 3–4, 5–6, 7–9), 1–3% of class hours → maps to Junior/Core bands.
- 2017/2020 高中信息技术课标 module《人工智能初步》(2 credits / 36 h) → Core band senior modules.
- 2024–2025 MOE《关于加强中小学人工智能教育的通知》+ 通识教育指南 (four dimensions: 认知/技能/思维/价值观; perceive→understand→create progression) → lesson rubric grid.

**Progression arc (both systems synthesized):** aware & playful (6–8) → guided experiment & detection (9–11) → build with blocks/sandboxes (12–14) → create, audit, defend (15+). Modality ladder: unplugged → no-code tools → blocks → text/code.

Every lesson exposes an **"Standards" footer**: AI4K12 big idea(s), CSTA ref (if any), China dimension (认知/技能/思维/价值观) + 学段. Certification screen repeats it.

## 4. Content architecture

### 4.1 Tracks

| Track                | Band       | Modules                 | Source                                                                                                                                          |
| -------------------- | ---------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Junior A — Sprouts   | 6–8        | 6 new                   | created (AI Around Me, Smart Machines, Human vs Machine, Data Detectives, Friendly Robots, Kind Digital Citizen)                                |
| Junior B — Explorers | 9–11       | 6 new                   | created (How Machines Learn, Patterns & Predictions, Sensors & Perception, Talking with Machines, Our AI Rules, Mini Project: Build a Rule-Bot) |
| Core                 | 12–15      | 38 (L0:2, L1–L6:6 each) | `docs/master-curriculum/MODULE_CATALOG.md`                                                                                                      |
| Advanced             | 15+/mentor | 36 (L7–L12)             | same catalog, honestly labeled                                                                                                                  |

Counts computed from data via `getTotalModules()` (+ junior registry); never hardcoded (D1).

### 4.2 Module & lesson schema (new `src/data/curriculum/` modules)

```ts
type AgeBand = "6-8" | "9-11" | "12-15" | "advanced";
interface CurriculumModule {
  id: string; // "l3-m2" | "jr-a-1"
  level: number | "jr-a" | "jr-b";
  title: string;
  mission: string;
  objectives: string[];
  ageBand: AgeBand;
  duration: string;
  handsOnPercent: number;
  projects: string[];
  labs: string[];
  standards: {
    bigIdeas: ("BI1" | "BI2" | "BI3" | "BI4" | "BI5")[];
    csta?: string[];
    cnDim: "认知" | "技能" | "思维" | "价值观";
    cnStage: 1 | 2 | 3 | 4 | 5 | 6;
  };
  lessons: Lesson[];
}
type LessonBlock =
  | { kind: "visual"; diagram: DiagramSpec } // declarative → DiagramKit SVG
  | { kind: "prose"; text: string } // age-tuned voice, 300–600 words
  | { kind: "interactive"; widget: WidgetSpec } // widget registry by id+config
  | { kind: "quiz"; questions: QuizQ[] }
  | {
      kind: "experiment";
      title: string;
      materials: string[];
      steps: string[];
      safety?: string;
    }
  | { kind: "project"; brief: string; steps: string[]; deliverable: string };
interface Lesson {
  id;
  moduleId;
  band: AgeBand;
  title;
  durationMin;
  blocks: LessonBlock[];
}
```

**Reuse first:** `lesson-content.ts` (10 rich lessons), `assessments.ts` (35+ questions), `lab-exercises.ts`, `knowledge-packages.ts`, `@bhavya/interactive-components` (TransformerVisualizer, TokenizerExplorer, AttentionVisualizer), existing playground components — wired into the new structure rather than rewritten.

### 4.3 Widget kit (band-tagged, reusable)

- **6–8:** `tap-match`, `story-scene`, `sort-basket`, `listen-repeat` (Web Speech where useful), `big-movie` (step-through animation)
- **9–11:** `guided-sim`, `plus-sample`, `spot-the-bias`, `data-detective`, `what-happens-next` (predict-then-reveal)
- **12–15:** `perceptron-play`, `knn-lab`, `decision-tree-build`, `tokenize-explorer`, `attention-play` (existing), `prompt-lab`, `train-a-classifier` (in-browser, Teachable-Machine-style), `overfit-demo`, `agent-flow`, `block-coding` (rule/flow builder)
- **advanced:** existing Transformer/attention visualizers, `research-sandbox`, `system-architect`

Each lesson: ≥ 1 visual + ≥ 1 interactive + quiz + experiment or project. Quiz options carry explanatory feedback (research: immediate, content-specific feedback).

### 4.4 Diagram kit (declarative SVG, tokens only)

`flow`, `pipeline`, `cycle`, `timeline`, `compare`, `network`, `labeled-photo`, `bar-chart` — render from `DiagramSpec` using platform-ui tokens (no hardcoded colors; `pnpm tokens:check` gate).

## 5. Pages & sections

### 5.1 Homepage (full replace of `src/app/page.tsx`, per reference)

1. **Header** — official logo lockup left; nav (Explore / Learn / Participate / About); search; `Support Our Work →` pill.
2. **Split hero** — left ivory panel: eyebrow, H1 "Building for Generations.", lead (Restoring nature. Advancing knowledge. Preserving heritage. Empowering communities.), CTAs `Explore Bhavya →` + `Our Missions →`, scroll cue. Right: full-bleed sunrise photo (interim = `PHOTO.hero`, user image later), bottom-right "For People. For Nature. For Generations." + credit (author/license, no place). 100svh, no numbers.
3. **Four Pillars** — dark section card: "OUR MSSIONS / Four Pillars. A Lasting Tomorrow." / "Different paths. A shared purpose."; 4 colored pillar cards (Forest, Knowledge, Heritage, Community) → `/missions/*`. Lazy r3f mist scene behind (D8).
4. **Mission tiles** — three photo tiles exactly per reference: Knowledge, Community, Heritage (eyebrow + serif headline + copy + Explore link). Forest is pillar-card + nav featured.
5. **Four small tiles** — Foundation, Evidence (copy made honest: evidence will be published sourced & verified), Participate, Bhavya OS.
6. **Quote band** — "Forests grow slowly. So do stronger societies. Both are worth the wait." — BHAVYA FOUNDATION; panorama interim = existing landscape photo, user image later.
7. **CTA** — "A Kinder, More Resilient India Is Possible." + `Join the Journey →`.
8. **Footer** — dark forest green: logo chip, nav, honesty line, credits (author/license only).

Removed: ChapterRail, ten-beat story, fake proof chips (`homepage-story.ts` stats), all stat cards.

### 5.2 Mission pages (`/missions/{knowledge,forest,heritage,community}`)

Structure per mission: status banner (**Knowledge = Active**, others = **Not started — in planning**), constitutional mandate (cited from the legacy 15-doc set via `@bhavya/constitution` SDK), **roadmap** (phase-based plan entries explicitly labeled _plan_, no dates-as-facts, no numbers), empty **accomplishments** section ("No accomplishments published yet" + data hooks), CTA. Content source: Doc 12 (Forest), Doc 14 + Doc 1/13 (Knowledge/AI Labs), Doc 1 art. 13.7 (Heritage), Doc 10 (Community/BVC), Doc 15 (four-mission taxonomy). Roadmap wording must not read as achieved.

### 5.3 Curriculum routes (provisional, D9)

- `/curriculum` — hub: 4 track cards (bands), structural counts from data.
- `/curriculum/[level]` — module list for level (incl. `jr-a`, `jr-b`).
- `/curriculum/[level]/[module]` — module detail: objectives, standards chips, lessons, experiment, project, certificate eligibility.
- `/curriculum/[level]/[module]/lessons/[lessonId]` — lesson player: block renderer, progress hooks to `POST /api/student/progress`, standards footer.
- Sitemap updated; every one of the 86 modules linked from hub → level → module (route audit).
- Existing `/knowledge/academy`, `/ai-institute/curriculum`, `/learning-paths` either redirect to canonical or link into it (resolve via route map).
- **Progress API integration:** `POST /api/student/progress` currently validates lesson IDs against `academy-courses.ts` only (`isValidLessonId`); extend it to accept curriculum-lesson IDs (same global-union check) when the lesson player ships.

### 5.4 Gallery

- `/gallery` — public, filter by mission/track, masonry grid, lightbox, credit line (author/license), lazy images.
- `/os/studio/gallery` — authenticated upload (drag-drop, client WebP conversion ≤ 2 MB → resize ≤ 2048px, caption/credit/mission tag), list, delete.
- API: `GET /api/gallery` (public, paginated) · `POST /api/gallery` (auth + role: admin/editor, multipart) · `DELETE /api/gallery/[id]` (owner/admin).
- Storage: R2 `GALLERY_BUCKET` + `gallery_items` table (D5). Audit event on upload/delete.

### 5.5 Certificate & verification

- Completion rule: all module lessons complete + module quiz ≥ 80 (progress API already tracks lesson completion & quiz scores) → certificate claimable on module page.
- Design: ivory paper, guilloche SVG border, Playfair learner name, module title, band, date, completion line, unique `BVF-…` ID, QR → `/verify/[id]`, **gold embossed seal = official logo mark**, signature line "Bhavya Foundation".
- Render: React → PNG via `html-to-image`, plus print stylesheet. New deps (small, browser-safe): `html-to-image`, `qrcode`.
- `POST /api/certificates` (auth; validates completion server-side) → row; `GET /api/certificates/[id]` + `/verify/[id]` public (id is random 128-bit; returns learner name, module, date — nothing else).

## 6. Data model changes (Turso + local sqlite via migration `002_gallery_certificates`)

```sql
CREATE TABLE IF NOT EXISTS gallery_items (
  id TEXT PRIMARY KEY, kind TEXT NOT NULL DEFAULT 'photo',
  mission TEXT, title TEXT NOT NULL DEFAULT '', caption TEXT NOT NULL DEFAULT '',
  credit TEXT NOT NULL DEFAULT '', r2_key TEXT NOT NULL,
  created_by TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY, learner_name TEXT NOT NULL, module_id TEXT NOT NULL,
  user_id TEXT NOT NULL, band TEXT NOT NULL, quiz_score INTEGER NOT NULL,
  issued_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS mission_updates (          -- accomplishment-ready, empty at launch
  id TEXT PRIMARY KEY, mission TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'planned',
  title TEXT NOT NULL, body TEXT NOT NULL DEFAULT '', photo_key TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

Prod path: add to `db.ts` `BASELINE_SCHEMA` (idempotent `IF NOT EXISTS`) + local migration file — mirrors existing pattern.

**Claims registry:** `src/lib/claims.ts` — `{ id, claim, state: verified|target|pending|removed, source, checked }`; UI reads only registry values; `pnpm antislop` + review ensure no stray invented numbers.

## 7. Implementation phases (locked order)

| Phase                  | Scope                                                                                                                                                                                                                                                                                                                                                                                    | Key gates                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **P1 Truth**           | claims registry; purge every invented number site-wide; place-free credits from `photo_manifest`; fix photo↔mission mismatches (each mission page/section uses its own pillar's photo); mission pages rebuild (status/roadmap/empty accomplishments, constitution citations); honest copy sweep (`/programs`, `/donate`, `/mission`, `/faq`, `/knowledge/academy`, `/knowledge/courses`) | tsc, eslint, antislop, tokens:check                |
| **P2 Homepage + logo** | full replace per §5.1; logo assets (mark crop, favicon, OG, chips); logo in header/footer/auth/404/empty states                                                                                                                                                                                                                                                                          | as P1 + route audit                                |
| **P3 Motion & 3D**     | §D8: reveals, tilt, lazy r3f scene, reduced-motion pass                                                                                                                                                                                                                                                                                                                                  | tsc, eslint, tokens, perf sanity (no layout shift) |
| **P4 Navigability**    | curriculum schema + routes §5.3; wire catalog → data; academy dead-ends fixed; sitemap                                                                                                                                                                                                                                                                                                   | route audit (0 orphan modules), tsc, eslint        |
| **P5 Content**         | junior 12 modules; widget + diagram kits; lesson authoring for all 86 modules in parallel batches (≥1 visual + ≥1 interactive + quiz + experiment/project each; standards tags); wire legacy assets; lesson player + progress                                                                                                                                                            | tsc, eslint, tokens, content-truth review          |
| **P6 Certification**   | §5.5: claim flow, cert component, verify route, deps                                                                                                                                                                                                                                                                                                                                     | tsc, eslint, live claim test                       |
| **P7 Gallery**         | R2 + tables + API + studio upload + public grid                                                                                                                                                                                                                                                                                                                                          | tsc, eslint, upload→display E2E on live            |
| **P8 Ship & verify**   | per-phase PR→CI→merge→deploy; final Playwright pass on live URL; evidence screenshots; summary report for user feedback                                                                                                                                                                                                                                                                  | CI 4/4, live verification                          |

Parallelization: P1–P4 sequential (foundations); P5 content authoring via parallel subagents by level batch; P6–P7 independent of each other after P4.

## 8. Risks & fallbacks

- **R2 binding fails at deploy** → D5 fallback (WebP blobs in Turso), same API. Test early in P7.
- **`git push` hangs (known)** → `git ls-remote` probe; GitHub API file push + local rebase fallback (proven in PR #5).
- **Content volume** → framework first, batch authoring with strict per-lesson minimum bar; depth = concise (300–600 words) not encyclopedic; reuse legacy assets.
- **Local machine limits (rule 16)** → no local builds; `npx tsc --noEmit`, targeted eslint, tokens/antislop only; visual checks only on deployed URL.
- **Constitution quote accuracy** → citations via `@bhavya/constitution` SDK / direct archive reads; no paraphrase presented as quotation.
- **L7–L12 ≠ ages 6–15** → honest "Advanced (15+/mentor-led)" labeling (D3), not silent omission.

## 9. Verification plan

1. After every phase: `npx tsc --noEmit`, `npx eslint <changed>`, `pnpm tokens:check`, `pnpm antislop`.
2. Per PR: GitHub checks 4/4 (lint-and-typecheck, test, secret-scan, build).
3. After each deploy: Playwright scripts (`pwverify/`) against live URL — homepage beats, all 86 module links resolve (crawler), lesson player interaction, certificate claim + QR verify, gallery upload → public display, zero console errors, `overflowX 0`, reduced-motion pass.
4. Final: `git diff --check`, `git status` clean of unintended files, evidence screenshots, honest gap list in the completion report.
