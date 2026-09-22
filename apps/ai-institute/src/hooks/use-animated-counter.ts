"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

interface UseAnimatedCounterOptions {
  /** Target number to animate to */
  target: number;
  /** Duration in seconds */
  duration?: number;
  /** Delay before animation starts in seconds */
  delay?: number;
  /** Start automatically when element enters viewport */
  autoStart?: boolean;
  /** Root margin for IntersectionObserver */
  rootMargin?: string;
}

interface UseAnimatedCounterReturn {
  /** Ref to attach to the counting element */
  ref: React.RefObject<HTMLSpanElement | null>;
  /** Current displayed value */
  value: number;
}

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useAnimatedCounter(
  options: UseAnimatedCounterOptions,
): UseAnimatedCounterReturn {
  const {
    target,
    duration = 2,
    delay = 0,
    autoStart = true,
    rootMargin = "-100px",
  } = options;

  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(() =>
    getPrefersReducedMotion() ? target : 0,
  );

  useEffect(() => {
    if (!ref.current || !autoStart) return;
    if (getPrefersReducedMotion()) {
      setValue(target);
      return;
    }

    const counter = { val: 0 };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(counter, {
            val: target,
            duration,
            delay,
            ease: "power2.out",
            onUpdate: () => {
              setValue(Math.round(counter.val));
            },
          });
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [target, duration, delay, autoStart, rootMargin]);

  return { ref, value };
}

export type { UseAnimatedCounterOptions, UseAnimatedCounterReturn };
