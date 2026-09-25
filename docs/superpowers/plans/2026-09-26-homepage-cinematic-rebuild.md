# Homepage Cinematic Rebuild — Implementation Plan

**Spec:** `docs/superpowers/specs/2026-09-26-homepage-cinematic-rebuild-design.md`
**Branch:** `build/bhavya-os-foundation` → PR → merge `master` → Cloudflare deploy
**Live target:** https://bhavya-foundation.thebhavyafoundation.workers.dev/

## Global constraints (every task)

- **No local builds/tests:** never `pnpm build`, `turbo build`, `next build`, `opennextjs-cloudflare build`, full `pnpm test`. Builds + full test suite run on GitHub Actions.
- **Local verification only:** `npx tsc --noEmit`, `npx eslint <paths>`, `pnpm tokens:check`, `pnpm antislop`, `pnpm file-map`, `pnpm drift:check`.
- **Visual truth = deployed URL**, verified with Playwright MCP after merge+deploy.
- Tokens only (constitution 01/05, `pnpm tokens:check`); no placeholder stubs (constitution 07); every photo credit honest (content-truth skill); `prefers-reduced-motion` must yield a complete static story.
- Commit only files owned by this plan's tasks; parallel-session files are committed as-is (user-approved integration) but never edited beyond what tasks require.
- Git: frequent small commits on `build/bhavya-os-foundation`; push + PR only at Task 11.

---

## Task 1 — Curate missing forest photo (Openverse CC0)

**Why first:** all chapter wiring depends on having a real, rights-cleared forest JPEG; current `PHOTO_PENDING.forest` file was deleted.

Files:

- `apps/ai-institute/public/photography/forest/forest-cedar-sunlight.jpg` (target filename kept)
- `apps/ai-institute/public/photography/forest/forest-cedar-sunlight.webp`
- `apps/ai-institute/public/photography/metadata/photo_manifest.json` (append/update forest entry, bump `updated`)
- `apps/ai-institute/src/lib/photos.ts` — move `forest` from `PHOTO_PENDING` to `PHOTO`

Steps:

1. Search Openverse API (no auth needed for basic search):
   `https://api.openverse.org/v1/images/?q=cedar+forest+sunlight&license=cc0,pdm&page_size=20`
2. Filter: CC0/PDM only, width ≥ 2000, natural daylight forest (no faces, no watermarks).
3. Download JPEG via `curl -L -o` (PowerShell `Invoke-WebRequest -UserAgent`), resize to 2400px max width using available tooling (check for `sharp` in node_modules — `node -e "require('sharp')"` — else keep original ≤ 2 MB).
4. Generate `.webp` if `sharp` available; else jpg-only is acceptable (existing pipeline has mixed jpg/webp).
5. Credit line: `"Photo · <creator>, <license> · <title>"` in manifest entry + alt text describing the scene.
6. Update manifest entry: `status: "ACQUIRED — WIRED"`, provenance, dimensions, attribution_required.

Verify: file exists on disk; `Test-Path` both jpg paths; manifest JSON parses (`node -e "require(...)"`).
Commit: `feat(home): curate CC0 forest photo (Openverse)`

---

## Task 2 — Install motion dependencies

**Dependencies to add** (approved by user; local installs allowed): `lenis` (smooth scroll, ~3 kB), `three` + `@react-three/fiber` (3D Structure moment).

```powershell
pnpm --filter ai-institute add lenis three @react-three/fiber
pnpm --filter ai-institute add -D @types/three
```

(`@react-three/fiber` v9 targets React 19 — matches repo React 19.)

Verify: `npx tsc --noEmit` (workspace root tsconfig covers app), `npx eslint apps/ai-institute/src` → 0 new errors.
Commit: `chore(home): add lenis, three, @react-three/fiber`

---

## Task 3 — `homepage-story.ts` data module (TDD)

Files:

- `apps/ai-institute/src/lib/homepage-story.ts` (new)
- `apps/ai-institute/src/lib/__tests__/homepage-story.test.ts` (new)

Red → green:

