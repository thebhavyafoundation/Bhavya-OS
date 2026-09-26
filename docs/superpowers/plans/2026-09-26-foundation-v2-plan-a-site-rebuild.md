# Foundation v2 — Plan A: Truth, Homepage, Motion (P1–P3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Purge every invented number/place-credit from the site, rebuild mission pages on constitutional truth, replace the homepage entirely with the user's reference design, integrate the official logo everywhere, and add the premium motion/3D pass.

**Architecture:** All work inside `apps/ai-institute` (canonical host). Truth layer = a claims registry + photo-credit module every surface reads from. Homepage = new section components under `src/components/home/` rendered by a fully replaced `src/app/page.tsx`; old ten-beat story + ChapterRail usage removed from `/`. Motion reuses the existing kit (`ScrollReveal`, `TextReveal`, `TiltCard`) plus one new lazy `three` scene.

**Tech Stack:** Next 15 App Router, React 19, Tailwind v4 tokens (`@bhavya/platform-ui`), GSAP + Lenis + `@react-three/fiber` + `three` (already deps), vitest.

**Spec:** `docs/superpowers/specs/2026-09-26-foundation-v2-design.md` (§2 decisions D1–D11, §5.1 homepage, §5.2 missions) — the plan argues from the spec; executors read both.

## Global Constraints

- **D1 Numbers policy:** zero impact/stat numbers on public surfaces; structural curriculum counts only in curriculum UI; every displayed value registered in `src/lib/claims.ts`. Never hardcode a count.
- **D4 Credits:** author + license only. No place names in credits OR alt text.
- **D7 Logo:** official `C:\Users\kanta\Downloads\logo.png` (1240², white bg) is the only brand logo; dark surfaces use an ivory chip wrapper.
- Tokens only — no hardcoded colors/fonts; gate: `pnpm tokens:check`.
- Voice: institutional, editorial, ecological; "would still make sense without the word AI".
- Rule 16: no local `pnpm build`/`next build`/full `pnpm test`. Allowed: `npx tsc --noEmit`, `npx eslint <paths>`, `pnpm tokens:check`, `pnpm antislop`, `pnpm --filter @bhavya/ai-institute test` (vitest, light), git.
- Never commit: `opencode.json`, `packages/database/data/bhavya.db`, `.playwright-mcp/*`, root `*.png` artifacts.
- Commit style: `feat(scope): …` / `fix(scope): …` (repo convention). Push once at Task 10 (git push may hang → GitHub API fallback, see Task 10).

---

### Task 1: Claims registry

**Files:**

- Create: `apps/ai-institute/src/lib/claims.ts`
- Test: `apps/ai-institute/src/lib/__tests__/claims.test.ts`

**Interfaces:**

- Produces: `export type ClaimState = "verified" | "target" | "pending" | "removed";`, `export interface Claim { id: string; claim: string; value: string; state: ClaimState; source: string; checked: string; }`, `export const CLAIMS: readonly Claim[]`, `export function claimValue(id: string): string` (throws on unknown id), `export function isApprovedNumber(raw: string): boolean` (true when the string appears in any verified claim value or matches structural curriculum pattern `^\d+ (levels|modules|lessons)$`).

- [ ] **Step 1: Write failing test**

```ts
// apps/ai-institute/src/lib/__tests__/claims.test.ts
import { describe, it, expect } from "vitest";
import { CLAIMS, claimValue, isApprovedNumber } from "../claims";

describe("claims registry", () => {
  it("every claim has a source and checked date", () => {
    for (const c of CLAIMS) {
      expect(c.source.length).toBeGreaterThan(0);
      expect(c.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
  it("claimValue returns verified values", () => {
    expect(claimValue("curriculum-modules")).toBe(
      CLAIMS.find((c) => c.id === "curriculum-modules")!.value,
    );
    expect(() => claimValue("nope")).toThrow();
  });
  it("isApprovedNumber allows registry values and structural curriculum counts", () => {
    expect(isApprovedNumber(claimValue("curriculum-modules"))).toBe(true);
    expect(isApprovedNumber("74 modules")).toBe(true);
    expect(isApprovedNumber("10,000+ students")).toBe(false);
    expect(isApprovedNumber("8+ years")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test, verify FAIL (module not found)**

Run: `pnpm --filter @bhavya/ai-institute exec vitest run src/lib/__tests__/claims.test.ts`
Expected: FAIL — `Cannot find module '../claims'`

- [ ] **Step 3: Implement `src/lib/claims.ts`**

```ts
export type ClaimState = "verified" | "target" | "pending" | "removed";

export interface Claim {
  id: string;
  claim: string;
  value: string;
  state: ClaimState;
  source: string;
  checked: string;
}

