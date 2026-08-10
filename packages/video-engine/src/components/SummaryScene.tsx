/**
 * Bhavya Video Engine — Summary Scene Component
 *
 * Renders key takeaways and next topic preview.
 * Used for lesson endings in educational videos.
 *
 * @component
 */

import type { SummaryScene as SummarySceneType } from "../types";

export interface SummarySceneProps extends SummarySceneType {
  theme?: {
    colors: { primary: string; secondary: string; accent: string; background: string; surface: string };
    typography: { heading: string; body: string };
  };
}

export function SummaryScene({
  title,
  keyPoints,
  nextTopic,
  accentColor = "#c9a227",
  theme,
}: SummarySceneProps) {
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
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: colors.background,
        padding: "80px",
        fontFamily: fonts.body,
      }}
    >
      <div
        style={{
          fontSize: "14px",
          color: accentColor,
          letterSpacing: "3px",
          textTransform: "uppercase",
          marginBottom: "16px",
          fontWeight: 600,
        }}
      >
        Key Takeaways
      </div>

      <h2
        style={{
          fontSize: "48px",
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
          flexDirection: "column",
          gap: "20px",
          maxWidth: "700px",
          width: "100%",
        }}
      >
        {keyPoints.map((point, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "16px",
              padding: "20px 24px",
              background: colors.surface,
              borderRadius: "12px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: accentColor + "15",
                color: accentColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {i + 1}
            </div>
            <div
              style={{
                fontSize: "19px",
                color: colors.primary,
                lineHeight: 1.5,
              }}
            >
              {point}
            </div>
          </div>
        ))}
      </div>

      {nextTopic && (
        <div
          style={{
            marginTop: "48px",
            padding: "20px 32px",
            background: accentColor + "10",
            borderRadius: "12px",
            border: `1px solid ${accentColor}25`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: accentColor,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "6px",
              fontWeight: 600,
            }}
          >
            Up Next
          </div>
          <div
            style={{
              fontSize: "20px",
              color: colors.primary,
              fontWeight: 600,
            }}
          >
            {nextTopic}
          </div>
        </div>
      )}
    </div>
  );
}
