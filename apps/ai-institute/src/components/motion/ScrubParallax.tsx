"use client";

import { useRef, type ReactNode, useEffect } from "react";
import { prefersReducedMotion, animateFromCurrent, SPRING_DEFAULT } from "@/lib/motion/apple-springs";

interface ScrubParallaxProps {
  children: ReactNode;
  className?: string;
  /** Peak travel in px (positive starts lower, ends higher) */
  distance?: number;
  start?: string;
  end?: string;
}

/**
 * Restrained scroll-scrub depth with spring physics.
 * Translates content with scroll progress using spring for natural momentum feel.
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
  const lastProgressRef = useRef(0);

  useEffect(() => {
    if (!ref.current) return;
    if (prefersReducedMotion()) return;

    const element = ref.current;

    const handleScroll = () => {
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementHeight = rect.height;

      // Calculate scroll progress (0 to 1) as element moves through viewport
      // start: "top bottom" = element top at viewport bottom (progress 0)
      // end: "bottom top" = element bottom at viewport top (progress 1)
      const progress = 1 - rect.bottom / (viewportHeight + elementHeight);
      const clampedProgress = Math.max(0, Math.min(1, progress));

      // Target position based on progress
      const targetY = distance - clampedProgress * distance * 2; // distance to -distance

      // Animate with spring for natural momentum feel
      animateFromCurrent(element, { y: targetY }, {
        damping: SPRING_DEFAULT.damping,
        response: SPRING_DEFAULT.response,
      });

      lastProgressRef.current = clampedProgress;
    };

    // Use scroll event for smooth parallax (better than IntersectionObserver for continuous movement)
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [distance, start, end]);

  // Reduced motion fallback
  useEffect(() => {
    if (prefersReducedMotion() && ref.current) {
      ref.current.style.transform = "none";
    }
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}