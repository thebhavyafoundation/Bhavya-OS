/**
 * Bhavya Video Engine — Definition Scene Component
 *
 * Renders a term definition with pronunciation, etymology, and examples.
 * Used for vocabulary building in educational videos.
 *
 * @component
 */

import type { DefinitionScene as DefinitionSceneType } from "../types";

export interface DefinitionSceneProps extends DefinitionSceneType {
  theme?: {
    colors: { primary: string; secondary: string; accent: string; background: string };
    typography: { heading: string; body: string; code: string };
  };
}

export function DefinitionScene({
  term,
  definition,
  pronunciation,
  etymology,
  examples,
  accentColor = "#c9a227",
  theme,
}: DefinitionSceneProps) {
  const colors = theme?.colors ?? {
    primary: "#1a3a2a",
    secondary: "#c9a227",
    accent: "#8a7359",
    background: "#f5f1e6",
  };
  const fonts = theme?.typography ?? {
    heading: "Playfair Display, serif",
    body: "Inter, sans-serif",
    code: "JetBrains Mono, monospace",
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
      {/* Term label */}
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
        Definition
      </div>

      {/* Term */}
      <h2
        style={{
          fontSize: "56px",
          fontWeight: 700,
          color: colors.primary,
          margin: "0",
          fontFamily: fonts.heading,
        }}
      >
        {term}
      </h2>

      {/* Pronunciation */}
      {pronunciation && (
        <div
          style={{
            fontSize: "20px",
            color: colors.primary + "80",
            marginTop: "12px",
            fontFamily: fonts.code,
          }}
        >
          /{pronunciation}/
        </div>
      )}

      {/* Definition text */}
      <div
        style={{
          marginTop: "40px",
          padding: "32px 48px",
          background: colors.primary + "08",
          borderRadius: "16px",
          borderLeft: `4px solid ${accentColor}`,
          maxWidth: "800px",
        }}
      >
        <p
          style={{
            fontSize: "24px",
            color: colors.primary,
            lineHeight: 1.6,
            margin: 0,
            fontStyle: "italic",
          }}
        >
          {definition}
        </p>
      </div>

      {/* Etymology */}
      {etymology && (
        <div
          style={{
            marginTop: "24px",
            fontSize: "16px",
            color: colors.primary + "88",
          }}
        >
          Origin: {etymology}
        </div>
      )}

      {/* Examples */}
      {examples && examples.length > 0 && (
        <div
          style={{
            marginTop: "40px",
            display: "flex",
            gap: "24px",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "900px",
          }}
        >
          {examples.map((ex, i) => (
            <div
              key={i}
              style={{
                padding: "16px 24px",
                background: colors.primary + "06",
                borderRadius: "12px",
                border: `1px solid ${colors.primary}15`,
                fontSize: "16px",
                color: colors.primary + "cc",
              }}
            >
              &quot;{ex}&quot;
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
