/**
 * Bhavya Video Engine — Chapter Marker Scene Component
 *
 * Renders a chapter/lesson marker card.
 * Used for section transitions in educational videos.
 *
 * @component
 */

import type { ChapterMarkerScene as ChapterMarkerSceneType } from "../types";

export interface ChapterMarkerSceneProps extends ChapterMarkerSceneType {
  theme?: {
    colors: { primary: string; secondary: string; background: string };
    typography: { heading: string; body: string };
  };
}

export function ChapterMarkerScene({
  chapterNumber,
  chapterTitle,
  lessonTitle,
  accentColor = "#c9a227",
  theme,
}: ChapterMarkerSceneProps) {
  const colors = theme?.colors ?? {
    primary: "#1a3a2a",
    secondary: "#c9a227",
    background: "#f5f1e6",
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
        background: colors.primary,
        fontFamily: fonts.body,
      }}
    >
      <div
        style={{
          fontSize: "16px",
          color: accentColor,
          letterSpacing: "4px",
          textTransform: "uppercase",
          marginBottom: "24px",
          fontWeight: 500,
        }}
      >
        Chapter {chapterNumber}
      </div>

      <h1
        style={{
          fontSize: "56px",
          fontWeight: 700,
          color: "#f5f1e6",
          margin: "0",
          fontFamily: fonts.heading,
          textAlign: "center",
          maxWidth: "800px",
          lineHeight: 1.2,
        }}
      >
        {chapterTitle}
      </h1>

      {lessonTitle && (
        <div
          style={{
            marginTop: "24px",
            fontSize: "20px",
            color: "#f5f1e699",
          }}
        >
          {lessonTitle}
        </div>
      )}

      {/* Decorative element */}
      <div
        style={{
          marginTop: "48px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            style={{
              width: i === 1 ? "40px" : "8px",
              height: "4px",
              borderRadius: "2px",
              background: i === 1 ? accentColor : accentColor + "40",
            }}
          />
        ))}
      </div>
    </div>
  );
}
