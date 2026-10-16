"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import * as THREE from "three";
import { prefersReducedMotion } from "./apple-springs";

gsap.registerPlugin(ScrollTrigger);

interface ScrollProviderProps {
  children: React.ReactNode;
  /** Smooth scroll configuration */
  smoothScroll?: boolean;
  /** Lenis options */
  lenisOptions?: {
    duration?: number;
    easing?: (t: number) => number;
    smoothWheel?: boolean;
    wheelMultiplier?: number;
    touchMultiplier?: number;
  };
  /** Whether to sync GSAP ScrollTrigger with Lenis */
  syncScrollTrigger?: boolean;
}

export function ScrollProvider({
  children,
  smoothScroll = true,
  lenisOptions = {},
  syncScrollTrigger = true,
}: ScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize Lenis
  useEffect(() => {
    if (!smoothScroll || prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: lenisOptions.duration ?? 1.2,
      easing:
        lenisOptions.easing ??
        ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
      smoothWheel: lenisOptions.smoothWheel ?? true,
      wheelMultiplier: lenisOptions.wheelMultiplier ?? 1,
      touchMultiplier: lenisOptions.touchMultiplier ?? 2,
      ...lenisOptions,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [
    smoothScroll,
    lenisOptions.duration,
    lenisOptions.easing,
    lenisOptions.smoothWheel,
    lenisOptions.wheelMultiplier,
    lenisOptions.touchMultiplier,
  ]);

  // Sync GSAP ScrollTrigger with Lenis
  useEffect(() => {
    if (!syncScrollTrigger || !smoothScroll || prefersReducedMotion()) return;

    const lenis = lenisRef.current;
    if (!lenis) return;

    ScrollTrigger.scrollerProxy("body", {
      scrollTop(value?: number) {
        if (value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      // GSAP's scrollerProxy rect shape is structurally incompatible with the
      // { top, left, width, height } object Lenis requires here.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    // Update ScrollTrigger on Lenis scroll
    lenis.on("scroll", ScrollTrigger.update);

    // Refresh on route change
    const handleRouteChange = () => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 0);
    };

    window.addEventListener("popstate", handleRouteChange);
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      window.removeEventListener("resize", handleResize);
    };
  }, [syncScrollTrigger, smoothScroll]);

  // Refresh ScrollTrigger on route change
  useEffect(() => {
    if (!syncScrollTrigger) return;
    ScrollTrigger.refresh();
  }, [pathname, searchParams?.toString()]);

  // Provide Lenis instance to children via context
  const scrollContext = {
    lenis: lenisRef.current,
    scrollTo: useCallback(
      (
        target: string | HTMLElement | number,
        options?: { offset?: number; immediate?: boolean },
      ) => {
        if (!lenisRef.current) return;
        if (typeof target === "string") {
          const element = document.querySelector(target);
          if (element)
            lenisRef.current.scrollTo(element as HTMLElement, {
              offset: options?.offset ?? 0,
              immediate: options?.immediate ?? false,
            });
        } else if (typeof target === "number") {
          lenisRef.current.scrollTo(target, {
            immediate: options?.immediate ?? false,
          });
        } else {
          lenisRef.current.scrollTo(target, {
            offset: options?.offset ?? 0,
            immediate: options?.immediate ?? false,
          });
        }
      },
      [],
    ),
    scrollTrigger: ScrollTrigger,
    gsap,
  };

  return (
    <ScrollContext.Provider value={scrollContext}>
      {children}
    </ScrollContext.Provider>
  );
}

const ScrollContext = React.createContext<{
  lenis: Lenis | null;
  scrollTo: (
    target: string | HTMLElement | number,
    options?: { offset?: number; immediate?: boolean },
  ) => void;
  scrollTrigger: typeof ScrollTrigger;
  gsap: typeof gsap;
}>({
  lenis: null,
  scrollTo: () => {},
  scrollTrigger: ScrollTrigger,
  gsap,
});

export function useScroll() {
  const context = React.useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within ScrollProvider");
  }
  return context;
}

export function useGSAP() {
  const { gsap } = useScroll();
  return gsap;
}

export function useScrollTrigger() {
  const { scrollTrigger } = useScroll();
  return scrollTrigger;
}

export function useLenis() {
  const { lenis } = useScroll();
  return lenis;
}

/**
 * Hook for creating GSAP ScrollTrigger animations with proper cleanup
 */
export function useGSAPScrollTrigger(
  animation: (self: ScrollTrigger) => void | (() => void),
  deps: React.DependencyList = [],
) {
  const { scrollTrigger } = useScroll();

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const trigger = scrollTrigger.create({
        animation: gsap.timeline({ paused: true }),
        onUpdate: (self: ScrollTrigger) => animation(self),
        // GSAP's scrollerProxy interface is not structurally compatible with the
        // { top, left, width, height } rect shape Lenis requires.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      return trigger;
    });

    return () => ctx.revert();
  }, deps);
}

/**
 * Create a scroll-triggered timeline for pinning sections
 */
export function createPinnedSection(
  trigger: string | HTMLElement,
  timeline: gsap.core.Timeline,
  options: {
    pin?: boolean;
    pinSpacing?: boolean;
    start?: string;
    end?: string;
    scrub?: number | boolean;
    anticipatePin?: number;
  } = {},
) {
  return ScrollTrigger.create({
    trigger,
    start: options.start ?? "top top",
    end: options.end ?? "bottom bottom",
    pin: options.pin ?? true,
    pinSpacing: options.pinSpacing ?? true,
    scrub: options.scrub ?? true,
    anticipatePin: options.anticipatePin ?? 1,
    animation: timeline,
  });
}