export const CLAIMS: readonly Claim[] = [
  {
    id: "curriculum-levels",
    claim: "Curriculum levels",
    value: "13 levels",
    state: "verified",
    source: "src/data/curriculum-levels.ts (computed)",
    checked: "2026-09-26",
  },
  {
    id: "curriculum-modules",
    claim: "Curriculum modules",
    value: "74 modules",
    state: "verified",
    source: "docs/master-curriculum/MODULE_CATALOG.md + getTotalModules()",
    checked: "2026-09-26",
  },
  {
    id: "missions",
    claim: "Missions",
    value: "4 missions",
    state: "verified",
    source: "_archive/constitution-2026-09-05/15_Brand_Constitution.md Ch.6",
    checked: "2026-09-26",
  },
  // Future verified claims append here with sources; removed claims stay
  // recorded with state "removed" so historical edits are auditable.
] as const;

const BY_ID = new Map(CLAIMS.map((c) => [c.id, c]));

export function claimValue(id: string): string {
  const c = BY_ID.get(id);
  if (!c) throw new Error(`Unknown claim id: ${id}`);
  return c.value;
}

export function isApprovedNumber(raw: string): boolean {
  for (const c of CLAIMS) if (c.value === raw) return true;
  return /^\d+ (levels|modules|lessons)$/.test(raw.trim());
}
```

- [ ] **Step 4: Run test, verify PASS**

Run: `pnpm --filter @bhavya/ai-institute exec vitest run src/lib/__tests__/claims.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add apps/ai-institute/src/lib/claims.ts apps/ai-institute/src/lib/__tests__/claims.test.ts
git commit -m "feat(truth): add claims registry with verification states"
```

---

### Task 2: Number purge on non-homepage surfaces (+ ban test)

**Files:**

- Create: `apps/ai-institute/src/lib/__tests__/no-fake-numbers.test.ts`
- Modify (known offenders from audit): `apps/ai-institute/src/app/programs/page.tsx`, `apps/ai-institute/src/app/knowledge/academy/page.tsx`, `apps/ai-institute/src/app/knowledge/courses/page.tsx`, `apps/ai-institute/src/app/donate/page.tsx` (if present — verify with glob), `apps/ai-institute/src/app/mission/page.tsx`, `apps/ai-institute/src/app/faq/page.tsx`, plus any page the ban test flags.
- NOT touched here: `src/app/page.tsx` + `src/lib/homepage-story.ts` (replaced wholesale in Task 6).

**Interfaces:**

- Consumes: `isApprovedNumber` from Task 1.

- [ ] **Step 1: Write the failing ban test**

```ts
// apps/ai-institute/src/lib/__tests__/no-fake-numbers.test.ts
import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { isApprovedNumber } from "../claims";

// Marketing impact-stat patterns banned by spec D1.
const BANNED = [
  /\b\d[\d,.]*\s*\+\s*(years|members|students|learners|volunteers|donors|trees|villages|families|cities|events|articles|courses|schools|partners|contributors)\b/i,
  /\b\d[\d,.]*\s*\+?\s*(Students|Members|Volunteers|Trees|Learners)\b/,
  /\b(Over|More than|Up to)\s+\d[\d,.]*\s*\+?\s*(years|people|students|members|trees|families)\b/i,
];

// Curricular durations/percentages are structural, not impact stats.
const ALLOW = [/weeks?/, /days?/, /hours?/, /minutes?/, /%/, /hands-?on/i];

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|mdx?)$/.test(e) && !e.endsWith(".test.ts")) out.push(p);
  }
  return out;
}

