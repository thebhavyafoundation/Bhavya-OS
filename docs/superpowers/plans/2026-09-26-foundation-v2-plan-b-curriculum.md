# Foundation v2 — Plan B: Curriculum Navigability + Content (P4 + P5)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every one of the 86 curriculum modules (74 catalog + 12 Junior) reachable by route with no dead ends, plus world-class lesson content (ages 6–15) benchmarked to AI4K12/CSTA and China MOE standards, rendered by a block-based lesson player wired to the progress API.

**Architecture:** A generated catalog registry (parsed from `MODULE_CATALOG.md`) + a hand-authored Junior registry + per-level lesson files feed one data layer (`src/data/curriculum/`). Routes extend the existing `/curriculum/levels/[level]` tree down to `[module]` and `lessons/[lessonId]`. Content is validated by a strict vitest contract (visual + interactive + quiz + experiment/project per lesson). Progress persists in a new `module_progress` table via the existing action-based progress API.

**Tech Stack:** Next.js 15 App Router (RSC), TypeScript, vitest, Turso/better-sqlite3 via `@bhavya/database`, design tokens from `@bhavya/platform-ui`, Web Speech API for audio widgets.

**Spec:** `docs/superpowers/specs/2026-09-26-foundation-v2-design.md` (§3 standards basis, §4 content architecture, §5.3 routes, §7 phases P4/P5). Read it before starting.

## Global Constraints

- **D1:** zero impact/statistics numbers on any surface. Structural counts (levels/modules/lessons) ONLY in curriculum navigation UI, computed from data, never hardcoded. Registered claims for displayed values (`src/lib/claims.ts`).
- **D2/D3:** 74 catalog + 12 Junior = 86 total (computed). Bands: Junior A `6-8`, Junior B `9-11`, Core (L0–L6) `12-15`, Advanced (L7–L12) `advanced` ("15+, mentor-led" — labeled honestly).
- **D9 route decision (final):** hub `/curriculum`; level `/curriculum/levels/[level]` where `[level]` ∈ `0`–`12` | `jr-a` | `jr-b`; module `/curriculum/levels/[level]/[module]` where module id ∈ `l{X}-m{Y}` | `jr-{a|b}-{n}`; lesson `/curriculum/levels/[level]/[module]/lessons/[lessonId]` where lesson id ∈ `{moduleId}-l{n}`. Extends the existing live tree; no redirects broken.
- **Rule 16 (hardware):** local = `npx tsc --noEmit -p apps/ai-institute/tsconfig.json`, `npx eslint <paths>`, `pnpm --filter @bhavya/ai-institute exec vitest run <path>`, `pnpm tokens:check`, `pnpm antislop`, `pnpm file-map`, git. NEVER local `pnpm build` / full monorepo test. Visual verification only on the deployed URL.
- **Commits:** conventional commits; commit body lines ≤ 100 chars (commitlint). Never stage: `opencode.json`, `packages/database/data/bhavya.db`, `.playwright-mcp/`, root `*.png`, `qa-screenshots/`.
- **Gates after every task:** tsc clean, eslint 0 errors on changed files, targeted vitest green. Phase end: `pnpm tokens:check`, `pnpm antislop`, `pnpm file-map && pnpm file-map:check`, full `pnpm --filter @bhavya/ai-institute exec vitest run`.
- Vitest quirk: trailing `ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL … vitest not found` after tests actually ran — judge by test output, ignore the trailing error.
- **Tokens only** in any SVG/CSS: `var(--color-viz-*)`, `var(--color-accent-gold)`, `var(--color-forest-*)`, `var(--font-display)`, `var(--space-*)` etc. No hardcoded hex outside `token`-less system colors is allowed — `pnpm tokens:check` gates it.
- No new runtime dependencies in Plan B (Web Speech is browser-native).

---

## PART 1 — P4: Navigability

### Task 1: Curriculum types + catalog generator

**Files:**

- Create: `apps/ai-institute/src/data/curriculum/types.ts`
- Create: `apps/ai-institute/src/scripts/generate-curriculum.mjs`
- Create: `apps/ai-institute/src/data/curriculum/catalog.generated.ts` (generator output, checked in, never hand-edited)
- Test: `apps/ai-institute/src/data/curriculum/__tests__/catalog.test.ts`
- Modify: `apps/ai-institute/package.json` (add `curriculum:generate` script)

**Interfaces:**

- Produces: `AgeBand`, `CurriculumModule`, `CatalogModule`, `CATALOG_MODULES`, `type LevelParam = "0"… "12" | "jr-a" | "jr-b"`.

- [ ] **Step 1: Write the failing test**

```ts
// apps/ai-institute/src/data/curriculum/__tests__/catalog.test.ts
import { describe, it, expect } from "vitest";
import { CATALOG_MODULES } from "../catalog.generated";

describe("catalog generator output", () => {
  it("has exactly 74 modules", () => {
    expect(CATALOG_MODULES.length).toBe(74);
  });
  it("has unique ids in lX-mY format", () => {
    const ids = CATALOG_MODULES.map((m) => m.id);
    expect(new Set(ids).size).toBe(74);
    for (const id of ids) expect(id).toMatch(/^l\d+-m\d+$/);
  });
  it("covers L0 with 2 modules and L1–L12 with 6 each", () => {
    const byLevel = new Map<number, number>();
    for (const m of CATALOG_MODULES)
      byLevel.set(m.level, (byLevel.get(m.level) ?? 0) + 1);
    expect(byLevel.get(0)).toBe(2);
    for (let l = 1; l <= 12; l++) expect(byLevel.get(l)).toBe(6);
  });
  it("every module has title, mission, objectives, duration, hands-on %", () => {
    for (const m of CATALOG_MODULES) {
      expect(m.title.length).toBeGreaterThan(0);
      expect(m.mission.length).toBeGreaterThan(0);
      expect(m.objectives.length).toBeGreaterThan(0);
      expect(m.duration.length).toBeGreaterThan(0);
      expect(m.handsOnPercent).toBeGreaterThan(0);
    }
  });
  it("does not expose industry-relevance / mission-alignment numbers", () => {
    const keys = Object.keys(CATALOG_MODULES[0]).sort();
    expect(keys).not.toContain("industryRelevance");
    expect(keys).not.toContain("missionAlignment");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @bhavya/ai-institute exec vitest run src/data/curriculum/__tests__/catalog.test.ts`
Expected: FAIL — cannot resolve `../catalog.generated`.

- [ ] **Step 3: Write types**

```ts
// apps/ai-institute/src/data/curriculum/types.ts
export type AgeBand = "6-8" | "9-11" | "12-15" | "advanced";
export type LevelParam = "jr-a" | "jr-b" | `${number}`;

export interface CatalogModule {
  id: string;
  level: number;
  moduleNumber: number;
  title: string;
  mission: string;
  objectives: string[];
  prerequisites: string[];
  difficulty: string;
  duration: string;
  handsOnPercent: number;
  projects: string[];
  labs: string[];
}

export interface Standards {
  bigIdeas: Array<"BI1" | "BI2" | "BI3" | "BI4" | "BI5">;
  csta?: string[];
  cnDim: "认知" | "技能" | "思维" | "价值观";
  cnStage: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  feedback: { correct: string; incorrect: string };
}

export type DiagramSpec =
  | { kind: "flow" | "pipeline"; title: string; steps: string[] }
  | { kind: "cycle"; title: string; steps: string[] }
  | {
      kind: "timeline";
      title: string;
      points: Array<{ label: string; note?: string }>;
    }
  | {
      kind: "compare";
      title: string;
      left: { label: string; items: string[] };
      right: { label: string; items: string[] };
    }
  | {
      kind: "network";
      title: string;
      nodes: string[];
      edges: Array<[string, string]>;
    }
  | {
      kind: "labeled-photo";
      title: string;
      src: string;
      labels: Array<{ x: number; y: number; text: string }>;
    }
  | {
      kind: "bar-chart";
      title: string;
      bars: Array<{ label: string; value: number }>;
    };

export type WidgetSpec =
  | { id: "tap-match"; config: { pairs: Array<{ a: string; b: string }> } }
  | {
      id: "sort-basket";
      config: {
        prompt: string;
        categories: string[];
        items: Array<{ text: string; category: string }>;
      };
    }
  | {
      id: "predict-reveal";
      config: {
        prompt: string;
        options?: string[];
        answer: string;
        reveal: string;
      };
    }
  | {
      id: "story-scene";
      config: {
        scenes: Array<{ narration: string; highlight?: string }>;
        speak?: boolean;
        autoPlay?: boolean;
      };
    }
  | {
      id: "sim-controls";
      config: {
        preset:
          "perceptron-step" | "knn-1d" | "overfit-poly" | "bar-perception";
        prompt: string;
      };
    }
  | {
      id: "investigate";
      config: {
        prompt: string;
        mode: "flag" | "answer";
        dataset: string[];
        items: Array<{ text: string; correct: boolean | string }>;
      };
    }
  | { id: "tokenize-explorer"; config: { initialText?: string } }
  | { id: "attention-play"; config: { query?: string; context?: string } };

export interface ExperimentBlock {
  kind: "experiment";
  title: string;
  materials: string[];
  steps: string[];
  safety?: string;
}
export interface ProjectBlock {
  kind: "project";
  brief: string;
  steps: string[];
  deliverable: string;
}

export type LessonBlock =
  | { kind: "visual"; diagram: DiagramSpec }
  | { kind: "prose"; text: string }
  | { kind: "interactive"; widget: WidgetSpec }
  | { kind: "quiz"; questions: QuizQuestion[] }
  | ExperimentBlock
  | ProjectBlock;

export interface Lesson {
  id: string;
  moduleId: string;
  band: AgeBand;
  title: string;
  durationMin: number;
  blocks: LessonBlock[];
}

export interface CurriculumModule {
  id: string;
  level: LevelParam;
  title: string;
  mission: string;
  objectives: string[];
  ageBand: AgeBand;
  duration: string;
  handsOnPercent: number;
  projects: string[];
  labs: string[];
  prerequisites: string[];
  difficulty: string;
  mentorLed?: boolean;
}
```

