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

interface ScrubParallaxProps {
  children: ReactNode;
  className?: string;
  /** Peak travel in px (positive starts lower, ends higher) */
  distance?: number;
  start?: string;
  end?: string;
}

/**
 * Restrained scroll-scrub depth: translates content with scroll progress.
 * Respects prefers-reduced-motion (renders static children).
 */
export function ScrubParallax({
  children,
  className,
  distance = 36,
  start = "top bottom",
  end = "bottom top",
}: ScrubParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        ref.current,
        { y: distance },
        {
          y: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start,
            end,
            scrub: true,
          },
        },
      );
    },
    { scope: ref, dependencies: [distance, start, end] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
