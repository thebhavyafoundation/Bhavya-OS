/**
 * Bhavya Video Engine — Comparison Scene Component
 *
 * Renders a side-by-side comparison of two items.
 * Used for contrasting concepts in educational videos.
 *
 * @component
 */

import type { ComparisonScene as ComparisonSceneType } from "../types";

export interface ComparisonSceneProps extends ComparisonSceneType {
  theme?: {
    colors: { primary: string; secondary: string; accent: string; background: string; surface: string };
    typography: { heading: string; body: string };
  };
}

export function ComparisonScene({
  title,
  left,
  right,
  accentColor = "#c9a227",
  theme,
}: ComparisonSceneProps) {
  const colors = theme?.colors ?? {
    primary: "#1a3a2a",
    secondary: "#c9a227",
    accent: "#8a7359",
    background: "#f5f1e6",
    surface: "#ffffff",
  };
  const fonts = theme?.typography ?? {
    heading: "Playfair Display, serif",
    body: "Inter, sans-serif",
  };

  const leftColor = left.color ?? accentColor;
  const rightColor = right.color ?? colors.accent;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: colors.background,
        padding: "60px 80px",
        fontFamily: fonts.body,
      }}
    >
      <h2
        style={{
          fontSize: "42px",
          fontWeight: 700,
          color: colors.primary,
          margin: "0 0 48px 0",
          fontFamily: fonts.heading,
          textAlign: "center",
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "flex",
          flex: 1,
          gap: "40px",
        }}
      >
        {/* Left side */}
        <div
          style={{
            flex: 1,
            background: colors.surface,
            borderRadius: "20px",
            padding: "40px",
            borderTop: `4px solid ${leftColor}`,
          }}
        >
          <h3
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: leftColor,
              margin: "0 0 24px 0",
              fontFamily: fonts.heading,
            }}
          >
            {left.title}
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {left.points.map((point, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  fontSize: "18px",
                  color: colors.primary + "cc",
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    color: leftColor,
                    fontSize: "20px",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                >
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Center divider */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "2px",
              flex: 1,
              background: `linear-gradient(180deg, transparent, ${colors.primary}20, transparent)`,
            }}
          />
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: colors.primary + "40",
              padding: "8px",
            }}
          >
            VS
          </div>
          <div
            style={{
              width: "2px",
              flex: 1,
              background: `linear-gradient(180deg, transparent, ${colors.primary}20, transparent)`,
            }}
          />
        </div>

        {/* Right side */}
        <div
          style={{
            flex: 1,
            background: colors.surface,
            borderRadius: "20px",
            padding: "40px",
            borderTop: `4px solid ${rightColor}`,
          }}
        >
          <h3
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: rightColor,
              margin: "0 0 24px 0",
              fontFamily: fonts.heading,
            }}
          >
            {right.title}
          </h3>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {right.points.map((point, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  fontSize: "18px",
                  color: colors.primary + "cc",
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    color: rightColor,
                    fontSize: "20px",
                    marginTop: "2px",
                    flexShrink: 0,
                  }}
                >
                  ✗
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