describe("D1 — no invented impact numbers", () => {
  const roots = [
    join(process.cwd(), "src/app"),
    join(process.cwd(), "src/data"),
    join(process.cwd(), "src/lib"),
  ];
  const files = roots
    .flatMap((r) => walk(r))
    .filter((f) => !f.includes(`${"__tests__"}`));

  it("scans a meaningful number of files", () => {
    expect(files.length).toBeGreaterThan(80);
  });

  it("no banned impact-stat pattern outside approved claims", () => {
    const offenders: string[] = [];
    for (const f of files) {
      const text = readFileSync(f, "utf8");
      for (const re of BANNED) {
        const m = text.match(re);
        if (m && !isApprovedNumber(m[0]) && !ALLOW.some((a) => a.test(m[0]))) {
          offenders.push(`${f.replace(/\\/g, "/")}: ${m[0]}`);
        }
      }
    }
    expect(offenders, `\n${offenders.join("\n")}`).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test, verify it FAILS with a real offender list**

Run: `pnpm --filter @bhavya/ai-institute exec vitest run src/lib/__tests__/no-fake-numbers.test.ts`
Expected: FAIL listing offender files (programs/academy/etc.)

- [ ] **Step 3: Fix every offender.** For each listed file: read the surrounding sentence; either **delete the stat** or **replace with non-numeric honest copy** (e.g. `8+ years of impact` → remove the whole chip; `45 experts` → drop the number, keep `expert-led`). Do not swap one number for another invented one. Curriculum structural counts (`13 levels`, `74 modules`, `12 weeks`) are allowed only where the file is curriculum navigation — leave `src/data/curriculum-levels.ts` alone.

- [ ] **Step 4: Re-run test until PASS; also grep sweep**

Run: `pnpm --filter @bhavya/ai-institute exec vitest run src/lib/__tests__/no-fake-numbers.test.ts`
Expected: PASS
Run: `rg -n "\d+\+ (years|users|members|students)" apps/ai-institute/src --glob '!**/*.test.ts'`
Expected: no output (manual second net for phrasings the regex missed; fix or record in claims if legitimate)

- [ ] **Step 5: Commit**

```bash
git add -A apps/ai-institute/src
git commit -m "feat(truth): ban invented impact numbers site-wide (D1)"
```

---

### Task 3: Photo credits module + place-name strip + mission photo fixes

**Files:**

- Create: `apps/ai-institute/src/lib/photo-credits.ts`
- Read first: `apps/ai-institute/public/photography/metadata/photo_manifest.json` (author/license per asset), `apps/ai-institute/src/components/editorial/PhotoPlate.tsx` (how credit/alt render), `apps/ai-institute/src/lib/photos.ts`
- Modify: every consumer passing credit/alt strings — grep `rg -n "credit|alt=" apps/ai-institute/src/components apps/ai-institute/src/app --glob '*.tsx'` and fix each

**Interfaces:**

- Produces: `export interface PhotoCredit { author: string; license: string; }`, `export const PHOTO_CREDITS: Record<string, PhotoCredit>` keyed by the same keys as `PHOTO`/`CHAPTER_PHOTO`, `export function photoCredit(key: string): string` returning `"Photo: {author} · {license}"` (never a location).

- [ ] **Step 1: Read manifest + PhotoPlate** to learn the real field names (`author`/`license`/`credit`) and where credit strings are constructed. Record findings in the PR description later; do not guess fields.

- [ ] **Step 2: Implement `src/lib/photo-credits.ts`** using manifest values (example shape; substitute real values read from the manifest):

```ts
export interface PhotoCredit {
  author: string;
  license: string;
}

export const PHOTO_CREDITS: Record<string, PhotoCredit> = {
  hero: { author: "<from manifest>", license: "<from manifest>" },
  why: { author: "<from manifest>", license: "<from manifest>" },
  heritageStone: { author: "<from manifest>", license: "<from manifest>" },
  knowledgeBooks: { author: "<from manifest>", license: "<from manifest>" },
  communityLandscape: { author: "<from manifest>", license: "<from manifest>" },
  forest: { author: "<from manifest>", license: "<from manifest>" },
};

export function photoCredit(key: string): string {
  const c = PHOTO_CREDITS[key];
  if (!c) return "";
  return `Photo: ${c.author} · ${c.license}`;
}
```

(`<from manifest>` is replaced with real values — if the manifest has no author/license field, use `Photo: Bhavya Foundation` + license `All rights reserved` and record a gap in the completion report. Never invent an author.)

- [ ] **Step 3: Wire credits** — PhotoPlate and any raw credit strings call `photoCredit(key)`; remove inline credit literals.

- [ ] **Step 4: Strip place names from alt/captions**

Run: `rg -n -i "uttarakhand|garhwal|himalaya|himachal|kedar|ganga|alaknanda" apps/ai-institute/src --glob '*.tsx' --glob '*.ts'`
For each hit in **alt/credit/caption** copy: rewrite to subject description (`"Snow peaks at sunrise"`), keeping file paths untouched (paths are not user-visible copy). Mission/section names that are institutions or programs stay.

- [ ] **Step 5: Fix photo↔mission mismatches** — each mission section/page uses its pillar photo only: Forest→`PHOTO.forest`, Knowledge→`PHOTO.knowledgeBooks`, Heritage→`PHOTO.heritageStone`, Community→`PHOTO.communityLandscape` (via `CHAPTER_PHOTO`). Grep `CHAPTER_PHOTO` consumers; correct any cross-wiring.

- [ ] **Step 6: Verify**

Run: `npx tsc --noEmit -p apps/ai-institute/tsconfig.json` (or from app dir `npx tsc --noEmit`) — 0 errors
Run: `npx eslint apps/ai-institute/src/lib/photo-credits.ts apps/ai-institute/src/components/editorial` — 0 errors
Run: `rg -n -i "uttarakhand|garhwal" apps/ai-institute/src --glob '*.tsx'` — only non-credit contexts remain (document any)

- [ ] **Step 7: Commit**

```bash
git add -A apps/ai-institute/src
git commit -m "feat(truth): module-sourced photo credits, place-free copy, mission photo pairing"
```

---

### Task 4: Mission profiles data + four mission pages rebuild

**Files:**

- Create: `apps/ai-institute/src/data/mission-profiles.ts`
- Modify: `apps/ai-institute/src/app/missions/knowledge/page.tsx`, `.../missions/forest/page.tsx`, `.../missions/heritage/page.tsx`, `.../missions/community/page.tsx` (paths confirmed by glob earlier)
- Read first: `_archive/constitution-2026-09-05/15_Brand_Constitution.md` (Ch.6 four missions), `12_*Forest*`, `14_*Vision*`, `10_*`, `1_*` (exact filenames via glob `_archive/constitution-2026-09-05/*`), and `apps/ai-institute/src/components/site/Section.tsx`, `SectionHeader.tsx`, `StatusBadge.tsx` (platform-ui), `EmptyState.tsx`

**Interfaces:**

- Produces:

```ts
export type MissionId = "forest" | "knowledge" | "heritage" | "community";
export interface MissionProfile {
  id: MissionId;
  name: string;
  status: "active" | "planning";
  statusLabel: string; // "Active" | "Not started — in planning"
  oneLiner: string;
  mandates: { quote: string; source: string }[]; // verbatim constitution quotes + doc citation
  roadmap: { phase: string; title: string; intent: string }[]; // phase = "Now/Next/Later" — no dates, no numbers
  accomplishments: string; // static honest line
}
export const MISSION_PROFILES: readonly MissionProfile[];
export function getMissionProfile(id: MissionId): MissionProfile;
```

- Consumed by: the four mission pages (this task) and homepage mission tiles (Task 6 uses `oneLiner`).

- [ ] **Step 1: Extract quotes.** Read the constitution docs; pick 2 mandates per mission as **verbatim quotes** with precise source labels (e.g. `"Legacy Constitution (2026-09-05), Doc 12 — Bhavya Forest Mission, §1"`). Never paraphrase inside `quote`. If a mission's doc offers only principles (no targets), that is correct — roadmap entries describe intent, not promises.

- [ ] **Step 2: Write failing test** for data integrity:

```ts
// apps/ai-institute/src/data/__tests__/mission-profiles.test.ts
import { describe, it, expect } from "vitest";
import { MISSION_PROFILES, getMissionProfile } from "../mission-profiles";

describe("mission profiles", () => {
  it("covers exactly four missions", () => {
    expect(MISSION_PROFILES).toHaveLength(4);
    expect(getMissionProfile("knowledge").status).toBe("active");
    expect(getMissionProfile("forest").status).toBe("planning");
  });
  it("every mission cites verbatim mandates", () => {
    for (const m of MISSION_PROFILES) {
      expect(m.mandates.length).toBeGreaterThanOrEqual(1);
      for (const q of m.mandates) expect(q.source).toMatch(/constitution/i);
    }
  });
  it("roadmaps carry no digits (plans, not claims)", () => {
    for (const m of MISSION_PROFILES)
      for (const p of m.roadmap)
        expect(`${p.title}${p.intent}`).not.toMatch(/\d/);
  });
});
```

Run → FAIL (module missing).

- [ ] **Step 3: Implement `mission-profiles.ts`** with the four profiles. Statuses: knowledge=`active`, forest/heritage/community=`planning`. Roadmap: 3 entries each (`Now`/`Next`/`Later`), honest planning verbs ("Establish…", "Publish…", "Pilot…") with **no digits** and no achievement language. Accomplishments string: `"No accomplishments published yet — this mission has not launched. Progress will be published here with sources when it does."`

- [ ] **Step 4: Run test → PASS.**

- [ ] **Step 5: Rebuild the four pages** to one shared structure (colocate a local `MissionPage` component at `apps/ai-institute/src/components/site/MissionPage.tsx` to avoid quadrupling code):

1. Status banner — platform-ui `StatusBadge` (`Active` gold / `planning` muted) + one-line status copy.
2. Mandate — serif quote blocks + source citation lines.
3. Roadmap — three phase cards (`Now`, `Next`, `Later`), each labeled **"Plan — not yet achieved"** via `StatusLabel`.
4. Accomplishments — `EmptyState` (platform-ui) with the honest string.
5. CTA — existing `CTABand` linking Knowledge mission → `/knowledge`; others → `/get-involved`.

Keep each page's existing hero pattern if present (inspect before rewriting; preserve working structure — smallest correct change).

- [ ] **Step 6: Verify** — `npx tsc --noEmit` 0 errors; `npx eslint apps/ai-institute/src/app/missions apps/ai-institute/src/data/mission-profiles.ts apps/ai-institute/src/components/site/MissionPage.tsx` 0 errors; `pnpm --filter @bhavya/ai-institute exec vitest run mission-profiles` PASS.

- [ ] **Step 7: Commit**

```bash
git add -A apps/ai-institute/src
git commit -m "feat(missions): constitutional mandates, honest roadmaps, empty-state accomplishments"
```

---

### Task 5: Official logo assets (crop, chips, metadata icons)

**Files:**

- Read first: `apps/ai-institute/src/components/BhavyaLogo.tsx` (current rendering), `apps/ai-institute/src/app/layout.tsx` (metadata icons), existing `apps/ai-institute/public/brand/*`
- Create: `apps/ai-institute/public/brand/logo-full.png` (copy of official), `apps/ai-institute/public/brand/logo-mark.png` (cropped emblem), `apps/ai-institute/public/brand/logo-chip.png` (mark on ivory rounded bg for dark surfaces if needed), favicon/apple-touch outputs wired in `layout.tsx`

**Interfaces:**

- Produces: `BhavyaLogo` component API kept stable: `({ className?: string; variant?: "light" | "dark" })` rendering `<img>` of `logo-full.png` (light) or `logo-full.png` inside an ivory chip (dark). Later tasks consume only this component.

- [ ] **Step 1: Inspect the logo visually** — done at planning time: `C:\Users\kanta\Downloads\logo.png` is 1240×1240, white background. **Emblem** (tree+B+sun+mountains+book): x≈360–895, y≈150–690 → square crop **X=335, Y=130, W=570, H=570** (centered on image axis x=620). **Tight lockup** (emblem + BHAVYA + FOUNDATION + tagline): x≈150–1100, y≈140–1110 → crop **X=150, Y=140, W=950, H=970**. Re-verify visually in Step 5 after cropping; nudge ±10px if edges clip.

- [ ] **Step 2: Copy + crop with PowerShell System.Drawing**

```powershell
Add-Type -AssemblyName System.Drawing
$src = "C:\Users\kanta\Downloads\logo.png"
New-Item -ItemType Directory -Force -Path "apps\ai-institute\public\brand" | Out-Null
$brand = (Resolve-Path "apps\ai-institute\public\brand").Path
$img = [System.Drawing.Image]::FromFile($src)
function Crop([int]$X, [int]$Y, [int]$W, [int]$H, [string]$Out) {
  $bmp = New-Object System.Drawing.Bitmap($W, $H)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0,0,$W,$H)),
               (New-Object System.Drawing.Rectangle($X,$Y,$W,$H)),
               [System.Drawing.GraphicsUnit]::Pixel)
  $bmp.Save("$brand\$Out", [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}
Crop 150 140 950 970 "logo-full.png"     # tight lockup for header/footer/print
Crop 335 130 570 570 "logo-mark.png"      # emblem only for favicon/seal/chip
$img.Dispose()
```

(Values for X/Y/W/H come from Step 1 — inspect, don't guess.)

- [ ] **Step 3: Rewrite `BhavyaLogo.tsx`** to render the official PNGs (keep export name/signature). `light`: `<img src="/brand/logo-full.png" alt="Bhavya Foundation">`. `dark`: same image wrapped in `rounded-md bg-ivory px-2 py-1` chip (use token classes, e.g. `bg-[var(--color-ivory)]` per tokens.css naming — verify actual token names in `packages/platform-ui/src/styles/tokens.css` first).

- [ ] **Step 4: Wire metadata icons in `layout.tsx`** — `icons: { icon: "/brand/logo-mark.png", apple: "/brand/logo-mark.png" }`, `openGraph.images: ["/brand/logo-full.png"]`, replacing prior svg icon entries (keep other metadata intact).

- [ ] **Step 5: Verify** — `npx tsc --noEmit` 0; `npx eslint apps/ai-institute/src/components/BhavyaLogo.tsx apps/ai-institute/src/app/layout.tsx` 0; visually `read` the two generated PNGs to confirm crop is clean and centered.

- [ ] **Step 6: Commit**

```bash
git add apps/ai-institute/public/brand apps/ai-institute/src/components/BhavyaLogo.tsx apps/ai-institute/src/app/layout.tsx
git commit -m "feat(brand): official logo assets, mark crop, metadata icons (D7)"
```

---

### Task 6: Homepage full replace per reference

**Files:**

- Read first: `apps/ai-institute/src/app/page.tsx` (current 508-line ten-beat), `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`, `src/lib/homepage-story.ts`, `src/components/site/Section.tsx`, `SectionHeader.tsx`, `src/components/editorial/PhotoPlate.tsx`, `src/components/editorial/EditorialLink.tsx`, `src/lib/photos.ts`, tokens.css
- Create: `apps/ai-institute/src/components/home/SplitHero.tsx`, `FourPillars.tsx`, `MissionTiles.tsx`, `SmallTiles.tsx`, `QuoteBand.tsx`, `FinalCta.tsx`, `apps/ai-institute/src/data/home-v2.ts`
- Modify: `src/app/page.tsx` (full replace), `SiteHeader.tsx` + `SiteFooter.tsx` (official logo + same nav), `src/lib/homepage-story.ts` (delete stats exports; if other pages import it, keep only what they need — check with `rg -l "homepage-story"`)
- Delete usage: `ChapterRail` from `/` (component file stays — other pages may use it), `CountUp` from `/` (numbers are banned).

**Interfaces:**

- Consumes: `MISSION_PROFILES` (Task 4 `oneLiner`, `id`), `PHOTO`/`CHAPTER_PHOTO` (Task 3), `BhavyaLogo` (Task 5), motion kit (`ScrollReveal`, `TextReveal`), `PhotoPlate`, `EditorialLink`, `Section`, `SectionHeader`.
- Produces: `home-v2.ts` → `export interface PillarCard { id: MissionId; name: string; blurb: string; href: string; accent: "forest"|"knowledge"|"heritage"|"community"; }` and `export const PILLARS: readonly PillarCard[]`, `export const SMALL_TILES: readonly { title: string; body: string; href: string }[]`, `export const QUOTE = { text: string; attribution: string }`.

- [ ] **Step 1: Write `src/data/home-v2.ts`** — real copy (no numbers, no places):

```ts
import type { MissionId } from "./mission-profiles";

export interface PillarCard {
  id: MissionId;
  name: string;
  blurb: string;
  href: string;
  accent: "forest" | "knowledge" | "heritage" | "community";
}

export const PILLARS: readonly PillarCard[] = [
  {
    id: "forest",
    name: "Forest",
    blurb: "Restoring living landscapes with communities, season by season.",
    href: "/missions/forest",
    accent: "forest",
  },
  {
    id: "knowledge",
    name: "Knowledge",
    blurb: "Education and AI literacy that outlasts any single classroom.",
    href: "/missions/knowledge",
    accent: "knowledge",
  },
  {
    id: "heritage",
    name: "Heritage",
    blurb:
      "Keeping the records, crafts, and stories that hold a people together.",
    href: "/missions/heritage",
    accent: "heritage",
  },
  {
    id: "community",
    name: "Community",
    blurb: "Local institutions that let good work continue without us.",
    href: "/missions/community",
    accent: "community",
  },
] as const;

export const SMALL_TILES = [
  {
    title: "Foundation",
    body: "A stronger tomorrow — institutions, alliances, and long-term systems for change.",
    href: "/about",
  },
  {
    title: "Evidence",
    body: "Every claim we publish will be sourced, checked, and open to scrutiny.",
    href: "/transparency",
  },
  {
    title: "Participate",
    body: "Donate. Volunteer. Collaborate. Build what lasts with us.",
    href: "/get-involved",
  },
  {
    title: "Bhavya OS",
    body: "The open operating layer behind how this institution works.",
    href: "/os",
  },
] as const;

export const QUOTE = {
  text: "Forests grow slowly. So do stronger societies. Both are worth the wait.",
  attribution: "Bhavya Foundation",
} as const;
```

- [ ] **Step 2: Build `SplitHero.tsx`** — full-height (`h-[100svh]`) split: left ivory panel (`bg-[var(--color-ivory)]`, padding, eyebrow `BHAVYA FOUNDATION` tracked caps, `h1` Playfair `font-[var(--font-display)]` "Building for Generations." on two lines, lead sentence, two CTAs via `Button`/`EditorialLink`: `Explore Bhavya →` (`href="/missions"`), `Our Missions →` (`href="/missions"` — differentiate: first `href="/knowledge"` if route map prefers; check `CANONICAL_ROUTE_MAP.md` during exec and use canonical), scroll cue (animated chevron, `aria-hidden`). Right: `<PhotoPlate>` with `PHOTO.hero`, `object-cover`, bottom-right overlay: `For People. For Nature. For Generations.` + `photoCredit("hero")`. `fetchPriority="high"` image. Mobile: stack (photo becomes top band 40svh, panel below).

- [ ] **Step 3: Build `FourPillars.tsx`** — dark section (`bg-[var(--color-forest)]`/dark token from tokens.css — read actual names first): centered `SectionHeader` eyebrow `OUR MSSIONS`, serif `Four Pillars. A Lasting Tomorrow.`, sub `Different paths. A shared purpose.`; responsive grid of 4 cards from `PILLARS` (accent = per-pillar token color already in tokens; icon = lucide `TreePine`/`BookOpen`/`Landmark`/`Users` — lucide-react is a dep), each an `<a href>` with name, blurb, `Explore →`. Wrap cards in `ScrollReveal`. Reserve a positioned `<div>` for the P3 mist canvas (`data-mist-slot`) that P3 fills.

- [ ] **Step 4: Build `MissionTiles.tsx`** — three photo tiles exactly per reference (Knowledge, Community, Heritage): `CHAPTER_PHOTO` image top, eyebrow (`MISSION`), Playfair headline, body from `MISSION_PROFILES` (`oneLiner` + status-aware sentence: active → "This mission is underway."; planning → "Planned — not yet launched."), `Explore →` link. Grid: 1 col mobile → 3 col desktop.

- [ ] **Step 5: Build `SmallTiles.tsx` + `QuoteBand.tsx` + `FinalCta.tsx`** — SmallTiles: 4 compact cards from `SMALL_TILES` (title, body, arrow). QuoteBand: full-bleed `PHOTO.communityLandscape` (interim panorama) with dark scrim, centered Playfair quote from `QUOTE`, attribution caps, credit via `photoCredit("communityLandscape")`. FinalCta: ivory section, Playfair `A Kinder, More Resilient India Is Possible.`, CTA button `Join the Journey →` → `/get-involved`.

- [ ] **Step 6: Replace `src/app/page.tsx`** — assemble: `<SplitHero /> <FourPillars /> <MissionTiles /> <SmallTiles /> <QuoteBand /> <FinalCta />`; page `metadata.title = "Bhavya Foundation — For People. For Nature. For Generations."`; NO stat rows, NO `CountUp`, NO `ChapterRail`. Keep the page server component; motion components are client as-is.

- [ ] **Step 7: Logo in header/footer** — `SiteHeader`: replace brand mark with `<BhavyaLogo variant="light" />`, nav links exactly `Explore` (`/missions`), `Learn` (`/knowledge`), `Participate` (`/get-involved`), `About` (`/about`), search icon (existing SearchBar if wired), CTA pill `Support Our Work →` → `/donate` (verify route exists via glob; if not, `/get-involved`). `SiteFooter`: dark forest section with `<BhavyaLogo variant="dark" />`, same nav columns as currently present (preserve existing footer link groups — smallest change), credit line via `photoCredit` where photos are credited.

- [ ] **Step 8: Retire stats** — `rg -l "homepage-story" apps/ai-institute/src`; for importers other than `page.tsx`, keep needed exports; delete `PROOF`/stat-chip exports; if `page.tsx` was sole consumer, delete the file. Remove `CountUp`/`ProofStrip` imports from `/`.

- [ ] **Step 9: Verify** — `npx tsc --noEmit` 0; `npx eslint apps/ai-institute/src/app/page.tsx apps/ai-institute/src/components/home apps/ai-institute/src/data/home-v2.ts apps/ai-institute/src/components/SiteHeader.tsx apps/ai-institute/src/components/SiteFooter.tsx` 0; `pnpm --filter @bhavya/ai-institute exec vitest run no-fake-numbers` PASS; `pnpm tokens:check` PASS.

- [ ] **Step 10: Commit**

```bash
git add -A apps/ai-institute/src
git commit -m "feat(home): rebuild homepage to reference design, official logo, zero invented numbers"
```

---

### Task 7: Logo everywhere else (auth, 404, empty states)

**Files:**

- Modify: `apps/ai-institute/src/app/login/page.tsx`, `apps/ai-institute/src/app/register/page.tsx`, `apps/ai-institute/src/app/not-found.tsx` (verify path by glob), `apps/ai-institute/src/app/forbidden/page.tsx`, platform-ui `EmptyState` consumers on `/app` surfaces only where a brand mark helps (do NOT edit platform-ui package — app-level wrappers only)

- [ ] **Step 1: Grep targets** — `rg -n "BhavyaLogo|logo|brand" apps/ai-institute/src/app/login apps/ai-institute/src/app/register apps/ai-institute/src/app/not-found.tsx` to see current state.

- [ ] **Step 2: Add `<BhavyaLogo variant="light" />`** centered above the heading on login/register; small mark on 404/forbidden above the message. No other layout changes.

- [ ] **Step 3: Verify + commit**

```bash
npx tsc --noEmit
npx eslint apps/ai-institute/src/app/login apps/ai-institute/src/app/register apps/ai-institute/src/app/not-found.tsx apps/ai-institute/src/app/forbidden
git add -A apps/ai-institute/src/app
git commit -m "feat(brand): official logo on auth and error surfaces (D7)"
```

---

### Task 8: Motion & 3D pass

**Files:**

- Modify: `apps/ai-institute/src/components/home/*.tsx` (reveal wiring),
- Create: `apps/ai-institute/src/components/three/MistScene.tsx`, `apps/ai-institute/src/components/home/FourPillars.tsx` (mount mist)
- Read first: `src/components/three/PillarSphere.tsx` (existing r3f pattern: how Canvas/props/reduced-motion handled — copy its conventions), `src/components/motion/ScrollReveal.tsx`, `TiltCard.tsx`, `MotionProvider.tsx`

**Interfaces:**

- Produces: `MistScene` props: `{ className?: string }` — renders `<Canvas>` (r3f) with low-poly ridge line (few `mesh` planes, `MeshBasicMaterial` in token dark tones), 2–3 translucent drifting planes (mist), `frameloop` default; internal `useReducedMotion` (from MotionProvider or `matchMedia`) → renders static gradient div instead of Canvas; `IntersectionObserver`/dynamic `import()` mount so SSR emits nothing heavy.

- [ ] **Step 1: Copy conventions** from `PillarSphere.tsx` (Canvas setup, dpr limits, cleanup).

- [ ] **Step 2: Implement `MistScene.tsx`** — dynamic import inside `FourPillars` (`next/dynamic`, `ssr: false`); mount into `data-mist-slot` area absolutely, `pointer-events-none`, `opacity` low so cards stay legible; `aria-hidden`.

- [ ] **Step 3: Wire reveals + tilt** — section headlines wrapped in `TextReveal` (start `top 85%` — already fixed default); pillar cards in `TiltCard` (max ~6deg, disabled under reduced motion — check TiltCard already handles; if not, gate with `useReducedMotion`); hero photo subtle `ParallaxImage` or `ScrubParallax` (reuse existing component — read its props first).

- [ ] **Step 4: Reduced-motion audit** — with `prefers-reduced-motion: reduce` emulation in a quick script: every reveal must land at final state (opacity 1) without scrolling tricks; MistScene must be static. Reuse `pwverify/` scripts pattern (needs deployed URL — final check in Task 10; local static check = code review of each motion component's reduced-motion branch).

- [ ] **Step 5: Verify** — `npx tsc --noEmit` 0; `npx eslint apps/ai-institute/src/components/home apps/ai-institute/src/components/three/MistScene.tsx` 0; `pnpm tokens:check` 0.

- [ ] **Step 6: Commit**

```bash
git add -A apps/ai-institute/src
git commit -m "feat(home): motion pass — reveals, tilt, lazy WebGL mist, reduced-motion safe"
```

---

### Task 9: Static verification sweep (local)

- [ ] **Step 1: Full local gates**

```bash
npx tsc --noEmit            # in apps/ai-institute
npx eslint apps/ai-institute/src
pnpm tokens:check
pnpm antislop
pnpm --filter @bhavya/ai-institute test
```

Expected: all pass. Fix failures before Task 10 (loop back to owning task).

- [ ] **Step 2: Route sanity** — `rg -n 'href="' apps/ai-institute/src/components/home apps/ai-institute/src/app/page.tsx` → every href matches a real route (glob-verify `src/app/**/page.tsx`); fix dead links.

- [ ] **Step 3: `git diff --check` + `git status`** — no whitespace errors; only intended files staged at commit time.

---

### Task 10: Ship (commit series → push → PR → CI → merge → deploy → live verify)

- [ ] **Step 1: Probe push health:** `git ls-remote origin HEAD` (30s timeout). If it hangs → GitHub API path (Step 3).

- [ ] **Step 2: Try normal push** (only after `git status` review; current branch `build/bhavya-os-foundation` already tracks origin):

```bash
git push origin build/bhavya-os-foundation
```

If it stalls >60s: kill (`taskkill /F /IM git.exe` for the stuck PID), go to Step 3.

- [ ] **Step 3: GitHub API fallback (proven in PR #5)** — for each unpushed commit (reverse order, base-first): `github_get_file_contents` (get sha) → `github_create_or_update_file` (update with new content, message = commit message, branch = `build/bhavya-os-foundation`). Then locally: `git fetch origin && git rebase origin/build/bhavya-os-foundation --autostash` (local duplicate commits drop out; verify `git status` shows only the protected-file dirt: `opencode.json`, `bhavya.db`).

- [ ] **Step 4: PR** — `github_create_pull_request`: base `master`, head `build/bhavya-os-foundation`, title `feat: foundation v2 — truth layer, reference homepage, logo, motion (P1–P3)`, body = summary + spec/plan links + gates evidence (paste command outputs).

- [ ] **Step 5: Wait CI** — `github_pull_request_read` method `get_check_runs` until 4/4 green (lint-and-typecheck, test, secret-scan, build). If red: read logs, fix, push (Step 2/3), re-check.

- [ ] **Step 6: Merge** — `github_merge_pull_request` (merge method `merge`, repo convention).

- [ ] **Step 7: Deploy** — push to master auto-triggers `deploy-cloudflare.yml`; poll until Worker `bhavya-foundation` deployment timestamp > merge time (Cloudflare MCP builds tool).

- [ ] **Step 8: Live Playwright verification** (extend `C:\Users\kanta\AppData\Local\Temp\opencode\pwverify\verify8.mjs`, reusing prior script skeleton):
- loads `https://bhavya-foundation.thebhavyafoundation.workers.dev`
- hero present, `h1` contains "Building for Generations", `overflowX === 0`, `pageErrors: []`
- all four pillar links resolve (fetch status 200 for `/missions/{forest,knowledge,heritage,community}`)
- railCount absent (ChapterRail gone), no `CountUp` numbers in viewport
- credits visible with no place-name tokens (assert body text lacks `Uttarakhand`/`Garhwal`)
- reduced-motion run: content still visible (opacity 1)
- screenshots: `evidence-home-top.png`, `evidence-pillars.png`, `evidence-missions.png`
  Run: `node verify8.mjs` → expect all assertions true.

- [ ] **Step 9: Report** — summarize phases P1–P3 with evidence (test/lint/gate outputs, CI green, live assertions, screenshots) into the completion log; list known gaps (hero/panorama photos pending user; place-name strings left in non-credit contexts if any).

**Plan A ends here.** Plans B (P4–P5 curriculum) and C (P6–P7 certification/gallery) are written next, once P1–P3 land (their tasks depend on final route decisions from `CANONICAL_ROUTE_MAP.md` consultation in P4).