```ts
// __tests__/homepage-story.test.ts
import { describe, it, expect } from "vitest";
import { STORY_CHAPTERS, STORY_PROOF, HERO_BEATS } from "../homepage-story";

describe("homepage story data", () => {
  it("every proof point carries a source and an allowed verification state", () => {
    const allowed = ["verified", "reported", "pending"] as const;
    expect(STORY_PROOF.length).toBeGreaterThanOrEqual(4);
    for (const p of STORY_PROOF) {
      expect(p.source.length).toBeGreaterThan(0);
      expect(allowed).toContain(p.state);
    }
  });
  it("chapter hrefs are canonical internal routes", () => {
    for (const c of STORY_CHAPTERS) {
      expect(c.href).toMatch(
        /^\/(forest|knowledge|heritage|community|missions)$/,
      );
    }
  });
  it("hero beats cover the ten-beat order start (Promise)", () => {
    expect(HERO_BEATS[0]).toBe("promise");
  });
});
```

Implementation shape (real values only — from existing page + curriculum):

```ts
// apps/ai-institute/src/lib/homepage-story.ts
import { getTotalModules } from "@/data/curriculum-levels";

export type VerificationState = "verified" | "reported" | "pending";

export interface StoryProofPoint {
  value: string;
  label: string;
  source: string;
  state: VerificationState;
}

export const STORY_PROOF: StoryProofPoint[] = [
  {
    value: "8+",
    label: "Hectares restored",
    source: "Brand Constitution · Art. 10",
    state: "reported",
  },
  {
    value: "10K+",
    label: "Students empowered",
    source: "Brand Constitution · Art. 10",
    state: "reported",
  },
  {
    value: "50+",
    label: "Communities engaged",
    source: "Brand Constitution · Art. 10",
    state: "reported",
  },
  {
    value: String(getTotalModules()),
    label: "Curriculum modules",
    source: "Bhavya Academy · curriculum data",
    state: "verified",
  },
];

export interface StoryChapter {
  key: "forest" | "knowledge" | "heritage" | "community";
  index: string;
  label: string;
  line: string;
  href: string;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    key: "forest",
    index: "01",
    label: "Forest",
    line: "Restore living systems. Protect watersheds. Hold the ground for generations.",
    href: "/forest",
  },
  {
    key: "knowledge",
    index: "02",
    label: "Knowledge",
    line: "Open learning for rural India — structured, free, built to endure.",
    href: "/knowledge",
  },
  {
    key: "heritage",
    index: "03",
    label: "Heritage",
    line: "Keep living memory. Document craft, place, and story before they fade.",
    href: "/heritage",
  },
  {
    key: "community",
    index: "04",
    label: "Community",
    line: "Local leadership at the center. Resilience grown from within.",
    href: "/community",
  },
];

export type HeroBeat =
  | "promise"
  | "why"
  | "pillars"
  | "people"
  | "evidence"
  | "knowledge"
  | "heritage"
  | "community"
  | "structure"
  | "invitation";

export const HERO_BEATS: HeroBeat[] = [
  "promise",
  "why",
  "pillars",
  "people",
  "evidence",
  "knowledge",
  "heritage",
  "community",
  "structure",
  "invitation",
];
```

(Note: `/forest` route does not exist — forest href is `/missions` per IA; test regex above allows it.)

Verify (test cycle): `npx vitest run src/lib/__tests__/homepage-story.test.ts` — wait: **root vitest for this app is node env and app-level script exists?** Check `apps/ai-institute/package.json` for `test` script; run `npx vitest run --root apps/ai-institute src/lib/__tests__/homepage-story.test.ts`. Then `npx tsc --noEmit`.
Commit: `feat(home): homepage story data module + tests`

---

## Task 4 — Wire `ProofStrip` verification states (evidence beat)

Files:

- `apps/ai-institute/src/components/editorial/ProofStrip.tsx`
- `apps/ai-institute/src/app/page.tsx`

Steps:

1. Extend `ProofPoint` with optional `state?: "verified" | "reported" | "pending"`.
2. Render state chip under value: `<span className="proof-state proof-state--{state}">{state}</span>` — small uppercase label; CSS uses tokens only.
3. Add `.proof-state` styles to `globals.css` (`.proof-state--verified` → `--color-success`-like token already in tokens.css — check existing semantic tokens first; if none, use `--color-text-muted` for all + `--color-accent` for verified).
4. `page.tsx`: replace inline `proof` array with `STORY_PROOF` import; add `state` to ProofStrip points.

Verify: `npx tsc --noEmit`, `npx eslint apps/ai-institute/src/app/page.tsx apps/ai-institute/src/components/editorial/ProofStrip.tsx`, `pnpm tokens:check`.
Commit: `feat(home): evidence beat with verification states`

---

## Task 5 — `StoryChapter` pinned-scroll component (core of Approach 1)

Files:

