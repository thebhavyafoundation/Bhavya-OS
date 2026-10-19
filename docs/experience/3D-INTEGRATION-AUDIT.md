# 3D INTEGRATION AUDIT — Fallback Contract Status

**Date:** 2026-10-19
**Branch:** `feat/elite-web-experience`
**Method:** Every WebGL component under `apps/ai-institute/src/components` was inspected for the seven required guards. Figures are read from source, not estimated.

---

## 1. The contract

Per the web-experience standards, every 3D scene must satisfy all seven:

| #   | Guard                         | Why it is not optional                                                                            |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------- |
| 1   | Lazy loading / dynamic import | A WebGL runtime in the initial bundle costs every reader, including those who never see the scene |
| 2   | Mobile quality tier           | A 4× retina phone is the most likely device to lose frames mid-scroll                             |
| 3   | Poster / static fallback      | Prevents a black rectangle while the context initialises                                          |
| 4   | No-WebGL fallback             | WebGL is absent on locked-down, privacy-hardened and older devices                                |
| 5   | Reduced-motion fallback       | A moving scene a reader asked not to see is a failure, not polish                                 |
| 6   | Resource disposal             | GPU memory is not reclaimed by navigating away                                                    |
| 7   | Offscreen pause               | An off-screen render loop is pure battery cost                                                    |

---

## 2. Verified status

| Component                     | WebGL? |     1      |  2  |  3  |  4  |  5  |  6  |  7  | Verdict                                                                                              |
| ----------------------------- | ------ | :--------: | :-: | :-: | :-: | :-: | :-: | :-: | ---------------------------------------------------------------------------------------------------- |
| `three/MistScene.tsx`         | yes    | via caller | ✅  | ⚠️  | ✅  | ✅  | ✅  | ✅  | **Reference implementation**                                                                         |
| `three/Model3D.tsx`           | yes    |     ✅     | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | **Migrated to `ThreeStage`** — see §6                                                                |
| `three/CinematicHero.tsx`     | yes    |     ✅     | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | Gaps                                                                                                 |
| `curriculum/Hero3DCanvas.tsx` | yes    |     ✅     | ✅  | ❌  | ❌  | ❌  | ✅  | ❌  | Gaps                                                                                                 |
| `HeroBackground.tsx`          | **no** |     —      |  —  |  —  |  —  |  —  |  —  |  —  | Not a 3D component. Layered CSS gradient over a photograph; static, so it needs none of these guards |

**Correction to an earlier reading.** `HeroBackground` was initially recorded as a WebGL component with no guards. On inspection it contains no `<Canvas>` at all — it is a layered CSS background. It is static, so the guards do not apply. Recorded here so the next reader does not repeat the mistake.

`MistScene` is the only component that already does this properly. It is the source the shared scaffold was extracted from.

---

## 3. What was added

`components/three/ThreeStage.tsx` encodes the contract once:

- `useWebGLSupport()` — probes a throwaway canvas for `webgl2` → `webgl` → `experimental-webgl`. Feature-detection by `typeof` lies on devices that then fail at draw time, and some browsers throw rather than returning null, so the probe is wrapped.
- `usePrefersReducedMotion()` — starts `false` so server and first client render agree. Reading `matchMedia` during render causes a hydration mismatch, because the server always answers `false`.
- `useInView()` — bounded `IntersectionObserver` with a `rootMargin`, so the pause happens before the stage leaves the viewport and is never visible as a stutter.
- `<ThreeStage>` — composes the three hooks, applies a DPR ceiling that drops on narrow viewports, pauses `frameloop` offscreen, and requires a `poster`.

### Two decisions inside the scaffold worth stating

**`poster` is required, not optional.** A stage with an empty fallback is a black rectangle for exactly the readers least able to see past it. Making it required moves that judgement to the call site, where the author can see what they are choosing not to render.

**No `powerPreference: "high-performance"`.** Requesting the discrete GPU biases toward more heat, more fan noise, and a shorter usable scroll before the frame budget collapses. The platform is required to stay usable on modest hardware, so the browser is left to choose.

