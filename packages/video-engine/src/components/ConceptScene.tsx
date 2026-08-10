/**
 * Bhavya Video Engine — Concept Scene Component
 *
 * Renders a concept explanation with icon, description, and bullet points.
 * Used for introducing new ideas in educational videos.
 *
 * @component
 */

import type { ConceptScene as ConceptSceneType } from "../types";

export interface ConceptSceneProps extends ConceptSceneType {
  theme?: {
    colors: { primary: string; secondary: string; accent: string; background: string; surface: string };
    typography: { heading: string; body: string };
  };
}

export function ConceptScene({
  concept,
  description,
  bulletPoints,
  visual,
  accentColor = "#c9a227",
  theme,
}: ConceptSceneProps) {
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

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        background: colors.background,
        fontFamily: fonts.body,
      }}
    >
      {/* Left: Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 60px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            color: accentColor,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "12px",
            fontWeight: 600,
          }}
        >
          Key Concept
        </div>

        <h2
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: colors.primary,
            margin: "0 0 24px 0",
            fontFamily: fonts.heading,
            lineHeight: 1.2,
          }}
        >
          {concept}
        </h2>

        <p
          style={{
            fontSize: "22px",
            color: colors.primary + "cc",
            lineHeight: 1.6,
            margin: "0 0 32px 0",
            maxWidth: "600px",
          }}
        >
          {description}
        </p>

        {bulletPoints && bulletPoints.length > 0 && (
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
            {bulletPoints.map((point, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  fontSize: "18px",
                  color: colors.primary + "dd",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: accentColor,
                    marginTop: "8px",
                    flexShrink: 0,
                  }}
                />
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right: Visual */}
      {visual && (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: colors.surface,
            borderRadius: "24px 0 0 24px",
            padding: "60px",
          }}
        >
          <div
            style={{
              fontSize: "120px",
              lineHeight: 1,
              filter: "grayscale(20%)",
            }}
          >
            {visual.source}
          </div>
        </div>
      )}
    </div>
  );
}
