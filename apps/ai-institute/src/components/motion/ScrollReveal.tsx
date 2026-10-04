"use client";

import { useRef, type ReactNode, useEffect } from "react";
import { prefersReducedMotion, animateFromCurrent, SPRING_DEFAULT } from "@/lib/motion/apple-springs";

type Direction = "up" | "down" | "left" | "right";

interface ScrollRevealProps {
  children: ReactNode;
  /** Animation direction */
  direction?: Direction;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Custom spring config */
  spring?: { damping: number; response: number };
  /** Distance to travel in px */
  distance?: number;
  /** ScrollTrigger start: reveal fires when element's top crosses this viewport percentage */
  threshold?: number; // 0-100, default 85% (top 85%)
  /** Whether animation should only run once */
  once?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const directionMap: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  spring = { damping: 1.0, response: 0.35 },
  distance,
  threshold = 85,
  once = true,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    if (prefersReducedMotion()) return;

    const element = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (hasAnimatedRef.current && once) return;

          const dir = directionMap[direction];
          const fromVars: Record<string, number> = { opacity: 0 };

          if (direction === "up" || direction === "down") {
            fromVars.y = distance ?? dir.y ?? 0;
          } else {
            fromVars.x = distance ?? dir.x ?? 0;
          }

          // Set initial state
          Object.assign(element.style, {
            opacity: "0",
            transform: `translate(${fromVars.x ?? 0}px, ${fromVars.y ?? 0}px)`,
            willChange: "opacity, transform",
          });

          // Animate with spring
          animateFromCurrent(element, { opacity: 1, x: 0, y: 0 }, {
            damping: spring.damping,
            response: spring.response,
            delay,
          });

          if (once) {
            hasAnimatedRef.current = true;
            observer.unobserve(element);
          }
        });
      },
      { rootMargin: "0px", threshold: 0 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [direction, delay, spring, once]);

  // Reduced motion fallback
  useEffect(() => {
    if (prefersReducedMotion() && ref.current) {
      ref.current.style.opacity = "1";
      ref.current.style.transform = "none";
    }
  }, []);

  return <div ref={ref} className={className}>{children}</div>;
}