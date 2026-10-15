# Front-Design Workspace – Agent Instructions

Scope: `design/front-design/` only. Design authority: `design/CONTEXT.md`. Tokens: `packages/platform-ui/src/styles/tokens.css`. No top-level hubs. No duplicate registries.

## Mission

Upgrade `apps/ai-institute/` (canonical host) into a restrained, editorial, premium storytelling experience:

- Cinematic background-integrated imagery with typography overlay, layered depth, scroll-driven pacing
- Selective 3D/WebGL moments serving intent, not decoration
- Serif + sans composition (Playfair Display + Inter via tokens)
- Calm institutional / ecological aesthetic (forest / ivory / gold / sage / earth)
- Low memory / GPU overhead for i5 / 8 GB target

## Hardware Safety — Non-Negotiable

Target: 8 GB RAM / i5 (control center is i3-1215U, 7.7 GB).

- No concurrent heavy jobs: one dev server at a time. Never run `pnpm build`, `turbo build`, `next build`, `opennextjs-cloudflare build`, or full `pnpm test` locally — CI only (`contract with the user`).
- Never batch-generate large 3D/texture directories.
- WebGL never touches first paint. Init via IntersectionObserver with +200px buffer.
- Offscreen scenes: `cancelAnimationFrame` + `geometry.dispose()` / `material.dispose()` / `texture.dispose()` on unmount/hide.
- DPR cap: `Math.min(window.devicePixelRatio, 1.5)`.
- Reduced motion: if `prefers-reduced-motion: reduce` or low-power device, keep static fallback, skip WebGL.

```ts
if (
  isLowPowerDevice ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  return; // preserve static fallback
}
```

## Design Authority & Constraints

- `design/CONTEXT.md` is sole design authority. `packages/platform-ui/` is sole implementation.
- Imagery rule: no standalone image blocks for hero/constitution/mission. Images live as background layers (CSS `background-image` + token overlay/scrim) with editorial typography on top (`--font-display` Playfair + `--font-sans` Inter). Ensure WCAG AA contrast via scrim, responsive focal point, `prefers-reduced-motion` safe.
- All docs live under `design/front-design/docs/`. Do not invent `workspace/` or app-level `lib/storyConfig.ts` until an RFC creates it in the target app.
- Anti-patterns: AI gradient blobs, purple/blue SaaS buttons, global glassmorphism, dense dashboard grids, decorative floating 3D, perpetual fullscreen WebGL behind long scroll.

## Stack (use what exists — no new deps without RFC)

Already in `apps/ai-institute/package.json`: `lenis`, `gsap` + `@gsap/react`, `three` + `@react-three/fiber`, `framer-motion`.

- Tier 1: native CSS/HTML (transforms, sticky, IntersectionObserver)
- Tier 2: Lenis smooth-scroll sync
- Tier 3: GSAP ScrollTrigger pinning / parallax
- Tier 4: selective lazy WebGL (Three/R3F), viewport-gated

Not approved by default: ScrollMagic (legacy/unmaintained), OGL, Curtains.js — requires RFC + justification per `Avoid unnecessary dependencies`.

Lazy3D pattern: static poster → observer → `await import('./Scene.js')` → safety check → mount → teardown/dispose.

## Binaries & Free-Tier Rule

- Git binaries: logos/icons only via `assets/manifest.json` (<200 KB each); test GLBs <1 MB only.
- Large assets: URL reference only (public CDN or Cloudflare R2). Registry: `design/front-design/docs/asset-sources.md` — all entries currently `pending verification`; placeholders are not canonical.
- Free sources only (CC0 / free commercial use, verify per-asset page): Unsplash, Pexels, Pixabay, Burst; Poly Haven (CC0), OpenSource3DAssets, Khronos glTF samples, Smithsonian Open Access. No paid stock / Images plans.
- Infra: `opencode.json` already configures remote Cloudflare MCP (cloudflare, bindings, builds, observability). Do not add local `mcp-server-cloudflare` duplicate. No `npx skills add` without human approval.

## Execution Stages (planned, not yet executed)

- P0 Visual foundation: audit routes per `CANONICAL_ROUTE_MAP.md`, apply token grid/type, remove clutter.
- P1 Motion: Lenis + ScrollTrigger reveals/pinning, `prefers-reduced-motion` safe.
- P2 One lazy 3D prototype in `apps/ai-institute/` from verified CC0 GLB, DPR ≤1.5, dispose clean, 60fps on i5/8GB.
- P3 Validate memory/frames; second element only if zero leaks + low CPU.

## Checkpoint Report

At each step output:

```text
CHANGED: files/modules updated
VERIFIED: perf/responsive/memory checks with command evidence
BLOCKED: items needing human decision
NEXT: immediate next task
```

Verification order: `pnpm typecheck` → `pnpm lint` → scoped `pnpm test` → `git diff --check` → `git status`. Heavy builds on CI.
