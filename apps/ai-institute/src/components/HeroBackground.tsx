"use client";

/**
 * HeroBackground — Real photography + atmospheric overlay system
 *
 * When a `photo` prop is provided, renders a real photograph with
 * subtle gradient overlay for text readability. Falls back to
 * multi-layer gradient system when no photo is available.
 *
 * Layers (photo mode): photograph → dark overlay → vignette → bottom fade
 * Layers (fallback): base gradient → accent → mid-tone → noise → mountains → vignette → fade
 */

type PillarType = "forest" | "knowledge" | "heritage" | "community" | "home";

interface HeroBackgroundProps {
  pillar: PillarType;
  /** Path to real photograph in /photography/ directory */
  photo?: string;
  /** Custom overlay opacity (default: 0.45) */
  overlayOpacity?: number;
  /** Custom object-position for the photo */
  photoPosition?: string;
  children?: React.ReactNode;
}

const pillarConfigs: Record<
  PillarType,
  {
    base: string;
    accent: string;
    mid: string;
    noise: string;
  }
> = {
  home: {
    base: "linear-gradient(160deg, #041f16 0%, #0a3025 25%, #0e382e 50%, #14543e 75%, #1a6b4f 100%)",
    accent: "radial-gradient(ellipse at 70% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 60%)",
    mid: "radial-gradient(ellipse at 30% 80%, rgba(14, 56, 46, 0.6) 0%, transparent 50%)",
    noise: "repeating-conic-gradient(rgba(247,244,236,0.015) 0% 25%, transparent 0% 50%)",
  },
  forest: {
    base: "linear-gradient(160deg, #021a12 0%, #062e1f 25%, #0e382e 50%, #166044 75%, #1a7a52 100%)",
    accent: "radial-gradient(ellipse at 60% 30%, rgba(34, 139, 87, 0.12) 0%, transparent 55%)",
    mid: "radial-gradient(ellipse at 20% 70%, rgba(6, 46, 31, 0.7) 0%, transparent 50%)",
    noise: "repeating-conic-gradient(rgba(247,244,236,0.012) 0% 25%, transparent 0% 50%)",
  },
  knowledge: {
    base: "linear-gradient(160deg, #0a1628 0%, #122240 25%, #1a3358 50%, #1e3d6a 75%, #234a7a 100%)",
    accent: "radial-gradient(ellipse at 65% 25%, rgba(212, 175, 55, 0.06) 0%, transparent 55%)",
    mid: "radial-gradient(ellipse at 25% 75%, rgba(18, 34, 64, 0.7) 0%, transparent 50%)",
    noise: "repeating-conic-gradient(rgba(247,244,236,0.01) 0% 25%, transparent 0% 50%)",
  },
  heritage: {
    base: "linear-gradient(160deg, #1a0f08 0%, #2d1a0e 25%, #3d2516 50%, #4d301e 75%, #5d3c26 100%)",
    accent: "radial-gradient(ellipse at 55% 35%, rgba(212, 175, 55, 0.08) 0%, transparent 55%)",
    mid: "radial-gradient(ellipse at 30% 65%, rgba(45, 26, 14, 0.7) 0%, transparent 50%)",
    noise: "repeating-conic-gradient(rgba(247,244,236,0.012) 0% 25%, transparent 0% 50%)",
  },
  community: {
    base: "linear-gradient(160deg, #041f16 0%, #0b3528 25%, #0e382e 50%, #14503c 75%, #1a684e 100%)",
    accent: "radial-gradient(ellipse at 70% 20%, rgba(212, 175, 55, 0.06) 0%, transparent 55%)",
    mid: "radial-gradient(ellipse at 25% 80%, rgba(11, 53, 40, 0.6) 0%, transparent 50%)",
    noise: "repeating-conic-gradient(rgba(247,244,236,0.015) 0% 25%, transparent 0% 50%)",
  },
};

export function HeroBackground({ pillar, photo, overlayOpacity = 0.45, photoPosition = "center 40%", children }: HeroBackgroundProps) {
  const config = pillarConfigs[pillar];

  /* When a real photograph is provided, render it with overlay */
  if (photo) {
    return (
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
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

        {/* Layer 2: Dark gradient overlay for text readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(
              to bottom,
              rgba(14, 56, 46, ${overlayOpacity * 0.6}) 0%,
              rgba(14, 56, 46, ${overlayOpacity * 0.8}) 40%,
              rgba(14, 56, 46, ${overlayOpacity}) 100%
            )`,
          }}
        />

        {/* Layer 3: Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.25) 100%)",
          }}
        />

        {/* Layer 4: Bottom fade to page background */}
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

  /* Fallback: Multi-layer gradient system */
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      {/* Layer 1: Base gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: config.base,
        }}
      />

      {/* Layer 2: Accent light */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: config.accent,
        }}
      />

      {/* Layer 3: Mid-tone depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: config.mid,
        }}
      />

      {/* Layer 4: Subtle noise texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: config.noise,
          backgroundSize: "4px 4px",
          opacity: 0.5,
        }}
      />

      {/* Layer 5: Mountain silhouettes */}
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

      {/* Layer 6: Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* Layer 7: Bottom fade to page background */}
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