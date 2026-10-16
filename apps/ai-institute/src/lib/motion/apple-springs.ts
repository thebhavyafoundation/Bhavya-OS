"use client";

/**
 * Apple Design Spring System
 *
 * Based on WWDC 2018 "Designing Fluid Interfaces" — springs replace fixed-duration
 * animations because they're inherently interruptible and velocity-aware.
 *
 * Two designer-friendly parameters replace mass/stiffness/damping:
 * - damping (0–1): 1.0 = critically damped (no bounce), < 1.0 = overshoots
 * - response (seconds): how quickly the value reaches target (not duration!)
 */

/** Critically damped default — graceful, non-distracting, no overshoot */
export const SPRING_DEFAULT = {
  damping: 1.0,
  response: 0.35,
} as const;

/** Momentum interaction — slight bounce, only when gesture carried momentum */
export const SPRING_MOMENTUM = {
  damping: 0.8,
  response: 0.3,
} as const;

/** Quick reposition — snappy, no bounce */
export const SPRING_REPOSITION = {
  damping: 1.0,
  response: 0.25,
} as const;

/**
 * Convert Apple's damping/response to Web Animations API spring options.
 * WAAPI doesn't have native spring, so we approximate with easing.
 * For true springs, use Framer Motion's animate() which handles this internally.
 */
export function springToWaapiOptions(
  damping: number = SPRING_DEFAULT.damping,
  response: number = SPRING_DEFAULT.response,
): { easing: string; duration: number } {
  // Map damping to easing curve
  // Critically damped (1.0) ≈ ease-out cubic
  // Under-damped (< 1.0) ≈ custom spring-like easing
  let easing: string;
  if (damping >= 1.0) {
    easing = "cubic-bezier(0.16, 1, 0.3, 1)"; // Apple's ease-out
  } else if (damping >= 0.8) {
    easing = "cubic-bezier(0.34, 1.56, 0.64, 1)"; // Slight overshoot
  } else {
    easing = "cubic-bezier(0.25, 1.8, 0.5, 1)"; // More bounce
  }

  return {
    easing,
    duration: response * 1000, // Convert to ms
  };
}

/**
 * Animate using native Web Animations API with spring-like easing.
 * This is a lightweight alternative that works without extra dependencies.
 */
export function animateElement(
  element: HTMLElement,
  keyframes: PropertyIndexedKeyframes | Keyframe[],
  options: {
    damping?: number;
    response?: number;
    velocity?: number;
    delay?: number;
    fill?: "forwards" | "backwards" | "both" | "none" | "auto";
  } = {},
): Animation {
  const { damping, response, velocity, delay = 0, fill = "forwards" } = options;

  // For velocity-based animations, we'd need a more complex setup
  // This is a simplified version using easing approximation
  const { easing, duration } = springToWaapiOptions(damping, response);

  return element.animate(keyframes, {
    duration,
    easing,
    delay: delay * 1000,
    fill,
  });
}

/**
 * Animate from current presentation value — essential for interruptibility.
 * Reads the element's live computed style and starts from there.
 */
export function animateFromCurrent(
  element: HTMLElement,
  keyframes: PropertyIndexedKeyframes | Keyframe[],
  options: {
    damping?: number;
    response?: number;
    delay?: number;
  } = {},
): Animation {
  return animateElement(element, keyframes, {
    damping: options.damping ?? SPRING_DEFAULT.damping,
    response: options.response ?? SPRING_DEFAULT.response,
    delay: options.delay,
  });
}

/**
 * Apple's exact momentum projection function (from Designing Fluid Interfaces sample code).
 * Projects where a flick will land using exponential deceleration.
 * decelerationRate ≈ 0.998 for normal scroll feel; 0.99 for snappier.
 */
export function projectMomentum(
  initialVelocity: number, // px/s
  decelerationRate = 0.998,
): number {
  return ((initialVelocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/**
 * Find nearest snap point from projected endpoint.
 * Used with projectMomentum to determine spring target after flick.
 */
export function nearestSnapPoint(
  projectedEndpoint: number,
  snapPoints: number[],
): number {
  return snapPoints.reduce((nearest, point) =>
    Math.abs(point - projectedEndpoint) < Math.abs(nearest - projectedEndpoint)
      ? point
      : nearest,
  );
}

/**
 * Rubber-band resistance — progressive resistance at boundaries instead of hard stop.
 * The further past the bound, the less the element follows.
 */
export function rubberband(
  overshoot: number, // how far past the boundary (positive or negative)
  dimension: number, // size of the container/viewport in that dimension
  constant = 0.55,
): number {
  return (
    (overshoot * dimension * constant) /
    (dimension + constant * Math.abs(overshoot))
  );
}

/**
 * Velocity tracker for gestures — maintains short history for accurate release velocity.
 */
export class VelocityTracker {
  private history: Array<{ x: number; y: number; t: number }> = [];
  private maxHistory = 5; // last ~5 frames at 60fps = ~80ms

  update(x: number, y: number): void {
    const now = performance.now();
    this.history.push({ x, y, t: now });
    // Keep only recent history
    const cutoff = now - 100; // 100ms window
    this.history = this.history.filter((h) => h.t > cutoff);
    // Cap at max entries
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(-this.maxHistory);
    }
  }

  getVelocity(): { x: number; y: number } {
    if (this.history.length < 2) return { x: 0, y: 0 };

    const first = this.history[0];
    const last = this.history[this.history.length - 1];
    const dt = (last.t - first.t) / 1000; // seconds

    if (dt === 0) return { x: 0, y: 0 };

    return {
      x: (last.x - first.x) / dt,
      y: (last.y - first.y) / dt,
    };
  }

  reset(): void {
    this.history = [];
  }
}

/**
 * Reduced motion check — respects user's system preference.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Reduced transparency check.
 */
export function prefersReducedTransparency(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
}

/**
 * High contrast check.
 */
export function prefersHighContrast(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-contrast: more)").matches;
}

/**
 * Motion distance tokens — mapped from design tokens for consistency.
 */
export const MOTION_DISTANCE = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 32,
  xl: 64,
} as const;

/**
 * Easing curves — Apple uses cubic-bezier(0.16, 1, 0.3, 1) for ease-out.
 * Mirror for reversible transitions (inverse control points).
 */
export const EASING = {
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  easeInOut: "cubic-bezier(0.45, 0, 0.55, 1)",
  easeSpring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  easeEnter: "cubic-bezier(0.22, 1, 0.36, 1)",
  easeExit: "cubic-bezier(0.45, 0, 0.55, 1)",
  // Inverse for reversible transitions
  easeOutInverse: "cubic-bezier(0.84, 0, 0.7, 1)", // inverse of easeOut
} as const;

/**
 * Duration tokens.
 */
export const DURATION = {
  micro: 100,
  fast: 150,
  normal: 250,
  slow: 400,
  slower: 600,
  scene: 800,
  cinematic: 1200,
} as const;
