"use client";

import { useRef, useEffect, useCallback } from "react";
import {
  prefersReducedMotion,
  animateFromCurrent,
  SPRING_DEFAULT,
} from "./apple-springs";

interface UseScrollRevealOptions {
  /** Animation direction */
  direction?: "up" | "down" | "left" | "right";
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Custom spring config */
  spring?: { damping: number; response: number };
  /** ScrollTrigger start: reveal fires when element's top crosses this viewport percentage */
  threshold?: number; // 0-100, default 85% (top 85%)
  /** Whether animation should only run once */
  once?: boolean;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Root margin for intersection observer */
  rootMargin?: string;
}

const directionMap: Record<string, { x?: number; y?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
};

/**
 * Enhanced scroll reveal using native Web Animations API with spring-like easing.
 * Features:
 * - Spring-based animations (interruptible, velocity-aware)
 * - Respects prefers-reduced-motion with cross-fade fallback
 * - Staggered reveals for multiple children
 */
export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const {
    direction = "up",
    delay = 0,
    spring = { damping: 1.0, response: 0.35 },
    threshold = 85,
    once = true,
    onComplete,
    rootMargin = "0px",
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const hasAnimatedRef = useRef(false);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (prefersReducedMotion()) return;

      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target as HTMLElement;
        if (hasAnimatedRef.current && once) return;

        const dir = directionMap[direction];
        const fromVars: Record<string, number> = { opacity: 0 };

        if (direction === "up" || direction === "down") {
          fromVars.y = dir.y ?? 0;
        } else {
          fromVars.x = dir.x ?? 0;
        }

        // Set initial state
        Object.assign(element.style, {
          opacity: "0",
          transform: `translate(${fromVars.x ?? 0}px, ${fromVars.y ?? 0}px)`,
          willChange: "opacity, transform",
        });

        // Animate with spring
        animateFromCurrent(
          element,
          { opacity: 1, x: 0, y: 0 },
          {
            damping: spring.damping,
            response: spring.response,
            delay,
          },
        );

        onComplete?.();

        if (once) {
          hasAnimatedRef.current = true;
        }
      });
    },
    [direction, delay, spring, once, onComplete],
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element || prefersReducedMotion()) {
      // For reduced motion, just ensure elements are visible
      if (element) {
        element.style.opacity = "1";
        element.style.transform = "none";
      }
      return;
    }

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin,
      threshold: 0,
    });

    // Observe the main element and all children for staggered reveals
    observer.observe(element);
    const children = element.querySelectorAll("[data-reveal-child]");
    children.forEach((child) => observer.observe(child));

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, rootMargin]);

  // Reduced motion fallback
  useEffect(() => {
    if (prefersReducedMotion() && elementRef.current) {
      const element = elementRef.current;
      element.style.opacity = "1";
      element.style.transform = "none";
      const children = element.querySelectorAll("[data-reveal-child]");
      children.forEach((child) => {
        (child as HTMLElement).style.opacity = "1";
        (child as HTMLElement).style.transform = "none";
      });
    }
  }, []);

  return elementRef;
}

/**
 * Staggered scroll reveal for multiple children.
 * Each child gets a progressive delay for editorial feel.
 */
export function useStaggeredScrollReveal(
  itemCount: number,
  options: UseScrollRevealOptions & { stagger?: number } = {},
) {
  const { stagger = 0.08, ...rest } = options;
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const children = Array.from(
            container.querySelectorAll("[data-reveal-child]"),
          );
          children.forEach((child, index) => {
            const childEl = child as HTMLElement;
            const dir = directionMap[rest.direction ?? "up"];
            const fromVars: Record<string, number> = { opacity: 0 };

            if (
              (rest.direction ?? "up") === "up" ||
              (rest.direction ?? "up") === "down"
            ) {
              fromVars.y = dir.y ?? 0;
            } else {
              fromVars.x = dir.x ?? 0;
            }

            Object.assign((child as HTMLElement).style, {
              opacity: "0",
              transform: `translate(${fromVars.x ?? 0}px, ${fromVars.y ?? 0}px)`,
              willChange: "opacity, transform",
            });

            animateFromCurrent(
              child as HTMLElement,
              { opacity: 1, x: 0, y: 0 },
              {
                damping: rest.spring?.damping ?? SPRING_DEFAULT.damping,
                response: rest.spring?.response ?? SPRING_DEFAULT.response,
                delay: (rest.delay ?? 0) + index * stagger,
              },
            );
          });

          if (rest.once) {
            observer.unobserve(container);
          }
        });
      },
      { rootMargin: rest.rootMargin ?? "0px", threshold: 0 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [
    itemCount,
    rest.direction,
    rest.delay,
    rest.spring,
    rest.once,
    rest.rootMargin,
  ]);

  return containerRef;
}

/**
 * Text reveal with clip-path animation (editorial style).
 * Uses spring for smooth, interruptible reveal.
 */
export function useTextReveal(
  options: {
    delay?: number;
    spring?: { damping: number; response: number };
  } = {},
) {
  const { delay = 0, spring = { damping: 1.0, response: 0.35 } } = options;
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !elementRef.current) return;

    const element = elementRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          // Set initial state
          Object.assign(element.style, {
            clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
            transform: "translateY(40px)",
            willChange: "clip-path, transform",
          });

          // Animate with spring
          animateFromCurrent(
            element,
            [
              {
                clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
                transform: "translateY(40px)",
              },
              {
                clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
                transform: "translateY(0)",
              },
            ],
            {
              damping: spring.damping,
              response: spring.response,
              delay,
            },
          );

          observer.unobserve(element);
        });
      },
      { rootMargin: "0px", threshold: 0 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, spring]);

  // Reduced motion fallback
  useEffect(() => {
    if (prefersReducedMotion() && elementRef.current) {
      elementRef.current.style.clipPath = "none";
      elementRef.current.style.transform = "none";
    }
  }, []);

  return elementRef;
}

/**
 * Parallax scroll effect with spring physics.
 * Tracks scroll velocity for natural momentum feel.
 */
export function useParallax(
  options: {
    speed?: number; // 0-1, how much element moves relative to scroll
    spring?: { damping: number; response: number };
  } = {},
) {
  const { speed = 0.3, spring = { damping: 1.0, response: 0.35 } } = options;
  const elementRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY.current;
      lastScrollY.current = scrollY;

      const targetY = scrollY * speed;

      animateFromCurrent(
        element,
        { y: targetY },
        {
          damping: spring.damping,
          response: spring.response,
        },
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [speed, spring]);

  return elementRef;
}
