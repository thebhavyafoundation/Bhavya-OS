"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Direction = "up" | "down" | "left" | "right";

interface ScrollRevealProps {
  children: ReactNode;
  /** Animation direction */
  direction?: Direction;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Animation duration (seconds) */
  duration?: number;
  /** Distance to travel in px */
  distance?: number;
  /** ScrollTrigger start: reveal fires when the element's top crosses (100 - |threshold|)% of the viewport — default -15 → "top 85%", i.e. as soon as it enters the lower viewport (matches TextReveal; anchor/jump landings never leave content blank) */
  threshold?: number;
  /** Additional CSS classes */
  className?: string;
}

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const directionMap: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 60 },
  down: { y: -60 },
  left: { x: 60 },
  right: { x: -60 },
};

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  distance,
  threshold = -15,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (getPrefersReducedMotion()) return;

      const dir = directionMap[direction];
      const fromVars: gsap.TweenVars = {
        opacity: 0,
        duration,
        delay,
        ease: "power3.out",
      };

      if (direction === "up" || direction === "down") {
        fromVars.y = distance ?? dir.y;
      } else {
        fromVars.x = distance ?? dir.x;
      }

      gsap.from(ref.current, {
        ...fromVars,
        scrollTrigger: {
          trigger: ref.current,
          start: `top ${100 - Math.abs(threshold)}%`,
          once: true,
        },
      });
    },
    {
      scope: ref,
      dependencies: [direction, delay, duration, distance, threshold],
    },
  );

  if (getPrefersReducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
