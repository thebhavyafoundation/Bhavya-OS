"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion/apple-springs";
import { aiModules } from "@/data/curriculum/ai-module-registry";
import { BAND_LABELS, BAND_AGES } from "@/lib/curriculum/bands";
import { getLessonsForModule } from "@/lib/curriculum/lessons";
import { VisualComponent } from "./VisualComponent";
import { resolveAssetUrl } from "@/lib/assetUrls";
import { Card3D } from "@/components/three/Card3D";

gsap.registerPlugin(ScrollTrigger);

interface BentoModuleGridProps {
  /** Filter by band */
  band?:
    "junior-a" | "junior-b" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
  /** Maximum number of modules to show */
  limit?: number;
  /** Grid layout variant */
  variant?: "bento" | "masonry" | "grid" | "list";
  /** Show progress for authenticated user */
  showProgress?: boolean;
  /** User ID for progress */
  userId?: string;
  /** Custom className */
  className?: string;
  /** Stagger delay between cards */
  stagger?: number;
  /** Animation duration */
  duration?: number;
}

const bandGradients: Record<string, string> = {
  "junior-a": "linear-gradient(135deg, #10b981, #059669)",
  "junior-b": "linear-gradient(135deg, #f59e0b, #d97706)",
  "0": "linear-gradient(135deg, #0e382e, #064e3b)",
  "1": "linear-gradient(135deg, #0e382e, #064e3b)",
  "2": "linear-gradient(135deg, #0e382e, #064e3b)",
  "3": "linear-gradient(135deg, #f59e0b, #d97706)",
  "4": "linear-gradient(135deg, #0e382e, #064e3b)",
  "5": "linear-gradient(135deg, #0e382e, #064e3b)",
  "6": "linear-gradient(135deg, #f59e0b, #d97706)",
  "7": "linear-gradient(135deg, #c8a94a, #b89540)",
};

const bandIcons: Record<string, string> = {
  "junior-a": "🌱",
  "junior-b": "🌿",
  "0": "🌲",
  "1": "🌳",
  "2": "🌲",
  "4": "🌲",
  "5": "🌲",
  "6": "🌿",
  "7": "🏆",
};

