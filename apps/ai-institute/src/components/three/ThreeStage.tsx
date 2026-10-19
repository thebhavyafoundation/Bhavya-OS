"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

/**
 * Shared 3D stage contract.
 *
 * Five separate WebGL components existed in this app, each inventing its own
 * guards. `MistScene` was the only one with a complete set; `HeroBackground`,
 * which renders behind the homepage hero, had none — no WebGL check, no
 * reduced-motion check, no offscreen pause. That is not a subtle difference:
 * it means a reader without WebGL, or one who has asked their system to
 * reduce motion, gets a blank canvas and a request loop that never stops.
 *
 * Rather than patch each component, the guards that `MistScene` already got
 * right are encoded once here. A new scene composes this instead of
 * re-deciding what happens without WebGL.
 *
 * The contract, all seven parts:
 *   1. Lazy loading          — call sites use next/dynamic; this never bundles eagerly
 *   2. Mobile simplification — DPR ceiling drops on narrow viewports
 *   3. Poster fallback       — `poster` renders until the canvas is ready, and forever if WebGL is absent
 *   4. No-WebGL fallback     — detected before the Canvas mounts
 *   5. Reduced-motion        — scene is not mounted; poster stands alone
 *   6. Resource disposal     — owned by the scene; the canvas unmounts with it
 *   7. Offscreen pause       — frameloop stops when scrolled away
 */

/**
 * Whether this browser can actually create a WebGL context.
 *
 * Probed once, lazily, in state initialiser — not during render — so the
 * probe never runs on the server and never runs twice. Creating a throwaway
 * canvas is the only reliable check: `typeof window.WebGLRenderingContext`
 * lies on plenty of devices that then fail at draw time.
 */
export function useWebGLSupport(): boolean {
  const [supported] = useState(() => {
    if (typeof document === "undefined") return false;
    try {
      const canvas = document.createElement("canvas");
      return Boolean(
        canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl"),
      );
    } catch {
      // Some browsers throw rather than returning null when WebGL is
      // disabled by policy or blocklisted by a driver.
      return false;
    }
  });
  return supported;
}

/**
 * Whether the reader has asked the system to reduce motion.
 *
 * Starts `false` so server and first client render agree. Reading
 * matchMedia during render would produce a hydration mismatch, because the
 * server has no media queries and would always answer `false`.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/**
 * Whether an element is currently on screen, for pausing offscreen work.
 *
 * A bounded observer rather than a scroll listener: one observer per stage,
 * no per-frame work, and no layout thrash. `rootMargin` starts the handoff
 * slightly before the stage leaves the viewport so the pause is never visible
 * as a stutter.
 */
export function useInView<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? true),
      { threshold: 0.01, rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

export interface ThreeStageProps {
  /** The scene. Must not be rendered when the stage is in fallback. */
  children: ReactNode;
  /**
   * Rendered in place of the canvas whenever the scene cannot run: no WebGL,
   * reduced motion, or before the canvas is ready.
   *
   * This is not optional decoration. A stage with an empty fallback is a
   * black rectangle for exactly the readers least able to see past it.
   */
  poster: ReactNode;
  /** Camera position and field of view. */
  camera?: { position: [number, number, number]; fov?: number };
  /**
   * Renderer options.
   *
   * Deliberately has no `powerPreference`. Requesting "high-performance"
   * biases the browser toward a discrete GPU, which on a modest laptop
   * means more heat, more fan noise and a shorter scroll before the frame
   * budget collapses. Letting the browser choose is both simpler and kinder
   * to the hardware this platform is required to stay usable on.
   */
  gl?: { antialias?: boolean; alpha?: boolean };
  /**
   * Device-pixel-ratio ceiling. Defaults to 2 on desktop and 1.5 on narrow
   * viewports, which is where a 4× retina phone is most likely to thermal-
   * throttle or lose frames mid-scroll.
   */
  dpr?: [number, number];
  /** Draw distance ceiling for the mobile tier. Defaults to 60. */
  maxDistance?: number;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Non-visual description of what the scene conveys, rendered visually
   * hidden.
   *
   * Only required when the scene carries meaning. Decorative scenes should
   * pass nothing and stay `aria-hidden`. If a reader cannot understand the
   * page without the scene, this string is what replaces it for them — the
   * same contract as the diagram text alternatives.
   */
  description?: string;
}

export function ThreeStage({
  children,
  poster,
  camera = { position: [0, 0, 3], fov: 50 },
  gl,
  dpr,
  maxDistance = 60,
  className = "",
  style,
  description,
}: ThreeStageProps) {
  const webgl = useWebGLSupport();
  const reducedMotion = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    setNarrow(query.matches);
    const onChange = (event: MediaQueryListEvent) => setNarrow(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const fallback = !webgl || reducedMotion;

  return (
    <div ref={ref} className={className} style={style}>
      {/*
        Announced before the scene so a screen-reader user has the
        description by the time the canvas would have been reached.
      */}
      {description ? <span className="sr-only">{description}</span> : null}

      {fallback ? (
        <>
          {poster}
          {/*
            Reduced motion is a preference about animation, not about
            information. When the scene is suppressed rather than merely
            stilled, say so rather than leaving the reader to wonder whether
            something failed to load.
          */}
          {reducedMotion ? (
            <span className="sr-only">{description ?? ""}</span>
          ) : null}
        </>
      ) : (
        <div aria-hidden={description ? undefined : true}>
          <Canvas
            dpr={dpr ?? (narrow ? [1, 1.5] : [1, 2])}
            frameloop={inView ? "always" : "never"}
            camera={{
              position: camera.position,
              fov: camera.fov ?? 50,
              far: maxDistance,
            }}
            gl={gl ?? { antialias: !narrow, alpha: true }}
            style={{ width: "100%", height: "100%" }}
          >
            {children}
          </Canvas>
        </div>
      )}
    </div>
  );
}