/**
 * Create a scrubbed animation tied to scroll progress
 */
export function createScrubbedAnimation(
  trigger: string | HTMLElement,
  timeline: gsap.core.Timeline,
  options: {
    start?: string;
    end?: string;
    scrub?: number | boolean;
  } = {},
) {
  return ScrollTrigger.create({
    trigger,
    start: options.start ?? "top bottom",
    end: options.end ?? "bottom top",
    scrub: options.scrub ?? 1,
    animation: timeline,
  });
}

/**
 * Create staggered reveal animations for a container's children
 */
export function createStaggeredReveal(
  container: HTMLElement,
  options: {
    stagger?: number;
    direction?: "up" | "down" | "left" | "right";
    start?: string;
    end?: string;
  } = {},
) {
  const children = Array.from(
    container.querySelectorAll("[data-reveal-child]"),
  );
  if (children.length === 0) return;

  const timeline = gsap.timeline({ paused: true });

  timeline.from(children, {
    opacity: 0,
    y:
      options.direction === "down"
        ? -50
        : options.direction === "left"
          ? 0
          : 50,
    x:
      options.direction === "left"
        ? 50
        : options.direction === "right"
          ? -50
          : 0,
    duration: 0.8,
    ease: "power2.out",
    stagger: options.stagger ?? 0.08,
  });

  ScrollTrigger.create({
    trigger: container,
    start: options.start ?? "top 85%",
    end: options.end ?? "bottom 15%",
    animation: timeline,
    toggleActions: "play none none reverse",
  });
}

/**
 * Create a scroll-driven text reveal (clip-path)
 */
export function createTextReveal(
  element: HTMLElement,
  options: {
    start?: string;
    end?: string;
  } = {},
) {
  gsap.fromTo(
    element,
    { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", y: 40 },
    {
      clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: options.start ?? "top 85%",
        end: options.end ?? "bottom 15%",
        scrub: false,
        toggleActions: "play none none reverse",
      },
    },
  );
}

/**
 * Create a scroll-synchronized 3D camera movement
 */
export function create3DCameraScroll(
  camera: THREE.Camera,
  options: {
    trigger: string | HTMLElement;
    start?: string;
    end?: string;
    positions?: { x?: number; y?: number; z?: number }[];
    rotations?: { x?: number; y?: number; z?: number }[];
  },
) {
  const { positions = [], rotations = [] } = options;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: options.trigger,
      start: options.start ?? "top bottom",
      end: options.end ?? "bottom top",
      scrub: 1,
    },
  });

  if (positions.length > 0) {
    timeline.to(
      camera.position,
      {
        x: positions[0]?.x,
        y: positions[0]?.y,
        z: positions[0]?.z,
        duration: 1,
        ease: "none",
      },
      0,
    );
  }

  if (rotations.length > 0) {
    timeline.to(
      camera.rotation,
      {
        x: rotations[0]?.x,
        y: rotations[0]?.y,
        z: rotations[0]?.z,
        duration: 1,
        ease: "none",
      },
      0,
    );
  }

  return timeline;
}

/**
 * Create a scroll-linked progress indicator
 */
export function createScrollProgress(
  progressElement: HTMLElement,
  options: {
    trigger?: string | HTMLElement;
    start?: string;
    end?: string;
    axis?: "x" | "y";
  } = {},
) {
  const axis = options.axis ?? "x";

  return ScrollTrigger.create({
    trigger: options.trigger ?? "body",
    start: options.start ?? "top top",
    end: options.end ?? "bottom bottom",
    onUpdate: (self) => {
      const progress = self.progress;
      progressElement.style.transformOrigin = "left center";
      progressElement.style.transform = `scale${axis.toUpperCase()}(${progress})`;
    },
  });
}

/**
 * Create a scroll-linked counter (number animation)
 */
export function createScrollCounter(
  element: HTMLElement,
  options: {
    start?: number;
    end?: number;
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    trigger?: string | HTMLElement;
    startPos?: string;
    endPos?: string;
  } = {},
) {
  const obj = { value: options.start ?? 0 };

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: options.trigger ?? element,
      start: options.startPos ?? "top bottom",
      end: options.endPos ?? "bottom top",
      scrub: 1,
    },
  });

  timeline.to(obj, {
    value: options.end ?? 100,
    duration: options.duration ?? 1,
    ease: "none",
    onUpdate: () => {
      const value = obj.value.toFixed(options.decimals ?? 0);
      element.textContent = `${options.prefix ?? ""}${value}${options.suffix ?? ""}`;
    },
  });

  return timeline;
}

/**
 * Cleanup all ScrollTriggers on unmount
 */
export function useScrollTriggerCleanup() {
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
}

/**
 * Refresh all ScrollTriggers (call after DOM mutations)
 */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}

/**
 * Get scroll progress for a specific element
 */
export function getElementScrollProgress(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const elementTop = rect.top;
  const elementBottom = rect.bottom;

  if (elementBottom <= 0) return 1;
  if (elementTop >= viewportHeight) return 0;

  const visibleHeight =
    Math.min(elementBottom, viewportHeight) - Math.max(elementTop, 0);
  return visibleHeight / rect.height;
}