export function BentoModuleGrid({
  band,
  limit = 12,
  variant = "bento",
  showProgress = false,
  userId,
  className = "",
  stagger = 0.08,
  duration = 0.6,
}: BentoModuleGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [modules, setModules] = useState(() => {
    let filtered = [...aiModules];
    if (band) {
      filtered = filtered.filter((m) => m.band === band);
    }
    return filtered.slice(0, limit);
  });

  useEffect(() => {
    setPrefersReduced(prefersReducedMotion());
  }, []);

  // Build entrance animation
  useEffect(() => {
    if (prefersReduced) return;

    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll(".bento-card");
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: duration ?? 0.6,
        ease: "power3.out",
        stagger: stagger ?? 0.08,
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
      });
    }, container);

    return () => ctx.revert();
  }, [stagger, duration, prefersReduced]);

  // Filter modules by band
  useEffect(() => {
    let filtered = [...aiModules];
    if (band) {
      filtered = filtered.filter((m) => m.band === band);
    }
    setModules(filtered.slice(0, limit));
  }, [band, limit]);

  const bandLabel = band
    ? BAND_LABELS[band as keyof typeof BAND_LABELS]
    : "All Levels";
  const bandAge = band ? BAND_AGES[band as keyof typeof BAND_AGES] : "";
  const gradient = bandGradients[band || "0"];
  const icon = bandIcons[band || "0"];

  if (variant === "list") {
    return (
      <div
        className={`bento-module-grid bento-list ${className}`}
        ref={containerRef}
      >
        {modules.map((mod, index) => (
          <Link
            key={mod.id}
            href={`/curriculum/modules/${mod.id}`}
            className="bento-card bento-list-item"
            style={{
              opacity: 0,
              transform: "translateY(30px)",
              transition: `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${index * (stagger * 1000)}ms, transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${index * (stagger * 1000)}ms`,
            }}
          >
            <div className="bento-list-content">
              <div className="bento-list-meta">
                <span
                  className="bento-band-badge"
                  style={{ background: gradient }}
                >
                  {bandLabel}
                </span>
                <span className="bento-level">Level {mod.level}</span>
              </div>
              <h3 className="bento-title">{mod.title}</h3>
              <p className="bento-desc">{mod.description}</p>
              <div className="bento-tags">
                {mod.topics.slice(0, 3).map((topic) => (
                  <span key={topic} className="bento-tag">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
            <div className="bento-arrow" aria-hidden="true">
              →
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`bento-module-grid bento-${variant} ${className}`}
      style={{
        display: "grid",
        gridTemplateColumns:
          variant === "bento"
            ? "repeat(auto-fill, minmax(320px, 1fr))"
            : variant === "masonry"
              ? "repeat(auto-fill, minmax(300px, 1fr))"
              : "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "var(--space-6)",
      }}
      data-reveal="stagger"
    >
      {modules.map((mod, index) => (
        <Link
          key={mod.id}
          href={`/curriculum/modules/${mod.id}`}
          className="bento-card"
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            padding: "var(--space-6)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-primary)",
            borderRadius: "var(--radius-xl)",
            textDecoration: "none",
            color: "inherit",
            transition: "all var(--duration-normal) var(--ease-out)",
            overflow: "hidden",
            opacity: prefersReduced ? 1 : 0,
            transform: prefersReduced ? "none" : "translateY(30px)",
            willChange: "transform, box-shadow, border-color",
            ...(variant === "bento" &&
              index % 3 === 0 && {
                gridColumn: "span 2",
                gridRow: "span 2",
              }),
            ...(variant === "bento" &&
              index % 5 === 0 && {
                gridColumn: "span 2",
              }),
          }}
          onMouseEnter={(e) => {
            if (prefersReduced) return;
            const card = e.currentTarget as HTMLElement;
            gsap.to(card, {
              y: -8,
              boxShadow: "var(--shadow-xl)",
              borderColor: "var(--color-border-gold)",
              duration: 0.3,
              ease: "power2.out",
            });
          }}
          onMouseLeave={(e) => {
            if (prefersReduced) return;
            const card = e.currentTarget as HTMLElement;
            gsap.to(card, {
              y: 0,
              boxShadow: "var(--shadow-sm)",
              borderColor: "var(--color-border-primary)",
              duration: 0.3,
              ease: "power2.out",
            });
          }}
        >
          {/* Gradient border top */}
          <div
            className="bento-gradient-border"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background:
                bandGradients[band || mod.band] || bandGradients[mod.band],
              opacity: 0,
              transition: "opacity var(--duration-fast) ease",
            }}
          />

          {/* Visual Preview */}
          {mod.recommendedAssetUrl &&
            mod.recommendedAssetUrl !==
              "github:models/kenney/[to-be-downloaded].glb" && (
              <div
                className="bento-visual"
                style={{
                  aspectRatio: "16/9",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  marginBottom: "var(--space-4)",
                  background: "var(--color-surface-2)",
                }}
              >
                <VisualComponent
                  assetUrl={
                    resolveAssetUrl(mod.recommendedAssetUrl) ||
                    mod.recommendedAssetUrl
                  }
                  type={mod.visualFormat === "3d" ? "3d" : "2d"}
                  alt={`Visual for ${mod.title}`}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            )}

          {/* Content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* Band Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                marginBottom: "var(--space-3)",
                flexWrap: "wrap",
              }}
            >
              <span
                className="bento-band-badge"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "var(--space-1)",
                  padding: "var(--space-1) var(--space-3)",
                  borderRadius: "var(--radius-full)",
                  background: gradient,
                  color: "white",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <span aria-hidden="true">{icon}</span>
                {bandLabel}
              </span>
              {bandAge && (
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    padding: "var(--space-1) var(--space-2)",
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-surface-2)",
                  }}
                >
                  {bandAge}
                </span>
              )}
            </div>

            {/* Title */}
            <h3
              className="bento-title"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-lg)",
                fontWeight: 400,
                color: "var(--color-text-primary)",
                marginBottom: "var(--space-2)",
                lineHeight: 1.3,
              }}
            >
              {mod.title}
            </h3>

            {/* Description */}
            <p
              className="bento-desc"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
                marginBottom: "var(--space-4)",
                flex: 1,
              }}
            >
              {mod.description}
            </p>

            {/* Topics */}
            <div
              className="bento-tags"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-2)",
                marginBottom: "var(--space-4)",
              }}
            >
              {mod.topics.slice(0, 4).map((topic) => (
                <span
                  key={topic}
                  className="bento-tag"
                  style={{
                    fontSize: "var(--text-xs)",
                    padding: "var(--space-1) var(--space-2)",
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-surface-2)",
                    color: "var(--color-text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>

            {/* Progress / Meta */}
            <div
              className="bento-meta"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "var(--space-4)",
                borderTop: "1px solid var(--color-border-secondary)",
                fontSize: "var(--text-xs)",
              }}
            >
              <span style={{ color: "var(--color-text-muted)" }}>
                {mod.estimatedHours}h estimated
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-sm)",
                  fontWeight: 400,
                  color: "var(--color-accent-gold)",
                }}
              >
                {mod.bloomVerb || "understand"}
              </span>
            </div>
          </div>

          {/* Arrow */}
          <div
            className="bento-arrow"
            style={{
              position: "absolute",
              bottom: "var(--space-6)",
              right: "var(--space-6)",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "var(--color-surface-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-muted)",
              transition: "all var(--duration-fast) ease",
              opacity: 0,
              transform: "translateX(-10px)",
            }}
            aria-hidden="true"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}

/**
 * Module progress indicator for authenticated users
 */
