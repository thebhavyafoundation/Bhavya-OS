/**
 * @bhavya/platform-ui — EditorialDiagram
 *
 * Accessible, static-first editorial diagram.
 *
 * Renders a Bhavya-owned SVG inside `<figure>` with an accessible image name,
 * optional caption, detailed text alternative, and download/full-size links.
 * Static SVG is preferred (no client JavaScript). Inline SVG is opt-out only
 * and must pass sanitisation / duplicate-ID / CSP checks elsewhere.
 */

"use client";

import React, { useCallback, useState } from "react";

export type EditorialDiagramProps = {
  src: string;
  title: string;
  description: string;
  caption?: string;
  transcriptHref?: string;
  downloadHref?: string;
  width: number;
  height: number;
  priority?: boolean;
  theme?: "light" | "dark" | "auto";
};

export function EditorialDiagram({
  src,
  title,
  description,
  caption,
  transcriptHref,
  downloadHref,
  width,
  height,
  priority = false,
  theme = "auto",
}: EditorialDiagramProps) {
  const [error, setError] = useState(false);

  const handleError = useCallback(() => setError(true), []);

  const aspect = (height && width ? height / width : 1) * 100;

  const figureStyle: React.CSSProperties = {
    display: "block",
    maxWidth: "100%",
    margin: 0,
    minHeight: aspect ? `${aspect}%` : undefined,
  };

  const imgStyle: React.CSSProperties = {
    width: "100%",
    height: "auto",
    display: "block",
    margin: 0,
  };

  return (
    <figure
      data-theme={theme}
      className="relative bg-transparent border-none rounded-none p-0 m-0"
      style={figureStyle}
    >
      <img
        src={src}
        alt={title}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={imgStyle}
        onError={handleError}
      />

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-text-tertiary bg-bg-tertiary border border-border-primary rounded-lg">
          <p className="text-center">{title}</p>
          <p className="text-xs text-text-muted">{description}</p>
        </div>
      )}

      {caption || transcriptHref || downloadHref ? (
        <figcaption className="mt-2 text-text-secondary text-sm leading-relaxed">
          {caption}
          <div className="mt-1 flex flex-wrap gap-3 text-xs text-text-muted">
            {transcriptHref && (
              <a
                href={transcriptHref}
                className="underline underline-offset-2 hover:text-accent-gold transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Detailed description
              </a>
            )}
            {downloadHref && (
              <a
                href={downloadHref}
                download
                className="underline underline-offset-2 hover:text-accent-gold transition-colors"
              >
                Download SVG
              </a>
            )}
            <a
              href={src}
              className="underline underline-offset-2 hover:text-accent-gold transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open full size
            </a>
          </div>
        </figcaption>
      ) : null}
    </figure>
  );
}
