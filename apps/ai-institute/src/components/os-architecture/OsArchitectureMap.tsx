"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OsNode } from "./OsNode";
import { OsConnection } from "./OsConnection";

gsap.registerPlugin(ScrollTrigger);

const NODES = [
  {
    id: "foundation",
    x: 400,
    y: 80,
    label: "Foundation",
    sublabel: "Constitution-bound",
    color: "var(--color-accent-gold)",
    size: 38,
  },
  {
    id: "forest",
    x: 160,
    y: 200,
    label: "Forest",
    sublabel: "Restore ecosystems",
    color: "var(--color-viz-forest)",
    size: 32,
  },
  {
    id: "knowledge",
    x: 310,
    y: 220,
    label: "Knowledge",
    sublabel: "Advance learning",
    color: "var(--color-viz-gold)",
    size: 32,
  },
  {
    id: "heritage",
    x: 490,
    y: 220,
    label: "Heritage",
    sublabel: "Preserve culture",
    color: "var(--color-viz-earth)",
    size: 32,
  },
  {
    id: "community",
    x: 640,
    y: 200,
    label: "Community",
    sublabel: "Empower people",
    color: "var(--color-viz-sage)",
    size: 32,
  },
  {
    id: "programs",
    x: 400,
    y: 360,
    label: "Programs",
    sublabel: "On-ground work",
    color: "var(--color-accent-gold)",
    size: 30,
  },
  {
    id: "evidence",
    x: 280,
    y: 480,
    label: "Evidence",
    sublabel: "Verified outcomes",
    color: "var(--color-accent-gold)",
    size: 28,
  },
  {
    id: "research",
    x: 520,
    y: 480,
    label: "Research",
    sublabel: "Institutional learning",
    color: "var(--color-accent-gold)",
    size: 28,
  },
  {
    id: "impact",
    x: 400,
    y: 580,
    label: "Impact",
    sublabel: "Transparent metrics",
    color: "var(--color-accent-gold)",
    size: 30,
  },
  {
    id: "os",
    x: 400,
    y: 700,
    label: "Bhavya OS",
    sublabel: "The connecting system",
    color: "var(--color-accent-gold)",
    size: 42,
  },
];

const CONNECTIONS = [
  { from: "foundation", to: "forest", curved: false },
  { from: "foundation", to: "knowledge", curved: false },
  { from: "foundation", to: "heritage", curved: false },
  { from: "foundation", to: "community", curved: false },
  { from: "forest", to: "programs", curved: true },
  { from: "knowledge", to: "programs", curved: true },
  { from: "heritage", to: "programs", curved: true },
  { from: "community", to: "programs", curved: true },
  { from: "programs", to: "evidence", curved: true },
  { from: "programs", to: "research", curved: true },
  { from: "evidence", to: "impact", curved: true },
  { from: "research", to: "impact", curved: true },
  { from: "impact", to: "os", curved: false },
];

export function OsArchitectureMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useGSAP(
    () => {
      if (!containerRef.current || prefersReducedMotion) return;
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: containerRef },
  );

  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", opacity: prefersReducedMotion ? 1 : 0 }}
    >
      <svg
        viewBox="0 0 800 780"
        style={{ width: "100%", height: "auto" }}
        role="img"
        aria-label="Bhavya OS architecture — showing how Foundation connects to four Missions, Programs, Evidence, Research, Impact, and Bhavya OS"
      >
        {/* Connections first (behind nodes) */}
        {CONNECTIONS.map((conn, i) => {
          const from = nodeMap[conn.from];
          const to = nodeMap[conn.to];
          return (
            <OsConnection
              key={`${conn.from}-${conn.to}`}
              from={{ x: from.x, y: from.y }}
              to={{ x: to.x, y: to.y }}
              delay={0.3 + i * 0.08}
              curved={conn.curved}
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((node, i) => (
          <OsNode
            key={node.id}
            x={node.x}
            y={node.y}
            label={node.label}
            sublabel={node.sublabel}
            color={node.color}
            size={node.size}
            delay={0.1 + i * 0.1}
          />
        ))}
      </svg>
    </div>
  );
}
