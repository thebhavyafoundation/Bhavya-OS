/**
 * Bhavya Video Engine — Title Scene Component
 *
 * Renders a title card with course/module/lesson context.
 * Used as the opening scene for educational videos.
 *
 * @component
 */

import type { TitleScene as TitleSceneType } from "../types";

export interface TitleSceneProps extends TitleSceneType {
  theme?: {
    colors: { primary: string; secondary: string; background: string; surface: string };
    typography: { heading: string; body: string };
  };
}

export function TitleScene({
  title,
  subtitle,
  courseTitle,
  moduleTitle,
  lessonNumber,
  accentColor = "#c9a227",
  theme,
}: TitleSceneProps) {
  const colors = theme?.colors ?? {
    primary: "#1a3a2a",
    secondary: "#c9a227",
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
      {courseTitle && (
        <div
          style={{
            fontSize: "18px",
            color: accentColor,
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: "16px",
            fontWeight: 500,
          }}
        >
          {courseTitle}
        </div>
      )}

      {moduleTitle && (
        <div
          style={{
            fontSize: "14px",
            color: colors.primary + "80",
            marginBottom: "24px",
          }}
        >
          {moduleTitle}
        </div>
      )}

      <h1
        style={{
          fontSize: "64px",
          fontWeight: 700,
          color: colors.primary,
          textAlign: "center",
          lineHeight: 1.1,
          margin: 0,
          fontFamily: fonts.heading,
          maxWidth: "900px",
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          style={{
            fontSize: "24px",
            color: colors.primary + "99",
            marginTop: "24px",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
      )}

      {lessonNumber !== undefined && (
        <div
          style={{
            marginTop: "48px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: colors.primary + "60",
            fontSize: "16px",
          }}
        >
          <span
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: accentColor,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {lessonNumber}
          </span>
          <span>Lesson {lessonNumber}</span>
        </div>
      )}

      {/* Decorative line */}
      <div
        style={{
          width: "120px",
          height: "3px",
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
          marginTop: "48px",
          borderRadius: "2px",
        }}
      />
    </div>
  );
}