- [ ] **Step 4: Write the generator**

```js
// apps/ai-institute/src/scripts/generate-curriculum.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, "..", "..");
const mdPath = join(
  appRoot,
  "..",
  "..",
  "docs",
  "master-curriculum",
  "MODULE_CATALOG.md",
);
const outPath = join(
  appRoot,
  "src",
  "data",
  "curriculum",
  "catalog.generated.ts",
);

const ARRAY_FIELDS = new Set([
  "Learning Objectives",
  "Prerequisites",
  "Projects",
  "Labs",
]);
const SCALAR_FIELDS = new Map([
  ["Mission", "mission"],
  ["Difficulty", "difficulty"],
  ["Duration", "duration"],
  ["Competencies", "_competencies"],
  ["Knowledge Packages", "_kp"],
  ["Portfolio Evidence", "_portfolio"],
]);

const md = readFileSync(mdPath, "utf8");
const modules = [];
let current = null;
let field = null;

for (const raw of md.split(/\r?\n/)) {
  const mod = /^### Module (\d+)\.(\d+): (.+)$/.exec(raw);
  if (mod) {
    if (current) modules.push(current);
    const level = Number(mod[1]);
    const moduleNumber = Number(mod[2]);
    current = {
      id: `l${level}-m${moduleNumber}`,
      level,
      moduleNumber,
      title: mod[3].trim(),
      mission: "",
      objectives: [],
      prerequisites: [],
      difficulty: "",
      duration: "",
      handsOnPercent: 0,
      projects: [],
      labs: [],
    };
    field = null;
    continue;
  }
  if (/^## Level /.test(raw)) {
    field = null;
    continue;
  }
  if (!current) continue;
  const fh = /^\*\*(.+?):\*\*\s*(.*)$/.exec(raw);
  if (fh) {
    const name = fh[1].trim();
    const value = fh[2].trim();
    if (name === "Hands-on") {
      const pct = /(\d+)\s*%/.exec(value);
      current.handsOnPercent = pct ? Number(pct[1]) : 0;
      field = null;
    } else if (ARRAY_FIELDS.has(name)) {
      field = name;
      if (value) current[arrayKey(name)].push(value);
    } else if (SCALAR_FIELDS.has(name)) {
      const key = SCALAR_FIELDS.get(name);
      if (!key.startsWith("_")) current[key] = value;
      field = null;
    } else {
      field = null;
    }
    continue;
  }
  const bullet = /^-\s+(.+)$/.exec(raw);
  if (bullet && field && ARRAY_FIELDS.has(field)) {
    current[arrayKey(field)].push(bullet[1].trim());
  }
}

function arrayKey(name) {
  return name === "Learning Objectives"
    ? "objectives"
    : name === "Prerequisites"
      ? "prerequisites"
      : name === "Projects"
        ? "projects"
        : "labs";
}

if (current) modules.push(current);

const body = JSON.stringify(modules, null, 2);
const out = `// GENERATED by src/scripts/generate-curriculum.mjs — do not hand-edit.
// Source of truth: docs/master-curriculum/MODULE_CATALOG.md
import type { CatalogModule } from "./types";

export const CATALOG_MODULES: CatalogModule[] = ${body};
`;
writeFileSync(outPath, out);
console.log(`Wrote ${modules.length} modules -> ${outPath}`);
if (modules.length !== 74) {
  console.error(`Expected 74 modules, got ${modules.length}`);
  process.exit(1);
}
```

Add to `apps/ai-institute/package.json` scripts: `"curriculum:generate": "node src/scripts/generate-curriculum.mjs"`.

- [ ] **Step 5: Run generator, then test passes**

Run: `pnpm --filter @bhavya/ai-institute curriculum:generate` then `pnpm --filter @bhavya/ai-institute exec vitest run src/data/curriculum/__tests__/catalog.test.ts`
Expected: generator prints `Wrote 74 modules`; test PASS. If counts ≠ 74, fix parser (inspect MD field variance with `Select-String -Path docs\master-curriculum\MODULE_CATALOG.md -Pattern '\*\*' | Select-Object -First 40`).

- [ ] **Step 6: tsc + eslint + commit**

Run: `npx tsc --noEmit -p apps/ai-institute/tsconfig.json` → clean; `npx eslint apps/ai-institute/src/data/curriculum apps/ai-institute/src/scripts/generate-curriculum.mjs` → 0 errors.
`git add -A apps/ai-institute/src/data/curriculum apps/ai-institute/src/scripts/generate-curriculum.mjs apps/ai-institute/package.json pnpm-lock.yaml`
`git commit -m "feat(curriculum): catalog generator + typed registry (74 modules)"`

### Task 2: Junior registry (12 new modules, ages 6–11)

**Files:**

- Create: `apps/ai-institute/src/data/curriculum/junior.ts`
- Test: `apps/ai-institute/src/data/curriculum/__tests__/junior.test.ts`

**Interfaces:**

- Produces: `JUNIOR_MODULES: CurriculumModule[]` (12 entries; no `lessons` — lessons live in Task 13 files).

- [ ] **Step 1: Failing test**

```ts
// junior.test.ts
import { describe, it, expect } from "vitest";
import { JUNIOR_MODULES } from "../junior";

describe("junior registry (spec D2)", () => {
  it("has exactly 12 modules: 6 junior-a + 6 junior-b", () => {
    expect(JUNIOR_MODULES.length).toBe(12);
    expect(JUNIOR_MODULES.filter((m) => m.level === "jr-a").length).toBe(6);
    expect(JUNIOR_MODULES.filter((m) => m.level === "jr-b").length).toBe(6);
  });
  it("ids follow jr-{a|b}-{n} and bands match spec D3", () => {
    for (const m of JUNIOR_MODULES) {
      expect(m.id).toMatch(/^jr-[ab]-\d$/);
      if (m.level === "jr-a") expect(m.ageBand).toBe("6-8");
      else expect(m.ageBand).toBe("9-11");
    }
  });
  it("has the exact 12 titles from spec §4.1", () => {
    const titles = JUNIOR_MODULES.map((m) => m.title);
    expect(titles).toEqual([
      "AI Around Me",
      "Smart Machines",
      "Human vs Machine",
      "Data Detectives",
      "Friendly Robots",
      "Kind Digital Citizen",
      "How Machines Learn",
      "Patterns & Predictions",
      "Sensors & Perception",
      "Talking with Machines",
      "Our AI Rules",
      "Mini Project: Build a Rule-Bot",
    ]);
  });
});
```

- [ ] **Step 2: Run → FAIL (module missing)**

- [ ] **Step 3: Write `junior.ts`** — 12 `CurriculumModule` entries. Each: `level` (`"jr-a"`/`"jr-b"`), `ageBand`, `title` (exact above, in order), `mission` (one honest sentence, e.g. AI Around Me: "Notice the smart tools around you and name what they do."), `objectives` (4 bullets), `duration` ("6 weeks"), `handsOnPercent` (90 for jr-a, 85 for jr-b), `projects`/`labs` (1 each, age-appropriate), `prerequisites` ([] for jr-a-1; earlier module ids otherwise), `difficulty` ("Beginner"). Use `import type { CurriculumModule } from "./types";` and `export const JUNIOR_MODULES: CurriculumModule[] = [ … ];`.

- [ ] **Step 4: Run → PASS; tsc; commit**

`git commit -m "feat(curriculum): junior registry — 12 modules for ages 6-11"`

### Task 3: Data layer index, tracks, params, claims

**Files:**

- Create: `apps/ai-institute/src/data/curriculum/index.ts`
- Create: `apps/ai-institute/src/data/curriculum/__tests__/registry.test.ts`
- Modify: `apps/ai-institute/src/lib/claims.ts`

**Interfaces:**

- Produces: `getAllModules()`, `getModulesByLevel(level: LevelParam)`, `getModule(level, id)`, `isLevelParam(s)`, `TRACKS`, `getTotalModules()`, `getTrackCount(trackId)`, `levelParams()`, `moduleParams()`, `getAgeBandForLevel(level)`.
- Consumes: `CATALOG_MODULES`, `JUNIOR_MODULES`.

- [ ] **Step 1: Failing test**