- `apps/ai-institute/src/components/site/StoryChapter.tsx` (new)
- `apps/ai-institute/src/app/globals.css` (`.story-chapter*` styles)
- `apps/ai-institute/src/app/page.tsx` (replace `cine-missions` list + `MissionChapter` blocks)

Design (per spec beat table — Practice = 4 pinned chapters):

```tsx
// apps/ai-institute/src/components/site/StoryChapter.tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { TextReveal } from "@/components/motion/TextReveal";
import { EditorialLink } from "@/components/editorial/EditorialLink";

gsap.registerPlugin(ScrollTrigger);

interface StoryChapterProps {
  id: string;
  index: string;
  label: string;
  line: string;
  body: string;
  href: string;
  photo: string;
  alt: string;
  credit: string;
  flip?: boolean;
}

/**
 * One mission as a full-viewport pinned chapter.
 * Photo panel pins; copy scrolls through; reduced-motion → static stacked layout.
 */
export function StoryChapter({
  id,
  index,
  label,
  line,
  body,
  href,
  photo,
  alt,
  credit,
  flip = false,
}: StoryChapterProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.matchMedia("(max-width: 767px)").matches) return;

      gsap.fromTo(
        ref.current.querySelector(".story-chapter-photo"),
        { scale: 1.08 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            pin: ref.current.querySelector(".story-chapter-media"),
            pinSpacing: false,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <section
      id={id}
      ref={ref}
      className={`story-chapter ${flip ? "story-chapter--flip" : ""}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="story-chapter-media">
        <img
          src={photo}
          alt={alt}
          className="story-chapter-photo"
          draggable={false}
        />
        <p className="story-chapter-credit editorial-label">{credit}</p>
      </div>
      <div className="story-chapter-copy container">
        <span className="editorial-label">
          {index} · {label}
        </span>
        <TextReveal>
          <h2
            id={`${id}-heading`}
            className="editorial-heading story-chapter-title"
          >
            {line}
          </h2>
        </TextReveal>
        <p className="story-chapter-body">{body}</p>
        <EditorialLink href={href}>
          Enter {label} <ArrowRight size={14} />
        </EditorialLink>
      </div>
    </section>
  );
}
```

`page.tsx` rewrite of the Practice section (replaces `cine-missions` index list AND the three `MissionChapter` invocations — MissionChapter component itself stays for other pages):

```tsx
import { StoryChapter } from "@/components/site/StoryChapter";
import { STORY_CHAPTERS } from "@/lib/homepage-story";
import { PHOTO } from "@/lib/photos";

const chapterBodies: Record<string, string> = {
  forest: "Watershed restoration, contour planting, and long-horizon stewardship — eight-plus hectares and counting (Brand Constitution · Art. 10).",
  knowledge: "Free, structured learning from first digital literacy through research — progressive curriculum, built to outlast a classroom.",
  heritage: "Craft, place, and story documented while keepers are still here to speak — living knowledge, not museum labels.",
  community: "Local councils and volunteers decide what endures. Outside support serves the village plan, not the reverse.",
};

// inside <main>, after CH 02 (WHY):
{/* ——— CH 03–06: PRACTICE (four pinned chapters) ——— */}
{STORY_CHAPTERS.map((c, i) => (
  <StoryChapter
    key={c.key}
    id={`chapter-${c.key}`}
    index={c.index}
    label={c.label}
    line={c.line}
    body={chapterBodies[c.key]}
    href={c.href}
    photo={PHOTO[c.key === "forest" ? "forest" : c.key === "knowledge" ? "knowledgeBooks" : c.key === "heritage" ? "heritageStone" : "communityLandscape"]}
    alt={...alt per chapter...}
    credit={...credit per chapter...}
    flip={i % 2 === 1}
  />
))}
```

Better: extend `PHOTO` in `photos.ts` with a `chapterPhotos` map so page stays clean:

```ts
export const CHAPTER_PHOTO = {
  forest: PHOTO.forest, // after Task 1
  knowledge: PHOTO.knowledgeBooks,
  heritage: PHOTO.heritageStone,
  community: PHOTO.communityLandscape,
} as const;
```

CSS essentials (tokens only, `100svh` not `vh`):

```css
.story-chapter {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100svh;
}
.story-chapter-media {
  position: relative;
  overflow: hidden;
}
.story-chapter-photo {
  width: 100%;
  height: 100svh;
  object-fit: cover;
}
.story-chapter--flip .story-chapter-media {
  order: 2;
}
@media (max-width: 767px) {
  .story-chapter {
    grid-template-columns: 1fr;
    min-height: 0;
  }
  .story-chapter-photo {
    height: 56svh;
  }
}
@media (prefers-reduced-motion: reduce) {
  /* no pin — GSAP guard already skips; ensure no fixed heights */
}
```

Remove: old `.cine-missions` block, `MissionChapter` imports/usage from `page.tsx` (component remains exported for reuse).

Verify: `npx tsc --noEmit`, `npx eslint apps/ai-institute/src/app/page.tsx apps/ai-institute/src/components/site/StoryChapter.tsx`, `pnpm tokens:check`, `pnpm antislop`.
Commit: `feat(home): four pinned mission chapters (Practice)`

---

## Task 6 — Chapter rail (beat navigator)

Files:

- `apps/ai-institute/src/components/site/ChapterRail.tsx` (new)
- `apps/ai-institute/src/app/globals.css`
- `apps/ai-institute/src/app/page.tsx` (mount inside `<main>` after header)

```tsx
"use client";
import { useEffect, useState } from "react";

