/**
 * Bhavya Video Engine — Assessment Scene Component
 *
 * Renders a multiple-choice question with answer reveal.
 * Used for quiz/test scenes in educational videos.
 *
 * @component
 */

import type { AssessmentScene as AssessmentSceneType } from "../types";

export interface AssessmentSceneProps extends AssessmentSceneType {
  reveal?: boolean;
  theme?: {
    colors: { primary: string; secondary: string; accent: string; background: string; surface: string };
    typography: { heading: string; body: string };
  };
}

export function AssessmentScene({
  question,
  options,
  correctIndex,
  explanation,
  reveal = false,
  accentColor = "#c9a227",
  theme,
}: AssessmentSceneProps) {
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
          marginBottom: "24px",
          fontWeight: 600,
        }}
      >
        Check Your Understanding
      </div>

      <h2
        style={{
          fontSize: "32px",
          fontWeight: 600,
          color: colors.primary,
          margin: "0 0 40px 0",
          textAlign: "center",
          maxWidth: "800px",
          lineHeight: 1.4,
        }}
      >
        {question}
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        {options.map((option, i) => {
          const isCorrect = i === correctIndex;
          const showResult = reveal && isCorrect;

          return (
            <div
              key={i}
              style={{
                padding: "20px 24px",
                background: showResult
                  ? "#22c55e18"
                  : colors.surface,
                borderRadius: "12px",
                border: `2px solid ${
                  showResult ? "#22c55e" : colors.primary + "15"
                }`,
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: showResult ? "#22c55e" : colors.primary + "10",
                  color: showResult ? "#fff" : colors.primary + "88",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {showResult ? "✓" : String.fromCharCode(65 + i)}
              </div>
              <div
                style={{
                  fontSize: "19px",
                  color: colors.primary,
                  lineHeight: 1.5,
                }}
              >
                {option}
              </div>
            </div>
          );
        })}
      </div>

      {reveal && (
        <div
          style={{
            marginTop: "32px",
            padding: "20px 32px",
            background: colors.surface,
            borderRadius: "12px",
            maxWidth: "600px",
            borderLeft: `4px solid ${accentColor}`,
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: accentColor,
              fontWeight: 600,
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Explanation
          </div>
          <div
            style={{
              fontSize: "17px",
              color: colors.primary + "cc",
              lineHeight: 1.6,
            }}
          >
            {explanation}
          </div>
        </div>
      )}
    </div>
  );
}