```ts
// registry.test.ts
import { describe, it, expect } from "vitest";
import {
  getAllModules,
  getTotalModules,
  TRACKS,
  getTrackCount,
  levelParams,
  moduleParams,
  isLevelParam,
  getModule,
} from "../index";

describe("curriculum registry", () => {
  it("totals 86 computed modules (D2)", () => {
    expect(getTotalModules()).toBe(86);
    expect(getAllModules().length).toBe(86);
  });
  it("track counts are 6 / 6 / 38 / 36", () => {
    expect(getTrackCount("jr-a")).toBe(6);
    expect(getTrackCount("jr-b")).toBe(6);
    expect(getTrackCount("core")).toBe(38);
    expect(getTrackCount("advanced")).toBe(36);
    expect(TRACKS.length).toBe(4);
  });
  it("exposes 15 level params and 86 module params for routes", () => {
    expect(levelParams().length).toBe(15);
    expect(moduleParams().length).toBe(86);
    expect(levelParams()).toContain("jr-a");
    expect(isLevelParam("jr-b")).toBe(true);
    expect(isLevelParam("banana")).toBe(false);
  });
  it("resolves a module by level + id", () => {
    expect(getModule("3", "l3-m2")?.level).toBe("3");
    expect(getModule("jr-a", "jr-a-1")?.ageBand).toBe("6-8");
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Write `index.ts`**

```ts
import { CATALOG_MODULES } from "./catalog.generated";
import { JUNIOR_MODULES } from "./junior";
import type { AgeBand, CurriculumModule, LevelParam } from "./types";

export * from "./types";

const CORE_LEVELS = [0, 1, 2, 3, 4, 5, 6];
const ADV_LEVELS = [7, 8, 9, 10, 11, 12];

export function getAgeBandForLevel(level: number): AgeBand {
  return level >= 7 ? "advanced" : "12-15";
}

function toCurriculumModules(): CurriculumModule[] {
  return [
    ...CATALOG_MODULES.map((m) => ({
      id: m.id,
      level: String(m.level) as LevelParam,
      title: m.title,
      mission: m.mission,
      objectives: m.objectives,
      ageBand: getAgeBandForLevel(m.level),
      duration: m.duration,
      handsOnPercent: m.handsOnPercent,
      projects: m.projects,
      labs: m.labs,
      prerequisites: m.prerequisites,
      difficulty: m.difficulty,
      mentorLed: m.level >= 7 ? true : undefined,
    })),
    ...JUNIOR_MODULES,
  ];
}

const MODULES: CurriculumModule[] = toCurriculumModules();

export function getAllModules(): CurriculumModule[] {
  return MODULES;
}
export function getTotalModules(): number {
  return MODULES.length;
}

export function isLevelParam(s: string): s is LevelParam {
  return (
    s === "jr-a" ||
    s === "jr-b" ||
    (/^\d+$/.test(s) && Number(s) >= 0 && Number(s) <= 12)
  );
}

export function getModulesByLevel(level: LevelParam): CurriculumModule[] {
  return MODULES.filter((m) => m.level === level);
}

export function getModule(
  level: string,
  id: string,
): CurriculumModule | undefined {
  if (!isLevelParam(level)) return undefined;
  return MODULES.find((m) => m.level === level && m.id === id);
}

export const TRACKS = [
  {
    id: "jr-a",
    label: "Junior A — Sprouts",
    bandLabel: "Ages 6–8",
    levels: ["jr-a"] as LevelParam[],
  },
  {
    id: "jr-b",
    label: "Junior B — Explorers",
    bandLabel: "Ages 9–11",
    levels: ["jr-b"] as LevelParam[],
  },
  {
    id: "core",
    label: "Core",
    bandLabel: "Ages 12–15",
    levels: CORE_LEVELS.map(String) as LevelParam[],
  },
  {
    id: "advanced",
    label: "Advanced",
    bandLabel: "Ages 15+, mentor-led",
    levels: ADV_LEVELS.map(String) as LevelParam[],
  },
] as const;

export type TrackId = (typeof TRACKS)[number]["id"];

export function getTrackCount(trackId: TrackId): number {
  const t = TRACKS.find((x) => x.id === trackId)!;
  return t.levels.reduce((n, l) => n + getModulesByLevel(l).length, 0);
}

export function levelParams(): string[] {
  return ["jr-a", "jr-b", ...CORE_LEVELS, ...ADV_LEVELS].map(String);
}

export function moduleParams(): Array<{ level: string; module: string }> {
  return MODULES.map((m) => ({ level: m.level, module: m.id }));
}
```

- [ ] **Step 4: Update claims** — in `src/lib/claims.ts`, change the `curriculum-modules` entry to `value: "86 modules"`, `source: "docs/master-curriculum/MODULE_CATALOG.md (74) + src/data/curriculum/junior.ts (12); computed via getTotalModules()"`, `checked: "2026-09-26"`. Check `src/lib/__tests__/claims.test.ts` — update any expectation of "74 modules" to "86 modules".

- [ ] **Step 5: Run registry + claims + no-fake-numbers tests → PASS; tsc; commit**

`git commit -m "feat(curriculum): data layer — tracks, params, 86 computed modules"`

### Task 4: Hub rebuild — 4 track cards + level index

**Files:**

- Modify: `apps/ai-institute/src/app/curriculum/page.tsx`

**Interfaces:**

- Consumes: `TRACKS`, `getTrackCount`, `getTotalModules`, `levelParams`, `getModulesByLevel`.

- [ ] **Step 1: Read the current page**, keep the existing journey-stages section and page chrome (`<Section>`/`PageHero` usage) exactly as-is. Replace the 13 `curriculum-tier` level-card grid with:

```tsx
<div className="curriculum-tier-grid">
  {TRACKS.map((t) => (
    <a
      key={t.id}
      className="curriculum-tier"
      href={t.levels.length === 1 ? `/curriculum/levels/${t.levels[0]}` : `/curriculum#levels`}
    >
      <span className="curriculum-tier-band">{t.bandLabel}</span>
      <h3>{t.label}</h3>
      <p>
        {getTrackCount(t.id)} modules · {t.levels.length}{" "}
        {t.levels.length === 1 ? "level" : "levels"}
      </p>
      <span className="curriculum-tier-cta">Explore →</span>
    </a>
  ))}
</div>
<h2 id="levels">All levels</h2>
<div className="curriculum-tier-grid">
  {levelParams().map((l) => (
    <a key={l} className="curriculum-tier" href={`/curriculum/levels/${l}`}>
      <span className="curriculum-tier-band">
        {l === "jr-a" ? "Ages 6–8" : l === "jr-b" ? "Ages 9–11"
          : Number(l) >= 7 ? "Advanced · 15+" : "Ages 12–15"}
      </span>
      <h3>{l === "jr-a" ? "Junior A" : l === "jr-b" ? "Junior B" : `Level ${l}`}</h3>
      <p>{getModulesByLevel(l as never).length} modules</p>
      <span className="curriculum-tier-cta">Open →</span>
    </a>
  ))}
</div>
```

Add a computed, honest kicker near the top (curriculum navigation UI — D1 allowed): `<p>{getTotalModules()} modules across 4 learning tracks</p>`.

- [ ] **Step 2: tsc; eslint; run full vitest** (no-fake-numbers must pass — `86 modules` matches `isApprovedNumber` regex `\d+ (levels|modules|lessons)`).
- [ ] **Step 3: Commit** — `git commit -m "feat(curriculum): hub — 4 track cards + full level index (computed)"`

### Task 5: Level page — junior params + module cards

**Files:**

- Modify: `apps/ai-institute/src/app/curriculum/levels/[level]/page.tsx`
- Modify: `apps/ai-institute/src/app/curriculum/levels/page.tsx` (ensure junior levels listed)

**Interfaces:**

- Consumes: `isLevelParam`, `levelParams`, `getModulesByLevel`, `getTrackCount`.

- [ ] **Step 1: Rewrite param handling** in `levels/[level]/page.tsx`:

```tsx
export function generateStaticParams() {
  return levelParams().map((level) => ({ level }));
}
export async function generateMetadata({ params }: Props) {
  const { level } = await params;
  const title =
    level === "jr-a"
      ? "Junior A"
      : level === "jr-b"
        ? "Junior B"
        : `Level ${level}`;
  return { title: `${title} — Curriculum — Bhavya Foundation` };
}
export default async function LevelPage({ params }: Props) {
  const { level } = await params;
  if (!isLevelParam(level)) notFound();
  const modules = getModulesByLevel(level);
  const isAdvanced = /^\d+$/.test(level) && Number(level) >= 7;
  // render header (title + computed "{modules.length} modules" + band chip),
  // an honest banner when isAdvanced:
  //   "Advanced track — designed for ages 15+ and mentor-led learners."
  // then a module-card grid:
  //   {modules.map((m) => (
  //     <a key={m.id} href={`/curriculum/levels/${level}/${m.id}`} className="curriculum-tier">
  //       <span className="curriculum-tier-band">{m.ageBand === "advanced" ? "Advanced" : `Ages ${m.ageBand}`}</span>
  //       <h3>{m.title}</h3>
  //       <p>{m.mission}</p>
  //       <p>{m.duration} · {m.handsOnPercent}% hands-on</p>
  //     </a>
  //   ))}
}
```

Preserve the page's existing chrome/Section wrappers. Replace the old `Number(levelStr)` + `notFound()` logic (today `jr-a` would 404).

- [ ] **Step 2: `levels/page.tsx`** — ensure its list renders all `levelParams()` including juniors (edit its data source to `levelParams()` if it currently hardcodes 0–12).
- [ ] **Step 3: tsc; eslint; commit** — `git commit -m "feat(curriculum): level route supports jr-a/jr-b + module cards"`

### Task 6: Module detail page

**Files:**

- Create: `apps/ai-institute/src/app/curriculum/levels/[level]/[module]/page.tsx`
- Create: `apps/ai-institute/src/lib/curriculum/lessons.ts` (lesson lookup — thin re-export layer; Task 13 fills the registry, Task 6 gets an empty-safe version)

**Interfaces:**

- Consumes: `moduleParams`, `getModule`, `getLessons` (Task 13; Task 6 defines it returning `[]` when registry empty).
- Produces: route `/curriculum/levels/[level]/[module]`.

- [ ] **Step 1: Lesson lookup layer** `src/lib/curriculum/lessons.ts` (Task 13 replaces the body with the real registry — write the final version now with an empty registry placeholder that Task 13 overwrites):

```ts
import type { Lesson } from "@/data/curriculum";

