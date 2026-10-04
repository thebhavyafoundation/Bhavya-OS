"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import { useEffect } from "react";
import { prefersReducedMotion, animateFromCurrent, SPRING_DEFAULT } from "@/lib/motion/apple-springs";

interface HeroEntranceProps {
  children: ReactNode;
  /** Additional CSS classes for the container */
  className?: string;
  /** Inline styles for the container */
  style?: CSSProperties;
  /** Stagger delay between children (seconds) */
  staggerDelay?: number;
  /** Initial delay before animation starts (seconds) */
  initialDelay?: number;
}

/**
 * Hero entrance animation using native Web Animations API with spring-like easing.
 * - Critically damped springs for graceful, non-distracting entrance
 * - Interruptible by default (WAAPI animates from current value)
 * - Respects prefers-reduced-motion with instant cross-fade
 */
export function HeroEntrance({
  children,
  className,
  style,
  staggerDelay = 0.12,
  initialDelay = 0.1,
}: HeroEntranceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (prefersReducedMotion()) return;

    const children = Array.from(containerRef.current.children);

    // Set initial state for all children
    children.forEach((child) => {
      Object.assign((child as HTMLElement).style, {
        opacity: "0",
        transform: "translateY(28px)",
        willChange: "opacity, transform",
      });
    });

    // Animate with spring stagger
    children.forEach((child, index) => {
      const el = child as HTMLElement;
      animateFromCurrent(el, { opacity: 1, transform: "translateY(0)" }, {
        damping: SPRING_DEFAULT.damping,
        response: SPRING_DEFAULT.response,
        delay: initialDelay + index * staggerDelay,
      });
    });
  }, [staggerDelay, initialDelay]);

  // Reduced motion fallback
  useEffect(() => {
    if (prefersReducedMotion() && containerRef.current) {
      const children = Array.from(containerRef.current.children);
      children.forEach((child) => {
        Object.assign((child as HTMLElement).style, {
          opacity: "1",
          transform: "none",
        });
      });
    }
  }, []);

  return (
    <div ref={containerRef} className={className} style={style}>
      {children}
    </div>
  );
}