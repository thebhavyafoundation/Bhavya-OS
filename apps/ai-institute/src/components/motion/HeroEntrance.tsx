"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface HeroEntranceProps {
  children: ReactNode;
  /** Additional CSS classes for the container */
  className?: string;
  /** Inline styles for the container */
  style?: CSSProperties;
}

export function HeroEntrance({
  children,
  className,
  style,
}: HeroEntranceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(gsap.utils.toArray(containerRef.current.children), {
        opacity: 0,
        y: 28,
        duration: 0.7,
        stagger: 0.12,
        delay: 0.1,
      });

      return () => {
        tl.kill();
      };
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={className} style={style}>
      {children}
    </div>
  );
}
