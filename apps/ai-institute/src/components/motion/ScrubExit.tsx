"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface ScrubExitProps {
  children: ReactNode;
  className?: string;
  /** Fade toward this opacity as the block leaves the viewport top */
  toOpacity?: number;
  /** Upward travel in px while scrubbing out */
  distance?: number;
}

/**
 * Cinematic section exit: content drifts up and softens as it leaves.
 * One-shot hero entrance remains HeroEntrance; this only runs on the way out.
 */
export function ScrubExit({
  children,
  className,
  toOpacity = 0.35,
  distance = 64,
}: ScrubExitProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (prefersReducedMotion()) return;

      gsap.to(ref.current, {
        y: -distance,
        opacity: toOpacity,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "center center",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: ref, dependencies: [distance, toOpacity] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
