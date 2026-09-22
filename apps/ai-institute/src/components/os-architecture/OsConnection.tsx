"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface OsConnectionProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  color?: string;
  delay?: number;
  curved?: boolean;
}

export function OsConnection({
  from,
  to,
  color = "var(--color-accent-gold)",
  delay = 0,
  curved = false,
}: OsConnectionProps) {
  const pathRef = useRef<SVGPathElement>(null);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  let d: string;
  if (curved) {
    const midY = (from.y + to.y) / 2;
    d = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
  } else {
    d = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }

  useGSAP(
    () => {
      if (!pathRef.current || prefersReducedMotion) return;
      const length = pathRef.current.getTotalLength();
      gsap.fromTo(
        pathRef.current,
        { strokeDasharray: length, strokeDashoffset: length },
        {
          strokeDashoffset: 0,
          duration: 1.2,
          delay,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: pathRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: pathRef, dependencies: [delay] },
  );

  return (
    <path
      ref={pathRef}
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={1}
      opacity={0.3}
      style={
        prefersReducedMotion ? {} : { strokeDasharray: 1, strokeDashoffset: 1 }
      }
    />
  );
}