const beats = [
  { id: "story", label: "Why" },
  { id: "chapter-forest", label: "Forest" },
  { id: "chapter-knowledge", label: "Knowledge" },
  { id: "chapter-heritage", label: "Heritage" },
  { id: "chapter-community", label: "Community" },
  { id: "evidence", label: "Evidence" },
  { id: "structure", label: "Structure" },
  { id: "invite", label: "Join" },
];

export function ChapterRail() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    beats.forEach((b) => {
      const el = document.getElementById(b.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label="Story chapters" className="chapter-rail">
      <ol>
        {beats.map((b) => (
          <li key={b.id}>
            <a href={`#${b.id}`} className={active === b.id ? "is-active" : ""}>
              <span className="chapter-rail-dot" aria-hidden="true" />
              <span className="chapter-rail-label">{b.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

CSS: fixed right edge, vertical, hidden below 1024px; active dot uses `--color-accent` (gold); no motion beyond opacity (reduced-motion safe). Anchors need `scroll-margin-top: 72px` on chapter sections (header height).

Verify: tsc/eslint/tokens:check.
Commit: `feat(home): chapter rail navigator`

---

## Task 7 — Ten-beat narrative completion in `page.tsx`

Reorder/complete `page.tsx` to the spec's ten beats. Current file has 9 chapters; required changes:

1. **Evidence section**: give `id="evidence"` (rail target), use `STORY_PROOF` (Task 4).
2. **Knowledge stat moment**: inside/after knowledge chapter add count-up on `String(moduleCount)` using existing `ScrollReveal` + `useEffect` counter — or keep ProofStrip value (simpler). Spec allows stat in evidence beat; keep ProofStrip as the stat moment, add `aria-label` with final value so SR reads final number, not animated ticks.
3. **NEW: Structure beat** (`id="structure"`) — dark forest section: typographic pillar diagram (4 columns of pure type: FOREST / KNOWLEDGE / HERITAGE / COMMUNITY with rule lines) + lazy 3D sphere (Task 8).
4. **Bhavya OS panel** — existing `bhavya-os` content (live page has it; check working tree page — currently absent after parallel-session rewrite). Re-add as dark panel between structure and invitation using existing classes (`.os-*` in globals.css if present — grep first; if removed, rebuild minimal dark panel with tokens).
5. **Invitation**: add `id="invite"` to `cine-invite`.
6. **People beat**: keep `chapter-people` (reserved-plate honesty, no stock faces).

Order: Hero(promise) → Why → Practice×4 → Evidence → Structure(+OS) → Invitation.

Verify: tsc/eslint/tokens/antislop.
Commit: `feat(home): complete ten-beat narrative structure`

---

## Task 8 — 3D Structure moment (`PillarSphere`)

Files:

- `apps/ai-institute/src/components/three/PillarSphere.tsx` (new)
- `apps/ai-institute/src/app/page.tsx` (dynamic import)

```tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function FiberPoints() {
  const ref = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 1200;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  // slow rotation via useFrame would be added; static under reduced-motion
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.02} color="#c9a94e" transparent opacity={0.85} />
    </points>
  );
}

export default function PillarSphere() {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <FiberPoints />
    </Canvas>
  );
}
```

Wire-up in `page.tsx` Structure section:

```tsx
const PillarSphere = dynamic(() => import("@/components/three/PillarSphere"), {
  ssr: false,
  loading: () => <div className="structure-3d-fallback" aria-hidden="true" />,
});
```

Guards: wrap in WebGL-support check (`canvas.getContext("webgl2") || webgl`) — if unavailable render typographic-only; `prefers-reduced-motion` → render static frame (no useFrame loop). Lazy: `next/dynamic` + `loading` skeleton. Frame budget: sphere in its own section, pauses when offscreen (`frameloop="demand"` or intersection pause — simplest: `frameloop` default but section is short; acceptable for MVP, note in code).

Verify: tsc/eslint/tokens.
Commit: `feat(home): structure 3D fibre sphere with fallbacks`

---

## Task 9 — Lenis smooth scroll

Files:

- `apps/ai-institute/src/components/SmoothScroll.tsx` (new)
- `apps/ai-institute/src/app/layout.tsx` (mount beside `MotionProvider`)
- `apps/ai-institute/src/app/globals.css` (lenis base CSS)

```tsx
"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}
```

```css
/* globals.css — lenis base */
html.lenis,
html.lenis body {
  height: auto;
}
.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}
.lenis.lenis-stopped {
  overflow: hidden;
}
```

Mount: `<SmoothScroll><MotionProvider>{children}</MotionProvider></SmoothScroll>` in `layout.tsx`.
Anchor links (`#story`, rail `#` links) must still work — Lenis handles same-page hash if `anchors: true` option; set `new Lenis({ lerp: 0.12, anchors: true })`.

Verify: tsc/eslint.
Commit: `feat(home): lenis smooth scroll with reduced-motion bypass`

---

## Task 10 — Reduced-motion static pass + polish

Steps:

1. Grep `page.tsx` + new components for motion props; confirm every GSAP guard checks `prefers-reduced-motion` (StoryChapter ✓, ScrubParallax ✓, HeroEntrance/ScrollReveal/TextReveal — verify each file).
2. Confirm hero uses `100svh`; replace any `vh` in new CSS.
3. Add Uiverse-derived press micro-interaction: `.btn:active { transform: scale(0.97); }` + transition — tokens only.
4. Frosted header already exists (`SiteHeader` `scrolled` after 20px) — verify `.site-nav.scrolled` uses tokenized backdrop.
5. Check focus-visible outlines on rail + mission rows.

Verify: `npx tsc --noEmit`, `npx eslint apps/ai-institute/src`, `pnpm tokens:check`, `pnpm antislop`, `pnpm file-map`, `pnpm drift:check`.
Commit: `feat(home): reduced-motion static story + micro-interactions`

---

## Task 11 — Light gates + PR packaging

1. Full light-gate sweep (record evidence):
   ```powershell
   npx tsc --noEmit; echo "tsc exit $LASTEXITCODE"
   npx eslint apps/ai-institute/src; echo "eslint exit $LASTEXITCODE"
   pnpm tokens:check
   pnpm antislop
   pnpm file-map
   pnpm drift:check
   git diff --check
   ```
2. `git status` — stage **this plan's files only** plus the previously-approved parallel-session integration set (see session agreement: their untracked components + homepage runtime deps). Do NOT include unrelated auth/config files. `git diff --stat` review.
3. Commit staged set: `feat(home): cinematic homepage rebuild (Approach 1)`.
4. Push: `git push -u origin build/bhavya-os-foundation`.
5. `gh pr create --base master --title "feat(home): cinematic homepage rebuild" --body <summary+spec link>`.
6. Watch CI: `gh pr checks --watch` (antislop+lint+typecheck, test, secret-scan, build).
7. Merge: `gh pr merge <n> --merge` (merge commit to `master`).
8. Watch deploy: `gh run watch` for `deploy-cloudflare.yml` run triggered by master push.

Note: `deploy.yml` targets `main` — ignore (known wiring mismatch, do not "fix").

---

## Task 12 — Playwright live verification + deliver

1. Navigate `https://bhavya-foundation.thebhavyafoundation.workers.dev/`.
2. Assertions:
   - Hero: "Building for Generations." renders, photo loads, no CLS shift on hero.
   - Scroll through all 10 beats; each section heading visible; chapter rail highlights.
   - Four story chapters pin/release correctly (desktop 1440×900).
   - Evidence shows 4 proof points with state chips.
   - Structure 3D renders (or fallback shows); no WebGL console errors.
   - Mobile 390×844: no horizontal scroll, chapters stack, rail hidden.
   - Reduced-motion emulation: complete static story, no scrub.
   - Console: no errors; all photos 200.
3. Screenshots: desktop hero, mid-chapter pinned, evidence, structure, invitation; mobile top+mid.
4. Report: link + screenshot paths + any deviations for user approval/feedback.

No code change without returning to spec.
