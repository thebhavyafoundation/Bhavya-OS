"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Performance guardrails for 2026 compliance
 * - INP-aware animations (transform/opacity only)
 * - prefers-reduced-motion compliance
 * - Core Web Vitals monitoring
 * - Lazy loading & code splitting helpers
 */

// ============================================
// INP-Aware Animation Primitives
// ============================================

/**
 * Safe transform properties that don't trigger layout
 */
export const SAFE_TRANSFORM_PROPS = [
  "transform",
  "opacity",
  "filter",
  "clip-path",
] as const;

/**
 * Check if an animation property is INP-safe
 */
export function isINPSafe(property: string): boolean {
  return (SAFE_TRANSFORM_PROPS as readonly string[]).includes(property);
}

/**
 * Create INP-safe keyframes (transform/opacity only)
 */
export function createSafeKeyframes(
  from: Record<string, string | number>,
  to: Record<string, string | number>,
): Keyframe[] {
  const safeFrom: Record<string, string | number> = {};
  const safeTo: Record<string, string | number> = {};

  Object.entries(from).forEach(([key, value]) => {
    if (isINPSafe(key)) safeFrom[key] = value;
  });
  Object.entries(to).forEach(([key, value]) => {
    if (isINPSafe(key)) safeTo[key] = value;
  });

  return [safeFrom, safeTo];
}

/**
 * GPU-accelerated animation options
 */
export const GPU_ACCELERATED_OPTIONS: KeyframeAnimationOptions = {
  duration: 400,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  fill: "forwards",
};

// ============================================
// Reduced Motion Compliance
// ============================================

/**
 * Hook to detect and respond to prefers-reduced-motion
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}

/**
 * Apply reduced motion fallbacks to element
 */
export function applyReducedMotionFallback(element: HTMLElement): void {
  element.style.animation = "none";
  element.style.transition = "none";
  element.style.transform = "none";
  element.style.opacity = "1";
  element.style.clipPath = "none";
}

// ============================================
// Core Web Vitals Monitoring
// ============================================

interface WebVitals {
  LCP?: number;
  INP?: number;
  CLS?: number;
  FCP?: number;
  TTFB?: number;
}

interface VitalsThresholds {
  LCP: { good: number; poor: number };
  INP: { good: number; poor: number };
  CLS: { good: number; poor: number };
  FCP: { good: number; poor: number };
  TTFB: { good: number; poor: number };
}

export const VITALS_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
} as const;

/**
 * Get rating for a vital
 */
export function getVitalRating(
  vital: keyof typeof VITALS_THRESHOLDS,
  value: number,
): "good" | "needs-improvement" | "poor" {
  const thresholds = VITALS_THRESHOLDS[vital];
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.poor) return "needs-improvement";
  return "poor";
}

/**
 * Hook to monitor Core Web Vitals
 */
export function useWebVitals(
  onReport?: (vitals: WebVitals) => void,
  sampleRate = 1.0,
): WebVitals {
  const vitalsRef = useRef<WebVitals>({});

  useEffect(() => {
    if (Math.random() > sampleRate) return;

    // LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      vitalsRef.current.LCP = lastEntry.startTime;
      checkAndReport();
    }).observe({ type: "largest-contentful-paint", buffered: true });

    // INP (using Event Timing API)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (
          entry.entryType === "event" &&
          entry.duration > (vitalsRef.current.INP || 0)
        ) {
          vitalsRef.current.INP = entry.duration;
        }
      });
      checkAndReport();
    }).observe({ type: "event", buffered: true });

    // CLS
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const shift = entry as PerformanceEntry & {
          hadRecentInput?: boolean;
          value?: number;
        };
        if (!shift.hadRecentInput) {
          clsValue += shift.value ?? 0;
        }
      });
      vitalsRef.current.CLS = clsValue;
      checkAndReport();
    }).observe({ type: "layout-shift", buffered: true });

    // FCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find((e) => e.name === "first-contentful-paint");
      if (fcpEntry) {
        vitalsRef.current.FCP = fcpEntry.startTime;
        checkAndReport();
      }
    }).observe({ type: "paint", buffered: true });

    function checkAndReport() {
      if (onReport) {
        onReport({ ...vitalsRef.current });
      }
    }
  }, [onReport, sampleRate]);

  return vitalsRef.current;
}

// ============================================
// Lazy Loading & Code Splitting
// ============================================

