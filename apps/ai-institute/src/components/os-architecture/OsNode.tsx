"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface OsNodeProps {
  x: number;
  y: number;
  label: string;
  sublabel?: string;
  color?: string;
  size?: number;
  delay?: number;
}

export function OsNode({
  x,
  y,
  label,
  sublabel,
  color = "var(--color-accent-gold)",
  size = 44,
  delay = 0,
}: OsNodeProps) {
  const nodeRef = useRef<SVGGElement>(null);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useGSAP(
    () => {
      if (!nodeRef.current || prefersReducedMotion) return;
      gsap.fromTo(
        nodeRef.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: nodeRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: nodeRef, dependencies: [delay] },
  );

  return (
    <g
      ref={nodeRef}
      transform={`translate(${x}, ${y})`}
      style={{ opacity: prefersReducedMotion ? 1 : 0 }}
    >
      {/* Glow */}
      <circle
        cx={0}
        cy={0}
        r={size + 8}
        fill="none"
        stroke={color}
        strokeWidth={1}
        opacity={0.15}
      />
      {/* Node circle */}
      <circle
        cx={0}
        cy={0}
        r={size}
        fill="var(--color-forest-900)"
        stroke={color}
        strokeWidth={1.5}
      />
      {/* Label */}
      <text
        x={0}
        y={size + 20}
        textAnchor="middle"
        fill="var(--color-text-inverse)"
        fontSize={11}
        fontFamily="var(--font-sans)"
        fontWeight={600}
        letterSpacing="0.02em"
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={0}
          y={size + 34}
          textAnchor="middle"
          fill="rgba(247, 244, 236, 0.5)"
          fontSize={9}
          fontFamily="var(--font-sans)"
          fontWeight={400}
        >
          {sublabel}
        </text>
      )}
    </g>
  );
}