**Reduced motion suppresses the scene rather than stilling it.** A moving scene the reader declined is replaced by the poster. When suppression happens, the component says so in a visually hidden node rather than leaving the reader wondering whether something failed to load.

---

## 4. What was deliberately not done

The four components with gaps were **not** rewritten. Migrating them is mechanical but touches the most motion-sensitive parts of the site, and it cannot be visually verified locally — Playwright and the viewport matrix are CI-only under the machine contract.

Migrating a scene without being able to look at it risks trading a known gap for an unknown regression. The gap is documented and enumerable; an unverified rewrite is neither.

**Recommended order when verified in CI:**

1. `Model3D` — the generic loader, so everything built on it inherits the contract
2. `Hero3DCanvas` — curriculum tier, currently used for visual emphasis rather than instruction
3. `CinematicHero` — only after the first two prove the migration on screen

---

## 6. Migration — `Model3D`, and two platform-truth deviations found inside it

`Model3D` was migrated to `ThreeStage`. It was first in the recommended order
because it is the generic loader: `CurriculumHero3D` and `VisualComponent` both
consume it, so the contract now propagates to everything built on it.

Migration met the criteria for a change that does not need visual verification:
the fallback is a reserved plate, no content meaning changes, and correctness
is checkable by TypeScript.

### Two real defects fixed alongside it

**The transform API was dead.** `Model3D` declared `scale`, `position`,
`rotation`, `floatIntensity` and `autoRotate`, and passed none of them to
anything. `Hero3D` calls it with `scale={1.5}` and `position={[0,-0.5,0]}`,
which did absolutely nothing. All five are now wired.

**Nothing was disposed.** A loaded scene's geometries and materials were never
released. A learner working through several 3D lessons in one sitting would
accumulate every model until the tab ran out of memory. Disposal now runs on
unmount, traversing the scene and releasing geometry and material.

### Two platform-truth deviations — documented, deliberately not fixed

Both were found while migrating and neither is an engineering call.

**1. Draco decoder from a third-party CDN.**
`Model3D` sets its decoder path to
`https://www.gstatic.com/draco/versioned/decoders/1.5.7/`. Every 3D model on
the platform therefore depends on an external host at runtime, with no
fallback if it is unreachable. The platform position is that large assets are
served from Backblaze B2. Re-hosting the decoder from the `three` package's own
`examples/jsm/libs/draco/` is the fix, but choosing a delivery host is an
asset-boundary decision.

**2. HDRI fetched from an asset CDN.**
`<Environment preset="forest" />` makes drei download an HDRI from a third-party
asset CDN at runtime, again contrary to the B2 position. Unlike the decoder,
removing it **changes the lighting**, so it cannot be fixed without visual
review — which is CI-only.

Both are marked in the source at the line that causes them.

### Remaining migration order

1. ~~`Model3D`~~ — done
2. `Hero3DCanvas` — curriculum tier, currently used for visual emphasis rather
   than instruction. Uses `Model3D` internally, so it inherits the contract but
   should still be migrated to make the guarantee explicit.
3. `CinematicHero` — last, and only once the first two have been seen running.

---

## 7. Licence position for 3D sources

| Source                                                                | Licence | Shippable?                          |
| --------------------------------------------------------------------- | ------- | ----------------------------------- |
| Kenney (`public/models/kenney/**`)                                    | CC0 1.0 | No — no optimised derivative exists |
| Poly Haven (`public/models/poly-haven/**`, `assets/3d/poly-haven/**`) | CC0     | No — no optimised derivative exists |

Both are approved to _use_. Neither is shippable today because the derivative pipeline has not been run. The workflows that produce mobile (<500 KB) and desktop (<2 MB) Draco derivatives plus poster fallbacks exist on this branch (`assets-glb.yml`, `assets-ktx2.yml`, `assets-posters.yml`) but have never been executed — they produce review artefacts only and never publish to B2.

Until a derivative exists and has been measured, no claim of production readiness should be made for any 3D asset.