/**
 * IntersectionObserver-based lazy loader
 */
export function useLazyLoad(
  options: {
    rootMargin?: string;
    threshold?: number;
    triggerOnce?: boolean;
  } = {},
): { ref: React.RefObject<HTMLElement | null>; isVisible: boolean } {
  const { rootMargin = "100px", threshold = 0, triggerOnce = true } = options;
  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return { ref: elementRef, isVisible };
}

/**
 * Debounce helper for scroll/resize handlers
 */
export function debounce<T extends (...args: never[]) => unknown>(
  fn: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), wait);
  };
}

/**
 * Throttle helper for high-frequency events
 */
export function throttle<T extends (...args: never[]) => unknown>(
  fn: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * RequestAnimationFrame-based scroll handler
 */
export function useRAFScrollHandler(
  handler: (scrollY: number, deltaY: number) => void,
  dependencies: React.DependencyList = [],
): void {
  const lastY = useRef(0);
  const rafId = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const deltaY = scrollY - lastY.current;
      lastY.current = scrollY;

      handler(scrollY, deltaY);

      rafId.current = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [handler, ...dependencies]);
}

// ============================================
// Asset Preloading
// ============================================

/**
 * Preload critical assets
 */
export function preloadAssets(
  assets: Array<{
    href: string;
    as: "image" | "font" | "script" | "style" | "fetch";
    type?: string;
  }>,
): void {
  if (typeof document === "undefined") return;

  assets.forEach((asset) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = asset.href;
    link.as = asset.as;
    if (asset.type) link.type = asset.type;
    if (asset.as === "font") link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  });
}

/**
 * Prefetch next page assets
 */
export function prefetchRoute(route: string): void {
  if (typeof window === "undefined") return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = route;
  document.head.appendChild(link);
}

/**
 * Preconnect to critical origins
 */
export function preconnectOrigins(origins: string[]): void {
  if (typeof document === "undefined") return;

  origins.forEach((origin) => {
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = origin;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  });
}

// ============================================
// Performance Budget Enforcement
// ============================================

interface PerformanceBudget {
  maxBundleSize: number; // KB
  maxLCP: number; // ms
  maxINP: number; // ms
  maxCLS: number;
  maxRequests: number;
}

export const DEFAULT_PERFORMANCE_BUDGET: PerformanceBudget = {
  maxBundleSize: 250, // KB gzipped
  maxLCP: 2500,
  maxINP: 200,
  maxCLS: 0.1,
  maxRequests: 50,
};

/**
 * Check if current page meets performance budget
 */
export async function checkPerformanceBudget(
  budget: PerformanceBudget = DEFAULT_PERFORMANCE_BUDGET,
): Promise<{ passed: boolean; violations: string[] }> {
  const violations: string[] = [];

  // Check LCP
  const lcpEntries = performance.getEntriesByType("largest-contentful-paint");
  if (lcpEntries.length > 0) {
    const lcp = lcpEntries[lcpEntries.length - 1].startTime;
    if (lcp > budget.maxLCP) {
      violations.push(
        `LCP ${lcp.toFixed(0)}ms exceeds budget ${budget.maxLCP}ms`,
      );
    }
  }

  // Check CLS
  let cls = 0;
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (
        !(entry as PerformanceEntry & { hadRecentInput?: boolean })
          .hadRecentInput
      )
        cls += (entry as PerformanceEntry & { value?: number }).value ?? 0;
    });
  }).observe({ type: "layout-shift", buffered: true });

  // Wait a bit for CLS to accumulate
  await new Promise((r) => setTimeout(r, 100));
  if (cls > budget.maxCLS) {
    violations.push(`CLS ${cls.toFixed(4)} exceeds budget ${budget.maxCLS}`);
  }

  // Check bundle size (if available via resource timing)
  const resources = performance.getEntriesByType(
    "resource",
  ) as PerformanceResourceTiming[];
  const jsResources = resources.filter((r) => r.name.endsWith(".js"));
  const totalJSSize = jsResources.reduce(
    (sum, r) => sum + (r.transferSize || 0),
    0,
  );
  if (totalJSSize > budget.maxBundleSize * 1024) {
    violations.push(
      `JS bundle ${(totalJSSize / 1024).toFixed(0)}KB exceeds budget ${budget.maxBundleSize}KB`,
    );
  }

  return { passed: violations.length === 0, violations };
}

// ============================================
// Export all
// ============================================
