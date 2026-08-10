/**
 * BotanicalMotifs — SVG decorative elements from brand system
 *
 * Organic vine curves, leaf nodes, and section dividers.
 * All values use CSS custom properties for theming.
 */

interface VineDividerProps {
  width?: string;
  height?: string;
  color?: string;
  opacity?: number;
  className?: string;
}

/**
 * Horizontal vine divider with leaf nodes
 * Used between sections to create organic visual separation
 */
export function VineDivider({
  width = "100%",
  height = "80px",
  color = "var(--color-accent-gold)",
  opacity = 0.3,
  className,
}: VineDividerProps) {
  return (
    <div
      style={{ width, height, position: "relative", overflow: "hidden" }}
      className={className}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {/* Main vine curve */}
        <path
          d="M0,40 Q150,20 300,40 Q450,60 600,40 Q750,20 900,40 Q1050,60 1200,40"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity={opacity}
        />
        {/* Secondary vine */}
        <path
          d="M0,45 Q200,25 400,45 Q600,65 800,45 Q1000,25 1200,45"
          stroke={color}
          strokeWidth="0.5"
          fill="none"
          opacity={opacity * 0.5}
        />
        {/* Leaf nodes */}
        <g opacity={opacity * 0.7} fill="var(--color-brand-forest)">
          <path d="M300,40 Q310,30 320,40 Q310,50 300,40Z" />
          <path d="M600,40 Q610,30 620,40 Q610,50 600,40Z" />
          <path d="M900,40 Q910,30 920,40 Q910,50 900,40Z" />
        </g>
        {/* Small leaf accents */}
        <g opacity={opacity * 0.4} fill="var(--color-brand-forest)">
          <path d="M150,32 Q155,27 160,32 Q155,37 150,32Z" />
          <path d="M450,48 Q455,43 460,48 Q455,53 450,48Z" />
          <path d="M750,32 Q755,27 760,32 Q755,37 750,32Z" />
          <path d="M1050,48 Q1055,43 1060,48 Q1055,53 1050,48Z" />
        </g>
      </svg>
    </div>
  );
}

interface BotanicalCornerProps {
  size?: number;
  color?: string;
  opacity?: number;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

/**
 * Corner botanical accent — organic leaf cluster
 * Used in hero sections and card corners
 */
export function BotanicalCorner({
  size = 120,
  color = "var(--color-accent-gold)",
  opacity = 0.15,
  position = "top-left",
}: BotanicalCornerProps) {
  const transforms: Record<string, string> = {
    "top-left": "rotate(0)",
    "top-right": "scale(-1, 1)",
    "bottom-left": "scale(1, -1)",
    "bottom-right": "scale(-1, -1)",
  };

  const positions: Record<string, React.CSSProperties> = {
    "top-left": { top: 0, left: 0 },
    "top-right": { top: 0, right: 0 },
    "bottom-left": { bottom: 0, left: 0 },
    "bottom-right": { bottom: 0, right: 0 },
  };

  return (
    <div
      style={{
        position: "absolute",
        ...positions[position],
        width: size,
        height: size,
        pointerEvents: "none",
        zIndex: 1,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 120"
        style={{ width: "100%", height: "100%", transform: transforms[position] }}
      >
        <g opacity={opacity} fill="none" stroke={color} strokeWidth="1">
          {/* Main stem */}
          <path d="M0,120 Q30,90 50,60 Q65,35 80,10" />
          {/* Branch 1 */}
          <path d="M20,100 Q35,85 45,70" />
          {/* Branch 2 */}
          <path d="M35,80 Q50,65 55,50" />
          {/* Branch 3 */}
          <path d="M50,60 Q60,45 70,25" />
        </g>
        <g opacity={opacity * 0.8} fill={color}>
          {/* Leaves */}
          <ellipse cx="50" cy="60" rx="8" ry="14" transform="rotate(-30 50 60)" />
          <ellipse cx="70" cy="35" rx="6" ry="11" transform="rotate(-20 70 35)" />
          <ellipse cx="35" cy="80" rx="7" ry="12" transform="rotate(-40 35 80)" />
          <ellipse cx="80" cy="15" rx="5" ry="9" transform="rotate(-15 80 15)" />
        </g>
        {/* Leaf veins */}
        <g opacity={opacity * 0.4} stroke={color} strokeWidth="0.5" fill="none">
          <line x1="46" y1="62" x2="54" y2="58" />
          <line x1="66" y1="37" x2="74" y2="33" />
          <line x1="31" y1="82" x2="39" y2="78" />
        </g>
      </svg>
    </div>
  );
}

interface MountainSilhouetteProps {
  opacity?: number;
  color?: string;
  className?: string;
}

/**
 * Mountain silhouette background layer
 * Used in hero sections for depth
 */
export function MountainSilhouette({
  opacity = 0.08,
  color = "rgba(247, 244, 236, 0.5)",
  className,
}: MountainSilhouetteProps) {
  return (
    <svg
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
      }}
      className={className}
    >
      <g fill={color}>
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
  );
}
