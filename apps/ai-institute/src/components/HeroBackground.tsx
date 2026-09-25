"use client";

/**
 * HeroBackground — Real photography + atmospheric overlay system
 *
 * When a `photo` prop is provided, renders a real photograph with
 * subtle gradient overlay for text readability. Falls back to
 * multi-layer gradient system when no photo is available.
 *
 * Layers (photo mode): photograph → readability overlay → bottom fade (max 2 gradients)
 * Layers (fallback): base gradient → accent gradient → SVG mountain silhouette
 * Article 6.2: maximum two gradients per composition.
 */

import { useMemo } from "react";

type PillarType = "forest" | "knowledge" | "heritage" | "community" | "home";

interface HeroBackgroundProps {
  pillar: PillarType;
  /** Path to real photograph in /photography/ directory */
  photo?: string;
  /** Custom overlay opacity (default: 0.45) */
  overlayOpacity?: number;
  /** Custom object-position for the photo */
  photoPosition?: string;
  /**
   * light = editorial light hero (dark text, soft side/bottom wash)
   * dark  = full forest overlay (inverse text) — default when omitted
   */
  variant?: "light" | "dark";
  children?: React.ReactNode;
}

const pillarConfigs: Record<
  PillarType,
  {
    base: string;
    accent: string;
    mid: string;
    noise: string;
    customProperties?: Record<string, string>;
  }
> = {
  home: {
    base: `linear-gradient(160deg,
      color-mix(in srgb, var(--color-forest-900) 70%, var(--color-forest-950)) 0%,
      color-mix(in srgb, var(--color-forest-800) 75%, var(--color-forest-900)) 25%,
      var(--color-brand-forest) 50%,
      color-mix(in srgb, var(--color-brand-forest) 55%, var(--color-forest-600)) 75%,
      color-mix(in srgb, var(--color-forest-600) 80%, var(--color-forest-500)) 100%)`,
    accent:
      "radial-gradient(ellipse at 70% 20%, color-mix(in srgb, var(--color-brand-gold) 8%, transparent) 0%, transparent 60%)",
    mid: "radial-gradient(ellipse at 30% 80%, color-mix(in srgb, var(--color-brand-forest) 60%, transparent) 0%, transparent 50%)",
    noise:
      "repeating-conic-gradient(color-mix(in srgb, var(--color-brand-ivory) 1.5%, transparent) 0% 25%, transparent 0% 50%)",
  },
  forest: {
    base: `linear-gradient(160deg,
      color-mix(in srgb, var(--color-forest-950) 60%, var(--color-forest-900)) 0%,
      color-mix(in srgb, var(--color-forest-900) 70%, var(--color-forest-800)) 25%,
      var(--color-brand-forest) 50%,
      color-mix(in srgb, var(--color-brand-forest) 55%, var(--color-forest-600)) 75%,
      color-mix(in srgb, var(--color-forest-600) 55%, var(--color-forest-500)) 100%)`,
    accent:
      "radial-gradient(ellipse at 60% 30%, color-mix(in srgb, var(--color-forest-500) 12%, transparent) 0%, transparent 55%)",
    mid: "radial-gradient(ellipse at 20% 70%, color-mix(in srgb, var(--color-forest-800) 70%, transparent) 0%, transparent 50%)",
    noise:
      "repeating-conic-gradient(color-mix(in srgb, var(--color-brand-ivory) 1.2%, transparent) 0% 25%, transparent 0% 50%)",
  },
  knowledge: {
    customProperties: {
      "--hero-knowledge-1": "#0a1628",
      "--hero-knowledge-2": "#122240",
      "--hero-knowledge-3": "#1a3358",
      "--hero-knowledge-4": "#1e3d6a",
      "--hero-knowledge-5": "#234a7a",
      "--hero-knowledge-mid": "rgba(18, 34, 64, 0.7)",
    },
    base: `linear-gradient(160deg,
      var(--hero-knowledge-1) 0%,
      var(--hero-knowledge-2) 25%,
      var(--hero-knowledge-3) 50%,
      var(--hero-knowledge-4) 75%,
      var(--hero-knowledge-5) 100%)`,
    accent:
      "radial-gradient(ellipse at 65% 25%, color-mix(in srgb, var(--color-brand-gold) 6%, transparent) 0%, transparent 55%)",
    mid: "radial-gradient(ellipse at 25% 75%, var(--hero-knowledge-mid) 0%, transparent 50%)",
    noise:
      "repeating-conic-gradient(color-mix(in srgb, var(--color-brand-ivory) 1%, transparent) 0% 25%, transparent 0% 50%)",
  },
  heritage: {
    customProperties: {
      "--hero-heritage-1": "#1a0f08",
      "--hero-heritage-2": "#2d1a0e",
      "--hero-heritage-3": "#3d2516",
      "--hero-heritage-4": "#4d301e",
      "--hero-heritage-5": "#5d3c26",
      "--hero-heritage-mid": "rgba(45, 26, 14, 0.7)",
    },
    base: `linear-gradient(160deg,
      var(--hero-heritage-1) 0%,
      var(--hero-heritage-2) 25%,
      var(--hero-heritage-3) 50%,
      var(--hero-heritage-4) 75%,
      var(--hero-heritage-5) 100%)`,
    accent:
      "radial-gradient(ellipse at 55% 35%, color-mix(in srgb, var(--color-brand-gold) 8%, transparent) 0%, transparent 55%)",
    mid: "radial-gradient(ellipse at 30% 65%, var(--hero-heritage-mid) 0%, transparent 50%)",
    noise:
      "repeating-conic-gradient(color-mix(in srgb, var(--color-brand-ivory) 1.2%, transparent) 0% 25%, transparent 0% 50%)",
  },
  community: {
    base: `linear-gradient(160deg,
      color-mix(in srgb, var(--color-forest-900) 70%, var(--color-forest-950)) 0%,
      color-mix(in srgb, var(--color-forest-800) 60%, var(--color-forest-900)) 25%,
      var(--color-brand-forest) 50%,
      color-mix(in srgb, var(--color-brand-forest) 55%, var(--color-forest-600)) 75%,
      color-mix(in srgb, var(--color-forest-600) 90%, var(--color-forest-500)) 100%)`,
    accent:
      "radial-gradient(ellipse at 70% 20%, color-mix(in srgb, var(--color-brand-gold) 6%, transparent) 0%, transparent 55%)",
    mid: "radial-gradient(ellipse at 25% 80%, color-mix(in srgb, var(--color-forest-800) 60%, transparent) 0%, transparent 50%)",
    noise:
      "repeating-conic-gradient(color-mix(in srgb, var(--color-brand-ivory) 1.5%, transparent) 0% 25%, transparent 0% 50%)",
  },
};