// Registry filled by src/data/curriculum/lessons/index.ts (P5 content task).
// Kept behind this module so pages have one import path.
export {
  getLessons,
  getLesson,
  getAllCurriculumLessonIds,
} from "@/data/curriculum/lessons/index";
export type { Lesson };
```

(Task 13 must therefore create `src/data/curriculum/lessons/index.ts` exporting those three functions — Task 6 pages import through `@/lib/curriculum/lessons`.)

- [ ] **Step 2: Module page**

```tsx
import { notFound } from "next/navigation";
import { getModule, moduleParams, isLevelParam } from "@/data/curriculum";
import { getLessons } from "@/lib/curriculum/lessons";

type Props = { params: Promise<{ level: string; module: string }> };

export function generateStaticParams() {
  return moduleParams().map((m) => ({ level: m.level, module: m.module }));
}
export async function generateMetadata({ params }: Props) {
  const { level, module: id } = await params;
  const mod = getModule(level, id);
  return {
    title: mod ? `${mod.title} — Curriculum — Bhavya Foundation` : "Module",
  };
}
export default async function ModulePage({ params }: Props) {
  const { level, module: id } = await params;
  if (!isLevelParam(level)) notFound();
  const mod = getModule(level, id);
  if (!mod) notFound();
  const lessons = getLessons(mod.id);
  return (
    <main
      id="main-content"
      className="container"
      style={{ paddingBlock: "var(--space-16)" }}
    >
      <nav aria-label="Breadcrumb">
        <a href="/curriculum">Curriculum</a> /{" "}
        <a href={`/curriculum/levels/${level}`}>Level {level}</a> / {mod.title}
      </nav>
      <span className="curriculum-tier-band">
        {mod.ageBand === "advanced"
          ? "Advanced · mentor-led"
          : `Ages ${mod.ageBand}`}
      </span>
      <h1>{mod.title}</h1>
      <p>{mod.mission}</p>
      <h2>Learning objectives</h2>
      <ul>
        {mod.objectives.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
      <h2>Format</h2>
      <p>
        {mod.duration} · {mod.handsOnPercent}% hands-on
      </p>
      {mod.projects.length > 0 && (
        <>
          <h2>Projects</h2>
          <ul>
            {mod.projects.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </>
      )}
      {mod.labs.length > 0 && (
        <>
          <h2>Labs</h2>
          <ul>
            {mod.labs.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </>
      )}
      <h2>Lessons</h2>
      {lessons.length === 0 ? (
        <p>Lessons for this module are being prepared.</p>
      ) : (
        <ol>
          {lessons.map((l) => (
            <li key={l.id}>
              <a href={`/curriculum/levels/${level}/${mod.id}/lessons/${l.id}`}>
                {l.title}
              </a>
              <span> — {l.durationMin} min</span>
            </li>
          ))}
        </ol>
      )}
      <p>
        A certificate of completion is available once every lesson is complete
        and the module check scores 80% or higher.
      </p>
    </main>
  );
}
```

Standards chips + module quiz + certificate claim UI arrive in Tasks 7/14/Plan C — do not stub them here.

- [ ] **Step 3: tsc; eslint; commit** — `git commit -m "feat(curriculum): module detail route for all 86 modules"`

### Task 7: Standards tagging data

**Files:**

- Create: `apps/ai-institute/src/data/curriculum/standards.ts`
- Test: `apps/ai-institute/src/data/curriculum/__tests__/standards.test.ts`

**Interfaces:**

- Produces: `getStandards(moduleId: string): Standards` (throws on missing — every module must be tagged).

- [ ] **Step 1: Failing test** — every id from `getAllModules()` has standards; `bigIdeas.length ≥ 1`; `cnStage` in 1–6; `cnDim` ∈ the four dims; `csta` codes (when present) match `/^3[AB]-[A-Z]{2}-\d{2}$/` or `/^2-AP-\d{2}$/` or `/^1A-AP-\d{2}$/`.

- [ ] **Step 2: Author `standards.ts`** — a `Record<string, Standards>` covering all 86 ids. Tagging rules (from spec §3):

```ts
const BAND_STAGE: Record<string, 1 | 2 | 3 | 4> = {
  "6-8": 1, // China 学段 1 (grades 1–2) — playful awareness
  "9-11": 2, // 学段 2 (grades 3–4)
  "12-15": 4, // 学段 4 (grades 7–9)
};
// Advanced (ageBand "advanced"): cnStage 4, plus honest note in UI later.
// cnDim by module theme: ethics/citizenship/rules → 价值观; build/make → 技能;
// analysis/data/models → 思维; intro/what-is → 认知.
// bigIdeas by theme: perception/sensors → BI1; data/models/reasoning → BI2+BI3;
// interaction/talking/chatbots → BI4; ethics/society/impact → BI5.
// csta: ONLY codes verified against the CSTA 2017 list you know are real
// (examples of safe codes: 2-AP-10, 2-AP-13, 2-AP-17, 3A-AP-08, 3A-AP-13,
// 3A-IC-25, 3A-DA-11, 3B-AP-09, 3B-IC-25). Omit csta when unsure — omission
// beats invention (content-truth).
```

Author the full record (86 entries) following those rules — this is deliberate hand-tagging, not generation.

- [ ] **Step 3: Run test → PASS; tsc; commit** — `git commit -m "feat(curriculum): standards tags — AI4K12 big ideas + CSTA + China dims"`

### Task 8: Ship P4

- [ ] Full gates: tsc, eslint (`npx eslint apps/ai-institute/src`), full vitest, `pnpm tokens:check`, `pnpm antislop`, `pnpm file-map && pnpm file-map:check`, `git diff --check`.
- [ ] Add sitemap + academy fixes + route map (they belong to navigability — do them now):

**Sitemap** (`src/app/sitemap.ts`): add `"/curriculum"`, `"/curriculum/levels"` to `STATIC_ROUTES`; append:

```ts
import { levelParams, moduleParams } from "@/data/curriculum";
const curriculumRoutes = [
  ...levelParams().map((l) => `/curriculum/levels/${l}`),
  ...moduleParams().map((m) => `/curriculum/levels/${m.level}/${m.module}`),
].map((path) => ({ url: BASE + path, lastModified: new Date() }));
// include: return [...staticRoutes, ...courseRoutes, ...curriculumRoutes]
```

**Academy dead-ends:**

- `src/app/knowledge/academy/page.tsx` → rewrite as honest overview: what the academy is (2–3 sentences), two CTAs: "Explore the curriculum → /curriculum" and "Browse courses → /courses". No counts (not curriculum nav), no fake levels/courses.
- `src/app/knowledge/courses/page.tsx` → replace fake array page with `import { redirect } from "next/navigation"; export default function Page() { redirect("/courses"); }`.

**Route map** (`docs/architecture/CANONICAL_ROUTE_MAP.md`): add rows — Knowledge/curriculum table:

```markdown
| `/curriculum` | Curriculum hub (4 tracks) | Public | No | — |
| `/curriculum/levels/[level]` | Level module list (`0`–`12`, `jr-a`, `jr-b`) | Public | No | curriculum |
| `/curriculum/levels/[level]/[module]` | Module detail | Public | No | curriculum |
| `/knowledge/courses` | **Alias → `/courses`** (updated 2026-09-26) | — | — | — |
```

- [ ] Route audit (skill `bhavya-route-audit` checklist): grep all `href="` in `src/app` for `/curriculum` links; confirm hub → tracks → levels → all 86 modules reachable; confirm `/knowledge/academy` links resolve; confirm no remaining links to `/knowledge/courses` expecting content.
- [ ] Push → PR → CI 4/4 → merge → deploy → live check: hub renders track cards, `jr-a` level 200s, one module page 200s, sitemap contains module URLs. (Pipeline per D10; `git ls-remote` probe before push.)

---

## PART 2 — P5: Content, Widgets, Player, Progress

### Task 9: Diagram kit (declarative SVG, tokens only)

**Files:**

- Create: `apps/ai-institute/src/components/curriculum/diagram/DiagramRenderer.tsx`

**Interfaces:**

- Consumes: `DiagramSpec` (from Task 1 types).
- Produces: `export function DiagramRenderer({ spec }: { spec: DiagramSpec })` — server-renderable (no hooks).

- [ ] **Step 1: Write the renderer** (complete implementation):

```tsx
import type { DiagramSpec } from "@/data/curriculum";

const INK = "var(--color-text-primary)";
const MUTED = "var(--color-text-secondary)";
const LINE = "var(--color-viz-forest-border)";
const ACCENT = "var(--color-accent-gold)";
const NODE_BG = "var(--color-bg-elevated)";

const FONT: React.CSSProperties = { fontFamily: "var(--font-sans)", fill: INK };

function Chain({ steps, cyclic }: { steps: string[]; cyclic?: boolean }) {
  const w = 160,
    h = 72,
    gap = 64;
  const width =
    steps.length * w + (steps.length - 1) * gap + (cyclic ? gap : 0);
  return (
    <g>
      {steps.map((s, i) => {
        const x = i * (w + gap);
        return (
          <g key={s}>
            <rect
              x={x}
              y={40}
              width={w}
              height={h}
              rx={8}
              fill={NODE_BG}
              stroke={LINE}
            />
            <foreignObject x={x + 8} y={48} width={w - 16} height={h - 16}>
              <div style={{ ...FONT, fontSize: 13, textAlign: "center" }}>
                {s}
              </div>
            </foreignObject>
            {i < steps.length - 1 && (
              <line
                x1={x + w}
                y1={40 + h / 2}
                x2={x + w + gap - 8}
                y2={40 + h / 2}
                stroke={ACCENT}
                strokeWidth={2}
                markerEnd="url(#arrow)"
              />
            )}
            {cyclic && i === steps.length - 1 && (
              <path
                d={`M ${x + w / 2} 40 C ${x + w / 2} 0, ${steps.length * (w + gap) - w / 2} 0, ${steps.length * (w + gap) - w / 2} 40`}
                fill="none"
                stroke={ACCENT}
                strokeWidth={2}
                markerEnd="url(#arrow)"
              />
            )}
          </g>
        );
      })}
    </g>
  );
}

export function DiagramRenderer({ spec }: { spec: DiagramSpec }) {
  const titleId = `dg-${spec.title.replace(/\W+/g, "-").toLowerCase()}`;
  let body: React.ReactNode = null;
  let width = 800;
  switch (spec.kind) {
    case "flow":
    case "pipeline":
      width = spec.steps.length * 224;
      body = <Chain steps={spec.steps} />;
      break;
    case "cycle":
      width = spec.steps.length * 224;
      body = <Chain steps={spec.steps} cyclic />;
      break;
    case "timeline": {
      const step = 760 / Math.max(1, spec.points.length - 1 || 1);
      width = 800;
      body = (
        <g>
          <line
            x1={20}
            y1={90}
            x2={780}
            y2={90}
            stroke={LINE}
            strokeWidth={2}
          />
          {spec.points.map((p, i) => {
            const x = spec.points.length === 1 ? 400 : 20 + i * step;
            return (
              <g key={p.label}>
                <circle cx={x} cy={90} r={6} fill={ACCENT} />
                <foreignObject x={x - 70} y={100} width={140} height={80}>
                  <div style={{ ...FONT, fontSize: 12, textAlign: "center" }}>
                    <strong>{p.label}</strong>
                    {p.note && <div style={{ color: MUTED }}>{p.note}</div>}
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </g>
      );
      break;
    }
    case "compare":
      width = 800;
      body = (
        <g>
          {[spec.left, spec.right].map((col, i) => (
            <g key={col.label} transform={`translate(${i * 410},0)`}>
              <rect
                x={0}
                y={16}
                width={390}
                height={36 + col.items.length * 28}
                rx={8}
                fill={NODE_BG}
                stroke={LINE}
              />
              <foreignObject x={12} y={24} width={366} height={24}>
                <div style={{ ...FONT, fontWeight: 600 }}>{col.label}</div>
              </foreignObject>
              {col.items.map((it, j) => (
                <foreignObject
                  key={it}
                  x={12}
                  y={52 + j * 28}
                  width={366}
                  height={26}
                >
                  <div style={{ ...FONT, fontSize: 13 }}>• {it}</div>
                </foreignObject>
              ))}
            </g>
          ))}
        </g>
      );
      break;
    case "network": {
      const cols = Math.ceil(Math.sqrt(spec.nodes.length));
      width = 800;
      const pos = spec.nodes.map((n, i) => ({
        n,
        x: 80 + (i % cols) * (640 / Math.max(1, cols - 1 || 1)),
        y: 40 + Math.floor(i / cols) * 120,
      }));
      body = (
        <g>
          {spec.edges.map(([a, b]) => {
            const pa = pos.find((p) => p.n === a),
              pb = pos.find((p) => p.n === b);
            if (!pa || !pb) return null;
            return (
              <line
                key={`${a}-${b}`}
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                stroke={LINE}
                strokeWidth={2}
              />
            );
          })}
          {pos.map((p) => (
            <g key={p.n}>
              <circle
                cx={p.x}
                cy={p.y}
                r={34}
                fill={NODE_BG}
                stroke={ACCENT}
                strokeWidth={2}
              />
              <foreignObject x={p.x - 44} y={p.y - 14} width={88} height={28}>
                <div style={{ ...FONT, fontSize: 12, textAlign: "center" }}>
                  {p.n}
                </div>
              </foreignObject>
            </g>
          ))}
        </g>
      );
      break;
    }
    case "bar-chart": {
      const max = Math.max(...spec.bars.map((b) => b.value), 1);
      width = 800;
      body = (
        <g>
          {spec.bars.map((b, i) => (
            <g key={b.label}>
              <rect
                x={80}
                y={24 + i * 44}
                width={(b.value / max) * 620}
                height={26}
                fill={ACCENT}
                opacity={0.85}
                rx={4}
              />
              <foreignObject x={0} y={24 + i * 44} width={76} height={26}>
                <div style={{ ...FONT, fontSize: 12, textAlign: "right" }}>
                  {b.label}
                </div>
              </foreignObject>
            </g>
          ))}
        </g>
      );
      break;
    }
    case "labeled-photo":
      width = 800;
      body = (
        <g>
          <image
            href={spec.src}
            x={0}
            y={0}
            width={800}
            height={420}
            preserveAspectRatio="xMidYMid slice"
          />
          {spec.labels.map((l) => (
            <g key={l.text}>
              <circle
                cx={l.x * 8}
                cy={l.y * 4.2}
                r={5}
                fill={ACCENT}
                stroke="var(--color-bg-primary)"
              />
              <foreignObject
                x={l.x * 8 + 10}
                y={l.y * 4.2 - 12}
                width={180}
                height={24}
              >
                <div style={{ ...FONT, fontSize: 13 }}>{l.text}</div>
              </foreignObject>
            </g>
          ))}
        </g>
      );
      break;
  }
  return (
    <figure aria-label={spec.title} style={{ margin: 0 }}>
      <svg
        viewBox={`0 0 ${width} 220`}
        width="100%"
        role="img"
        aria-labelledby={titleId}
      >
        <title id={titleId}>{spec.title}</title>
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX={8}
            refY={5}
            markerWidth={6}
            markerHeight={6}
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={ACCENT} />
          </marker>
        </defs>
        {body}
      </svg>
      <figcaption
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-sm)",
          color: MUTED,
          marginTop: "var(--space-4)",
        }}
      >
        {spec.title}
      </figcaption>
    </figure>
  );
}
```

- [ ] **Step 2: tsc; eslint; commit** — `git commit -m "feat(curriculum): declarative diagram kit (8 kinds, tokens only)"`

### Task 10: Widget kit + registry

**Files:**

- Create: `apps/ai-institute/src/components/curriculum/widgets/{TapMatch,SortBasket,PredictReveal,StoryScene,SimControls,Investigate}.tsx`
- Create: `apps/ai-institute/src/components/curriculum/widgets/WidgetRenderer.tsx`

**Interfaces:**

- Consumes: `WidgetSpec` (Task 1). All widgets `"use client"`.
- Produces: `WidgetRenderer({ spec })` switch; `WIDGET_IDS` exported from `src/data/curriculum/lessons/widget-ids.ts`:

```ts
export const WIDGET_IDS = [
  "tap-match",
  "sort-basket",
  "predict-reveal",
  "story-scene",
  "sim-controls",
  "investigate",
  "tokenize-explorer",
  "attention-play",
] as const;
export type WidgetId = (typeof WIDGET_IDS)[number];
```

**Spec §4.3 mapping (documented deviation):** `listen-repeat` & `big-movie` → `story-scene` (`speak`/`autoPlay` config); `guided-sim`/`what-happens-next`/`plus-sample` → `predict-reveal` or `sim-controls`; `spot-the-bias`/`data-detective` → `investigate` (mode `flag`/`answer`); `perceptron-play`/`knn-lab`/`overfit-demo` → `sim-controls` presets. Deferred ids (never reference in content): `block-coding`, `train-a-classifier`, `agent-flow`, `research-sandbox`, `system-architect`. Record in completion report.

- [ ] **Step 1: Implement widgets** (complete; each `"use client"`, `useState`, token-only styling, reduced-motion respected by not auto-advancing when `matchMedia("(prefers-reduced-motion: reduce)").matches`):

**TapMatch** — props `{ pairs }`: render two shuffled columns; click a then b; correct pair → both fade to `var(--color-status-success)`; wrong → shake (CSS animation, disabled under reduced motion) + aria-live message.

**SortBasket** — props `{ prompt, categories, items }`: each item shows category buttons; colored feedback on submit; score message.

**PredictReveal** — props `{ prompt, options?, answer, reveal }`: pick option (or free-text when no options) → "Check" → shows `reveal` + correctness with the `feedback`-style explanation; state locked after check.

**StoryScene** — props `{ scenes, speak?, autoPlay? }`: step counter with Next/Back; when `speak && "speechSynthesis" in window` → `speechSynthesis.speak(new SpeechSynthesisUtterance(scene.narration))` on step change (cancel on unmount); `autoPlay` advances every 4s unless reduced-motion.

**SimControls** — props `{ preset, prompt }`: presets render small interactive SVGs:

- `perceptron-step`: a threshold slider (-5..5) classifies 6 fixed points, shows accuracy count of 6;
- `knn-1d`: slider picks k (1..5), 8 fixed points colored by majority among nearest k;
- `overfit-poly`: degree selector 1..6 over 10 noisy points, polyline path recomputed (precomputed coordinate arrays in-file);
- `bar-perception`: tap one of 6 tiles to add a bar to a tally (sensory counting).
  Implement each with inline coordinate data — no dependencies.

**Investigate** — props `{ prompt, mode, dataset, items }`: `mode: "flag"` → click suspicious lines; `mode: "answer"` → each item is a question with correct boolean/string; reveal correctness with explanation sentence per item.

**WidgetRenderer**:

```tsx
"use client";
import type { WidgetSpec } from "@/data/curriculum";
import { TapMatch } from "./TapMatch";
// …imports for each
export function WidgetRenderer({ spec }: { spec: WidgetSpec }) {
  switch (spec.id) {
    case "tap-match":
      return <TapMatch {...spec.config} />;
    case "sort-basket":
      return <SortBasket {...spec.config} />;
    case "predict-reveal":
      return <PredictReveal {...spec.config} />;
    case "story-scene":
      return <StoryScene {...spec.config} />;
    case "sim-controls":
      return <SimControls {...spec.config} />;
    case "investigate":
      return <Investigate {...spec.config} />;
    case "tokenize-explorer":
      return <TokenizerExplorer initialText={spec.config.initialText} />;
    case "attention-play":
      return (
        <AttentionSimulator
          query={spec.config.query}
          context={spec.config.context}
        />
      );
  }
}
```

`tokenize-explorer`/`attention-play` import from `packages/interactive-components` — first add workspace dep to `apps/ai-institute/package.json`: `"@bhavya/interactive-components": "workspace:*"` then `pnpm install`. Check a sibling workspace dep for the exact protocol (`Select-String -Path apps\ai-institute\package.json -Pattern workspace`) and match it. If the package's components fail typecheck under React 19, exclude those two cases from the renderer and from `WIDGET_IDS` (record as gap) — do not fork the package.

- [ ] **Step 2: tsc; eslint; commit** — `git commit -m "feat(curriculum): widget kit — 6 native + 2 package widgets"`

### Task 11: Block renderer + lesson player + module quiz

**Files:**

- Create: `apps/ai-institute/src/components/curriculum/blocks/BlockRenderer.tsx`
- Create: `apps/ai-institute/src/components/curriculum/QuizBlock.tsx` (client)
- Create: `apps/ai-institute/src/components/curriculum/ModuleQuiz.tsx` (client)
- Create: `apps/ai-institute/src/components/curriculum/StandardsFooter.tsx`
- Create: `apps/ai-institute/src/app/curriculum/levels/[level]/[module]/lessons/[lessonId]/page.tsx`
- Modify: `apps/ai-institute/src/app/curriculum/levels/[level]/[module]/page.tsx` (append quiz + standards)

**Interfaces:**

- Consumes: `getLesson`, `getLessons`, `getStandards`, `DiagramRenderer`, `WidgetRenderer`.
- Produces: lesson route; `ModuleQuiz` posts `{ action: "submitModuleQuiz", data: { moduleId, score } }`.

- [ ] **Step 1: BlockRenderer** (server component):

```tsx
import type { LessonBlock } from "@/data/curriculum";
import { DiagramRenderer } from "../diagram/DiagramRenderer";
import { WidgetRenderer } from "../widgets/WidgetRenderer";
import { QuizBlock } from "../QuizBlock";

export function BlockRenderer({
  blocks,
  moduleId,
}: {
  blocks: LessonBlock[];
  moduleId: string;
}) {
  return (
    <div className="lesson-blocks">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "visual":
            return <DiagramRenderer key={i} spec={b.diagram} />;
          case "prose":
            return (
              <p key={i} className="lesson-prose">
                {b.text}
              </p>
            );
          case "interactive":
            return <WidgetRenderer key={i} spec={b.widget} />;
          case "quiz":
            return (
              <QuizBlock key={i} questions={b.questions} moduleId={moduleId} />
            );
          case "experiment":
            return (
              <section key={i} className="lesson-card">
                <h3>Experiment — {b.title}</h3>
                <p>
                  <strong>Materials:</strong> {b.materials.join(", ")}
                </p>
                <ol>
                  {b.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                {b.safety && (
                  <p>
                    <strong>Safety:</strong> {b.safety}
                  </p>
                )}
              </section>
            );
          case "project":
            return (
              <section key={i} className="lesson-card">
                <h3>Project</h3>
                <p>{b.brief}</p>
                <ol>
                  {b.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <p>
                  <strong>Deliverable:</strong> {b.deliverable}
                </p>
              </section>
            );
        }
      })}
    </div>
  );
}
```

- [ ] **Step 2: QuizBlock** (client): renders radio options per question; on submit, per-question explanation shown (immediate, content-specific feedback); posts `{ action: "submitLessonQuiz", data: { moduleId, quizId, score } }` when all correct% computed — score = correct/total ×100. Uses `fetch("/api/student/progress", …)`; when 401, show "Sign in to save your progress" link `/login`.

- [ ] **Step 3: ModuleQuiz** (client): aggregates questions passed as props (page passes all quiz-block questions from the module's lessons with lesson prefixes on ids); computes score; posts `{ action: "submitModuleQuiz", data: { moduleId, score } }`; shows result + "certificate eligible" state message when score ≥ 80 (Plan C wires the claim button).

- [ ] **Step 4: StandardsFooter** (server): props `{ moduleId }` → `getStandards(moduleId)` → renders: AI4K12 big ideas chips (`BI1–BI5` with human labels: "BI1 Perception", "BI2 Representation & Reasoning", "BI3 Learning", "BI4 Natural Interaction", "BI5 Societal Impact"), CSTA codes (if present), China dimension + 学段 (`认知 · 学段 1` style).

- [ ] **Step 5: Lesson page**

```tsx
// …/lessons/[lessonId]/page.tsx
import { notFound } from "next/navigation";
import { getModule, isLevelParam } from "@/data/curriculum";
import { getLesson, getLessons } from "@/lib/curriculum/lessons";
import { BlockRenderer } from "@/components/curriculum/blocks/BlockRenderer";
import { StandardsFooter } from "@/components/curriculum/StandardsFooter";

export function generateStaticParams() {
  return moduleParams().flatMap(({ level, module: mod }) =>
    getLessons(mod).map((l) => ({ level, module: mod, lessonId: l.id })),
  );
}
export default async function LessonPage({ params }: Props) {
  const { level, module: mod, lessonId } = await params;
  if (!isLevelParam(level)) notFound();
  const moduleData = getModule(level, mod);
  if (!moduleData) notFound();
  const lesson = getLesson(mod, lessonId);
  if (!lesson) notFound();
  const all = getLessons(mod);
  const idx = all.findIndex((l) => l.id === lesson.id);
  const prev = all[idx - 1],
    next = all[idx + 1];
  const base = `/curriculum/levels/${level}/${mod}`;
  // render: breadcrumb, h1, "Lesson x of y", BlockRenderer,
  // prev/next <a> links, Sign-in prompt for progress,
  // <StandardsFooter moduleId={mod} />
}
```

- [ ] **Step 6: Append to module page** — `<StandardsFooter moduleId={mod} />` (import) and `<ModuleQuiz questions={aggregateQuizQuestions(mod)} moduleId={mod} />` where `aggregateQuizQuestions` collects `kind: "quiz"` questions across `getLessons(mod)` with ids prefixed `${lesson.id}:${q.id}` (define in `src/lib/curriculum/lessons.ts`). When `lessons.length === 0`, render neither (P4 state).

- [ ] **Step 7: tsc; eslint; commit** — `git commit -m "feat(curriculum): lesson player — block renderer, quiz, standards footer"`

### Task 12: Progress API + `module_progress` (migration 006)

**Files:**

- Create: `packages/database/migrations/ai-institute/006_module_progress.ts`
- Modify: `apps/ai-institute/src/lib/db.ts` (BASELINE_SCHEMA append)
- Create: `apps/ai-institute/src/lib/module-progress.ts`
- Modify: `apps/ai-institute/src/app/api/student/progress/route.ts`
- Test: `apps/ai-institute/src/lib/__tests__/module-progress.test.ts`

**Interfaces:**

- Produces (Plan C consumes): `isModuleComplete(row: ModuleProgressRow | null, lessonCount: number): boolean` (row.quiz_score ≥ 80 && lessons length ≥ lessonCount); `getModuleProgress(userId, moduleId): Promise<ModuleProgressRow | null>`; actions `completeCurriculumLesson`, `submitModuleQuiz`, `submitLessonQuiz`, `getModuleProgress` (as `action: "getModuleProgress"`) in the progress API; `curriculumLessonIds(): Set<string>`.

- [ ] **Step 1: Failing test**

```ts
// module-progress.test.ts — uses setup.ts (tmp sqlite, migrations applied)
import { describe, it, expect } from "vitest";
import { isModuleComplete } from "../module-progress";

describe("certificate completion rule (spec D6)", () => {
  it("requires all lessons and quiz >= 80", () => {
    const row = {
      lessons_completed: JSON.stringify(["a", "b"]),
      quiz_score: 80,
    } as never;
    expect(isModuleComplete(row, 2)).toBe(true);
    expect(isModuleComplete(row, 3)).toBe(false);
    expect(isModuleComplete({ ...row, quiz_score: 79 } as never, 2)).toBe(
      false,
    );
    expect(isModuleComplete(null, 1)).toBe(false);
  });
});
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Migration** `006_module_progress.ts`:

```ts
import type { Migration } from "../../src/migrate";
export const migration: Migration = {
  id: "006_module_progress",
  name: "module_progress",
  up: `
CREATE TABLE IF NOT EXISTS module_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  lessons_completed TEXT NOT NULL DEFAULT '[]',
  quiz_score INTEGER,
  completed_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, module_id)
);
CREATE INDEX IF NOT EXISTS idx_module_progress_user ON module_progress(user_id);
`,
  down: `DROP TABLE IF EXISTS module_progress;`,
};
```

Append the same `CREATE TABLE` (+ index) to `BASELINE_SCHEMA` in `src/lib/db.ts` (keep the "kept in sync with migrations" comment honest).

- [ ] **Step 4: `src/lib/module-progress.ts`**

```ts
import { randomUUID } from "node:crypto";
import { getAsyncDb } from "@/lib/db";
import { getLessons } from "@/data/curriculum/lessons/index";

export const CERT_QUIZ_THRESHOLD = 80;

export interface ModuleProgressRow {
  id: string;
  user_id: string;
  module_id: string;
  lessons_completed: string;
  quiz_score: number | null;
  completed_at: string | null;
  updated_at: string;
}

export async function getModuleProgress(userId: string, moduleId: string) {
  return getAsyncDb().get<ModuleProgressRow>(
    "SELECT * FROM module_progress WHERE user_id = ? AND module_id = ?",
    userId,
    moduleId,
  );
}

export function isModuleComplete(
  row: ModuleProgressRow | null,
  lessonCount: number,
): boolean {
  if (!row) return false;
  const done = JSON.parse(row.lessons_completed) as string[];
  return (
    row.quiz_score !== null &&
    row.quiz_score >= CERT_QUIZ_THRESHOLD &&
    lessonCount > 0 &&
    done.length >= lessonCount
  );
}

async function upsert(
  userId: string,
  moduleId: string,
  mutate: (row: ModuleProgressRow) => ModuleProgressRow,
) {
  const db = getAsyncDb();
  const existing = await getModuleProgress(userId, moduleId);
  const base: ModuleProgressRow = existing ?? {
    id: randomUUID(),
    user_id: userId,
    module_id: moduleId,
    lessons_completed: "[]",
    quiz_score: null,
    completed_at: null,
    updated_at: new Date().toISOString(),
  };
  const next = mutate(base);
  const lessonCount = getLessons(moduleId).length;
  const completed = isModuleComplete(next, lessonCount)
    ? new Date().toISOString()
    : null;
  await db.run(
    `INSERT INTO module_progress (id, user_id, module_id, lessons_completed, quiz_score, completed_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id, module_id) DO UPDATE SET
       lessons_completed = excluded.lessons_completed,
       quiz_score = excluded.quiz_score,
       completed_at = COALESCE(excluded.completed_at, module_progress.completed_at),
       updated_at = excluded.updated_at`,
    next.id,
    userId,
    moduleId,
    next.lessons_completed,
    next.quiz_score,
    completed,
    new Date().toISOString(),
  );
}

export async function recordCurriculumLesson(
  userId: string,
  moduleId: string,
  lessonId: string,
) {
  await upsert(userId, moduleId, (row) => {
    const done = JSON.parse(row.lessons_completed) as string[];
    if (!done.includes(lessonId)) done.push(lessonId);
    return { ...row, lessons_completed: JSON.stringify(done) };
  });
}

export async function recordModuleQuiz(
  userId: string,
  moduleId: string,
  score: number,
) {
  await upsert(userId, moduleId, (row) => ({ ...row, quiz_score: score }));
}
```

- [ ] **Step 5: Extend the progress route** in `src/app/api/student/progress/route.ts`:
- Keep existing `isValidLessonId` (academy), add:

```ts
import { curriculumLessonIds } from "@/data/curriculum/lessons/index"; // see Step 6
// inside action handling:
case "completeCurriculumLesson": {
  const { moduleId, lessonId } = data;
  if (typeof lessonId !== "string" || !curriculumLessonIds().has(lessonId))
    return NextResponse.json({ error: "Unknown lessonId" }, { status: 400 });
  await recordCurriculumLesson(user.id, moduleId, lessonId);
  await recordAuditEvent({ actorId: user.id, actorEmail: user.email,
    action: "curriculum-lesson-complete", resource: "module", resourceId: moduleId,
    result: "success", metadata: { lessonId } });
  break;
}
case "submitModuleQuiz": {
  const { moduleId, score } = data;
  if (typeof score !== "number" || score < 0 || score > 100)
    return NextResponse.json({ error: "score must be 0-100" }, { status: 400 });
  await recordModuleQuiz(user.id, moduleId, score);
  await recordAuditEvent({ actorId: user.id, actorEmail: user.email,
    action: "module-quiz-submit", resource: "module", resourceId: moduleId,
    result: "success", metadata: { score } });
  break;
}
case "getModuleProgress": {
  const { moduleId } = data;
  const row = await getModuleProgress(user.id, moduleId);
  return NextResponse.json({ progress: row,
    complete: isModuleComplete(row, getLessons(moduleId).length) },
    { headers: { "X-Correlation-Id": correlationId } });
}
```

Also extend `isValidLessonId` body: `if (curriculumLessonIds().has(lessonId)) return true;` so academy lesson-completion actions accept curriculum ids too (spec §5.3). Same role gate (`student`/`builder`), rate limit, and error shapes as existing actions.

- [ ] **Step 6: `src/data/curriculum/lessons/index.ts`** (Task 13 will populate `LEVEL_FILES`; write it now):

```ts
import type { Lesson } from "../types";
import * as jrA from "./jr-a";
import * as jrB from "./jr-b";
const LEVEL_FILES: Array<Record<string, Lesson[]>> = [
  jrA.lessonsByModule,
  jrB.lessonsByModule,
];
// Task 13 adds: import * as level0 from "./level-0"; … level-12  → push each

const ALL: Lesson[] = LEVEL_FILES.flatMap((f) => Object.values(f).flat());

export function getLessons(moduleId: string): Lesson[] {
  const byModule = new Map<string, Lesson[]>();
  for (const l of ALL) {
    if (!byModule.has(l.moduleId)) byModule.set(l.moduleId, []);
    byModule.get(l.moduleId)!.push(l);
  }
  return byModule.get(moduleId) ?? [];
}
export function getLesson(
  moduleId: string,
  lessonId: string,
): Lesson | undefined {
  return getLessons(moduleId).find((l) => l.id === lessonId);
}
export function getAllCurriculumLessonIds(): string[] {
  return ALL.map((l) => l.id);
}
export function curriculumLessonIds(): Set<string> {
  return new Set(getAllCurriculumLessonIds());
}
```

**File-per-level contract (Task 13):** `src/data/curriculum/lessons/{jr-a,jr-b,level-0,…,level-12}.ts` each exports `export const lessonsByModule: Record<string, Lesson[]>`. Until a file exists, its import is absent from `LEVEL_FILES` (registry simply has fewer lessons — module pages show the honest "being prepared" state).

- [ ] **Step 7: Placeholder junior files** — create `jr-a.ts` and `jr-b.ts` now with `export const lessonsByModule: Record<string, Lesson[]> = {};` (Task 13 fills them). Run test → PASS. tsc. eslint. Commit: `git commit -m "feat(curriculum): module_progress table + progress API actions"`

### Task 13: Content authoring — 15 level files (parallel batches)

**Files:**

- Create/fill: `apps/ai-institute/src/data/curriculum/lessons/{jr-a,jr-b,level-0,…,level-12}.ts`
- Test: `apps/ai-institute/src/data/curriculum/__tests__/content.test.ts`

**Interfaces:**

- Consumes: types (Task 1), `WIDGET_IDS`, `DIAGRAM` kinds (Task 1 `DiagramSpec` union), `getStandards` (Task 7), legacy `lessonContent` (`src/data/lesson-content.ts`), `assessments` (`src/data/assessments.ts`), `labExercises` (`src/data/lab-exercises.ts`).
- Produces: complete lesson registry powering routes.

- [ ] **Step 1: Write the contract test FIRST** (drives all authoring):

```ts
// content.test.ts
import { describe, it, expect } from "vitest";
import { getAllModules } from "../index";
import { getLessons } from "../lessons/index";
import { WIDGET_IDS } from "../lessons/widget-ids";
import { getStandards } from "../standards";

const words = (s: string) => s.trim().split(/\s+/).length;
const BANNED_PLACE =
  /uttarakhand|garhwal|himachal|shimla|churdhar|ransi|shirgul/i;

describe("P5 content contract (spec §4.3)", () => {
  const modules = getAllModules();

  it("every module has standards", () => {
    for (const m of modules)
      expect(() => getStandards(m.id), m.id).not.toThrow();
  });

  it("every module has at least one lesson", () => {
    const empty = modules
      .filter((m) => getLessons(m.id).length === 0)
      .map((m) => m.id);
    expect(empty, `lessons missing for: ${empty.join(", ")}`).toEqual([]);
  });

  for (const m of modules) {
    it(`${m.id}: every lesson meets the minimum bar`, () => {
      for (const l of getLessons(m.id)) {
        expect(l.moduleId).toBe(m.id);
        expect(l.band).toBe(m.ageBand);
        expect(l.title.length).toBeGreaterThan(0);
        const kinds = l.blocks.map((b) => b.kind);
        expect(kinds, "needs a visual").toContain("visual");
        expect(kinds, "needs an interactive").toContain("interactive");
        expect(kinds, "needs an experiment or project")
          .some((k) => k === "experiment" || k === "project")
          .toBe(true);
        // quiz: >= 1 question with explanatory feedback
        const qs = l.blocks.flatMap((b) =>
          b.kind === "quiz" ? b.questions : [],
        );
        expect(qs.length, "needs quiz questions").toBeGreaterThan(0);
        for (const q of qs) {
          expect(q.feedback.correct.length).toBeGreaterThan(10);
          expect(q.feedback.incorrect.length).toBeGreaterThan(10);
          expect(q.options.length).toBeGreaterThanOrEqual(2);
          expect(q.correctIndex).toBeLessThan(q.options.length);
        }
        // prose word count 300–600 across prose blocks (spec §4.2)
        const prose = l.blocks
          .filter((b) => b.kind === "prose")
          .map((b) => (b.kind === "prose" ? b.text : ""))
          .join(" ");
        expect(words(prose)).toBeGreaterThanOrEqual(300);
        expect(words(prose)).toBeLessThanOrEqual(600);
        // widget id valid
        for (const b of l.blocks)
          if (b.kind === "interactive")
            expect(WIDGET_IDS).toContain(b.widget.id);
        // no place names anywhere (spec D4 extended to content)
        expect(JSON.stringify(l)).not.toMatch(BANNED_PLACE);
      }
    });

    it(`${m.id}: module quiz aggregate >= 4 questions`, () => {
      const qs = getLessons(m.id).flatMap((l) =>
        l.blocks.flatMap((b) => (b.kind === "quiz" ? b.questions : [])),
      );
      expect(qs.length).toBeGreaterThanOrEqual(4);
    });
  }
});
```

- [ ] **Step 2: Run → FAIL** (only junior placeholder files exist; expect failures for all 86 modules).

- [ ] **Step 3: Legacy asset mapping** — in `jr-*`/`level-*` authoring batches, reuse (adapt, don't copy verbatim where format differs):
  - `lesson-content.ts` (`defining-ai`, `history-of-ai`, `types-of-ai-systems`, `the-ai-workflow`, `ethics-in-ai`, `python-basics`, `data-structures`, `numpy-fundamentals`, `pandas-dataframes`, `data-visualization`) → prose blocks from `visualExplanation`, quiz from `quiz` (map `correctIndex` + write `feedback` from the question's explanation), experiment from `lab.steps`.
  - `assessments.ts` (5 topics × 10 q) → quiz blocks for matching Core modules (map: `ai-foundations`→intro modules; `machine-learning`→ML modules; `deep-learning`; `natural-language-processing`; `ai-ethics`→ethics modules). Write `feedback.incorrect` where only `explanation` exists.
  - `lab-exercises.ts` (6) → experiment blocks (`problemStatement` → brief, `walkthroughSteps` → steps, `hints` → safety/tips).

- [ ] **Step 4: Author in 7 parallel batches** (dispatch `task` subagents, `subagent_type: "general"`, giving each: this plan's Task 1 types excerpt, the content contract test, the widget id list, standards lookup, the worked example below, and the exact file to write):

**Worked example (authoring template — every lesson follows this shape):**

```ts
// src/data/curriculum/lessons/level-3.ts
import type { Lesson } from "../types";

export const lessonsByModule: Record<string, Lesson[]> = {
  "l3-m2": [
    {
      id: "l3-m2-l1",
      moduleId: "l3-m2",
      band: "12-15",
      title: "How a model learns from examples",
      durationMin: 45,
      blocks: [
        {
          kind: "visual",
          diagram: {
            kind: "flow",
            title: "Training loop",
            steps: ["Examples", "Prediction", "Compare", "Adjust", "Repeat"],
          },
        },
        {
          kind: "prose",
          text: "…300–600 words, age-12–15 voice, concrete examples, no invented statistics, no place names…",
        },
        {
          kind: "interactive",
          widget: {
            id: "sim-controls",
            config: {
              preset: "perceptron-step",
              prompt:
                "Move the threshold and watch which examples get classified correctly.",
            },
          },
        },
        {
          kind: "quiz",
          questions: [
            {
              id: "q1",
              prompt: "…",
              options: ["…", "…", "…"],
              correctIndex: 1,
              feedback: { correct: "…", incorrect: "…" },
            },
          ],
        },
        {
          kind: "experiment",
          title: "…",
          materials: ["paper", "pencil"],
          steps: ["…", "…"],
          safety: "…",
        },
      ],
    },
  ],
};
```

**Batch assignments:** B1=`jr-a.ts` (6 modules × 2 lessons each), B2=`jr-b.ts` (6 × 2), B3=`level-0.ts`+`level-1.ts` (8 modules × ≥1), B4=`level-2.ts`+`level-3.ts` (12), B5=`level-4.ts`+`level-5.ts`+`level-6.ts` (18), B6=`level-7.ts`+`level-8.ts`+`level-9.ts` (18), B7=`level-10.ts`+`level-11.ts`+`level-12.ts` (18). Batch instructions must include: age-band voice (6–8 playful short sentences; 9–11 curious guided; 12–15 analytical; advanced rigorous + mentor-oriented), ≥1 interactive per lesson with widget ids only from `WIDGET_IDS`, diagrams from the 8 kinds, no place names, no invented numbers/statistics, module ids must match `getModulesByLevel` output (list them per file), every lesson band = module ageBand (`advanced` for L7–L12).

- [ ] **Step 5: After each batch:** `pnpm --filter @bhavya/ai-institute exec vitest run src/data/curriculum/__tests__/content.test.ts` — fix failures (validator is the contract); commit per batch: `git commit -m "feat(curriculum): lesson content — <batch id>"`.

- [ ] **Step 6: Full green:** content test all 86 modules PASS; tsc; eslint (0 errors).

### Task 14: Complete lesson numbering wiring

- [ ] Ensure every lesson id is `{moduleId}-l{n}` (validator add: `expect(l.id).toMatch(new RegExp(`^${m.id}-l\\d+$`))` — add this assertion to content.test.ts in this task and fix any mismatches).
- [ ] Ensure `generateStaticParams` on the lesson page compiles the full set (tsc).
- [ ] Commit: `git commit -m "test(curriculum): enforce lesson id convention"`

### Task 15: Ship P5

- [ ] Full gates: tsc; `npx eslint apps/ai-institute/src`; full vitest; `pnpm tokens:check`; `pnpm antislop`; `pnpm file-map && pnpm file-map:check`; `git diff --check`; `git status` clean of unintended files.
- [ ] Update claims if lesson totals are displayed anywhere in curriculum nav (register `"{n} lessons"` computed claim in `claims.ts` + test).
- [ ] Push (probe `git ls-remote` first; GitHub API fallback per D10) → PR → CI 4/4 → merge → deploy.
- [ ] Live Playwright script `pwverify/verify9.mjs` (write during execution; assert): hub track counts sum = total; crawl ALL 86 module URLs from sitemap (fetch, expect 200, zero 404); one lesson page renders a diagram + interactive widget; quiz feedback appears after answering; `/knowledge/academy` no longer shows fake course grids; `/knowledge/courses` 301/308-redirects to `/courses`; zero console page errors; `overflowX === 0`; reduced-motion pass. Save evidence screenshots.
- [ ] Append route-audit report (`## Route Audit — 2026-09-26 …`) to `.ai/` or plan appendix: routes checked, orphan modules = 0, dead links = 0.

---

## Self-Review

1. **Spec coverage:** §4.2 schema → Task 1 types ✔; §4.1 junior 12 → Task 2 ✔; D2 86 computed → Task 3 ✔; §5.3 routes → Tasks 4–6 + Task 11 ✔ (progress API extension → Task 12 ✔); §4.4 diagram kit → Task 9 ✔; §4.3 widget kit → Task 10 (mapping documented, 5 deferred ids recorded as gap) ✔; standards footer → Task 11 ✔; §3 tagging → Task 7 ✔; P4 gates/route audit/sitemap → Task 8 ✔; content bar → Task 13 contract test ✔; claims/D1 → Tasks 3/4/15 ✔.
2. **Placeholders:** authoring prose is content work (template + contract given, not a placeholder); every code step carries real code. `CurriculumModule`-level `standards` lookup via `getStandards` (Task 7) — consistent naming used by Task 11 StandardsFooter ✔.
3. **Type consistency:** `Lesson.blocks`/`LessonBlock` same across Tasks 1/9/11/13; `WidgetSpec` ids match `WIDGET_IDS`; `getLessons/getLesson/curriculumLessonIds` exported by `lessons/index.ts` and imported via `@/lib/curriculum/lessons` (pages) and directly (data layer, avoids cycles) — both paths documented; `moduleParams()` shape `{level, module}` matches generateStaticParams keys ✔; `ModuleProgressRow.lessons_completed` JSON-string handling consistent ✔.
4. **Gaps recorded for completion report:** 5 deferred widget ids; labeled-photo requires credits if ever used with photos (prefer other kinds).
