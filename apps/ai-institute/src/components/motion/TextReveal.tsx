"use client";

import { useRef, type ReactNode, useEffect } from "react";
import { prefersReducedMotion, animateFromCurrent, SPRING_DEFAULT } from "@/lib/motion/apple-springs";

interface TextRevealProps {
  children: ReactNode;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Custom spring config */
  spring?: { damping: number; response: number };
  /** Additional CSS classes */
  className?: string;
}

export function TextReveal({
  children,
  delay = 0,
  spring = { damping: 1.0, response: 0.35 },
  className,
}: TextRevealProps) {
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
          if (hasAnimatedRef.current) return;

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
              { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", transform: "translateY(40px)" },
              { clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)", transform: "translateY(0)" },
            ],
            {
              damping: spring.damping,
              response: spring.response,
              delay,
            }
          );

          hasAnimatedRef.current = true;
          observer.unobserve(element);
        });
      },
      { rootMargin: "0px", threshold: 0 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, spring]);

  // Reduced motion fallback
  useEffect(() => {
    if (prefersReducedMotion() && ref.current) {
      ref.current.style.clipPath = "none";
      ref.current.style.transform = "none";
    }
  }, []);

  return <div ref={ref} className={className}>{children}</div>;
}