export function ModuleProgressIndicator({
  moduleId,
  userId,
  className = "",
}: {
  moduleId: string;
  userId: string;
  className?: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fetch progress from API
    fetch(`/api/curriculum/progress?userId=${userId}&moduleId=${moduleId}`)
      .then((res) => res.json())
      .then((data) => setProgress(data.completion || 0))
      .catch(() => setProgress(0));
  }, [moduleId, userId]);

  return (
    <div
      className={`ai-progress-indicator ${className}`}
      style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}
    >
      <div
        style={{
          flex: 1,
          height: "6px",
          background: "var(--color-border-primary)",
          borderRadius: "var(--radius-full)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background:
              "linear-gradient(90deg, var(--color-brand-forest), var(--color-accent-gold))",
            borderRadius: "var(--radius-full)",
            transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
      <span
        style={{
          fontSize: "var(--text-xs)",
          color: "var(--color-text-muted)",
          fontWeight: 500,
          minWidth: "40px",
          textAlign: "right",
        }}
      >
        {Math.round(progress)}%
      </span>
    </div>
  );
}

/**
 * Level index page with bento grid
 */
export function LevelIndexGrid({
  level,
  className = "",
}: {
  level: string;
  className?: string;
}) {
  const modules = aiModules.filter((m) => m.level === level);
  const levelLabel =
    level === "jr-a"
      ? "Junior A"
      : level === "jr-b"
        ? "Junior B"
        : `Level ${level}`;
  const levelAge =
    level === "jr-a"
      ? "Ages 6–8"
      : level === "jr-b"
        ? "Ages 9–11"
        : level >= "7"
          ? "Ages 15+"
          : "Ages 12–15";

  return (
    <section
      className={`level-index-grid ${className}`}
      style={{ padding: "var(--space-16) 0" }}
    >
      <div className="container">
        <header
          style={{ marginBottom: "var(--space-12)", textAlign: "center" }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "var(--space-1) var(--space-4)",
              borderRadius: "var(--radius-full)",
              background: "rgba(14, 56, 46, 0.1)",
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--color-brand-forest)",
              marginBottom: "var(--space-4)",
            }}
          >
            {levelLabel} · {levelAge}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
              fontWeight: 400,
              color: "var(--color-brand-forest)",
              marginBottom: "var(--space-4)",
              lineHeight: 1.2,
            }}
          >
            {levelLabel} Modules
          </h1>
          <p
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--color-text-secondary)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            {modules.length} modules ·{" "}
            {modules.reduce((sum, m) => sum + m.estimatedHours, 0)} hours total
          </p>
        </header>

        <BentoModuleGrid
          band={level as ComponentProps<typeof BentoModuleGrid>["band"]}
          limit={modules.length}
          variant="bento"
        />
      </div>
    </section>
  );
}

/**
 * Curriculum timeline with progress
 */
export function CurriculumTimeline({
  userId,
  className = "",
}: {
  userId?: string;
  className?: string;
}) {
  const bands = [
    "junior-a",
    "junior-b",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
  ];

  return (
    <section
      className={`curriculum-timeline ${className}`}
      style={{ padding: "var(--space-16) 0" }}
    >
      <div className="container">
        <header
          style={{ marginBottom: "var(--space-12)", textAlign: "center" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              color: "var(--color-brand-forest)",
              marginBottom: "var(--space-4)",
            }}
          >
            Your Learning Journey
          </h2>
          <p
            style={{
              color: "var(--color-text-secondary)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Track your progress across all {aiModules.length} modules. Complete
            lessons to unlock the next level.
          </p>
        </header>

        <div
          className="ai-timeline"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-8)",
          }}
        >
          {bands.map((band) => {
            const modules = aiModules.filter((m) => m.band === band);
            const completed = userId
              ? modules.filter((m) => {
                  // Would fetch from API
                  return false;
                }).length
              : 0;

            const gradient = bandGradients[band];

            return (
              <div
                key={band}
                className="ai-band-timeline"
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border-primary)",
                  borderRadius: "var(--radius-xl)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "var(--space-5)",
                    background: gradient,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "var(--space-4)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-3)",
                    }}
                  >
                    <span style={{ fontSize: "2rem" }} aria-hidden="true">
                      {bandIcons[band]}
                    </span>
                    <div>
                      <span
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {BAND_LABELS[band as keyof typeof BAND_LABELS]}
                      </span>
                      <span
                        style={{ fontSize: "var(--text-sm)", opacity: 0.9 }}
                      >
                        {BAND_AGES[band as keyof typeof BAND_AGES]}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
                    {completed}/{modules.length} modules
                  </div>
                </div>
                <div style={{ padding: "var(--space-5)" }}>
                  <div
                    className="ai-progress-track"
                    style={{
                      height: "8px",
                      borderRadius: "var(--radius-full)",
                      background: "var(--color-border-primary)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="ai-progress-fill"
                      style={{
                        height: "100%",
                        borderRadius: "var(--radius-full)",
                        background:
                          "linear-gradient(90deg, var(--color-brand-forest), var(--color-accent-gold))",
                        width:
                          modules.length > 0
                            ? `${(completed / modules.length) * 100}%`
                            : "0%",
                        transition: "width 1s cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