export function HeroBackground({
  pillar,
  photo,
  overlayOpacity = 0.3,
  photoPosition = "center 40%",
  variant = "dark",
  children,
}: HeroBackgroundProps) {
  const config = pillarConfigs[pillar];

  const customVars = useMemo(() => {
    const vars: Record<string, string> = {};
    for (const cfg of Object.values(pillarConfigs)) {
      if (cfg.customProperties) {
        Object.assign(vars, cfg.customProperties);
      }
    }
    return vars;
  }, []);

  const containerStyle = {
    position: "absolute" as const,
    inset: 0,
    zIndex: 0,
    ...customVars,
  };

  /* When a real photograph is provided, render it with overlay */
  if (photo) {
    const isLight = variant === "light";
    return (
      <div style={containerStyle}>
        {/* Layer 1: Real photograph */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${photo})`,
            backgroundSize: "cover",
            backgroundPosition: photoPosition,
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Layer 2: Readability overlay (gradient 1 of 2) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isLight
              ? `linear-gradient(
                  to right,
                  rgba(247, 244, 236, ${Math.round(overlayOpacity * 100 + 55)}%) 0%,
                  rgba(247, 244, 236, ${Math.round(overlayOpacity * 60 + 25)}%) 42%,
                  rgba(247, 244, 236, ${Math.round(overlayOpacity * 20)}%) 70%,
                  rgba(247, 244, 236, 0%) 100%
                )`
              : `linear-gradient(
                  to bottom,
                  color-mix(in srgb, var(--color-brand-forest) ${Math.round(overlayOpacity * 60)}%, transparent) 0%,
                  color-mix(in srgb, var(--color-brand-forest) ${Math.round(overlayOpacity * 80)}%, transparent) 40%,
                  color-mix(in srgb, var(--color-brand-forest) ${Math.round(overlayOpacity * 100)}%, transparent) 100%
                )`,
          }}
        />

        {/* Layer 3: Bottom fade to page background (gradient 2 of 2) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "150px",
            background:
              "linear-gradient(to top, var(--color-bg-primary) 0%, transparent 100%)",
          }}
        />

        {children}
      </div>
    );
  }

  /* Light editorial hero without photo: solid base + exactly 2 gradients */
  if (variant === "light" && !photo) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--color-bg-primary)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 75% 20%, color-mix(in srgb, var(--color-brand-gold) 6%, transparent) 0%, transparent 55%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, var(--color-ivory-200) 0%, transparent 40%)",
            opacity: 0.55,
          }}
        />
        {children}
      </div>
    );
  }

  /* Fallback depth: exactly two gradients (Article 6.2) + SVG silhouette */
  return (
    <div style={containerStyle}>
      {/* Gradient 1 of 2: Base */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: config.base,
        }}
      />

      {/* Gradient 2 of 2: Accent light */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: config.accent,
        }}
      />

      {/* Depth layer (not a gradient): Mountain silhouettes */}
      <svg
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.08,
        }}
      >
        <g fill="rgba(247, 244, 236, 0.5)">
          {Array.from({ length: 45 }).map((_, i) => {
            const x = (i / 45) * 1440;
            const h = 80 + Math.sin(i * 0.65) * 40 + Math.cos(i * 1.2) * 25;
            const w = 14 + Math.sin(i * 0.95) * 7;
            return (
              <g key={i}>
                <polygon
                  points={`${x},600 ${x - w},${600 - h} ${x + w},${600 - h}`}
                />
                <ellipse
                  cx={x}
                  cy={600 - h - 18}
                  rx={w * 2}
                  ry={22 + Math.sin(i) * 9}
                />
              </g>
            );
          })}
        </g>
      </svg>

      {children}
    </div>
  );
}
