"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import { prefersReducedMotion } from "@/lib/motion/apple-springs";

const Model3D = dynamic(
  () => import("@/components/three/Model3D").then((mod) => mod.Model3D),
  { ssr: false, loading: () => <Hero3DFallback /> }
);

const Hero3DCanvas = dynamic(
  () => import("./Hero3DCanvas").then((mod) => mod.Hero3DCanvas),
  { ssr: false, loading: () => <Hero3DFallback /> }
);

function Hero3DFallback() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, var(--color-forest-50), var(--color-ivory-100))",
        borderRadius: "var(--radius-xl)",
      }}
    >
      <div style={{ textAlign: "center", color: "var(--color-text-secondary)" }}>
        <div
          style={{
            width: "80px",
            height: "80px",
            border: "3px solid var(--color-border-primary)",
            borderTopColor: "var(--color-accent-gold)",
            borderRadius: "50%",
            margin: "0 auto var(--space-6)",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ fontSize: "var(--text-lg)" }}>Loading 3D scene...</p>
      </div>
    </div>
  );
}

const bandScenes: Record<string, { preset: string; positions: number[][] }> = {
  "junior-a": { preset: "forest", positions: [[0, 0, 5], [0, 2, 8], [2, 1, 6]] },
  "junior-b": { preset: "sunset", positions: [[0, 0, 5], [0, 2, 8], [2, 1, 6]] },
  "0": { preset: "forest", positions: [[0, 0, 5], [0, 2, 8], [2, 1, 6]] },
  "1": { preset: "city", positions: [[0, 0, 5], [0, 2, 8], [2, 1, 6]] },
  "2": { preset: "forest", positions: [[0, 0, 5], [0, 2, 8], [2, 1, 6]] },
  "3": { preset: "sunset", positions: [[0, 0, 5], [0, 2, 8], [2, 1, 6]] },
  "4": { preset: "forest", positions: [[0, 0, 5], [0, 2, 8], [2, 1, 6]] },
  "5": { preset: "city", positions: [[0, 0, 5], [0, 2, 8], [2, 1, 6]] },
  "6": { preset: "sunset", positions: [[0, 0, 5], [0, 2, 8], [2, 1, 6]] },
  "7": { preset: "forest", positions: [[0, 0, 5], [0, 2, 8], [2, 1, 6]] },
};

interface CurriculumHero3DProps {
  band?: "junior-a" | "junior-b" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7";
  moduleId?: string;
  assetUrl?: string;
  titleLines?: string[];
  subtitle?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  variant?: "forest" | "ivory" | "gold" | "auto";
  showScrollIndicator?: boolean;
  className?: string;
}

export function CurriculumHero3D({
  band = "0",
  moduleId,
  assetUrl,
  titleLines = ["Bhavya Academy", "Curriculum"],
  subtitle = "Structured AI learning for ages 6–18",
  primaryCTA = { label: "Start Learning", href: "/curriculum/levels/0" },
  secondaryCTA = { label: "View All Levels", href: "/curriculum/levels" },
  variant = "auto",
  showScrollIndicator = true,
  className = "",
}: CurriculumHero3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    setPrefersReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setIsLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "200px", threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!showScrollIndicator) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollY / maxScroll, 1);
      const indicator = document.querySelector(".hero-scroll-progress-fill");
      if (indicator) {
        (indicator as HTMLElement).style.transform = `scaleX(${progress})`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showScrollIndicator]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "PageDown" || e.key === "ArrowDown") {
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
      } else if (e.key === "PageUp" || e.key === "ArrowUp") {
        e.preventDefault();
        window.scrollBy({ top: -window.innerHeight * 0.8, behavior: "smooth" });
      }
    };

    if (prefersReduced) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [prefersReduced]);

  const sceneConfig = bandScenes[band] || bandScenes["0"];

  return (
    <section
      ref={containerRef}
      id="curriculum-hero"
      className={`curriculum-hero-3d ${variant === "forest" ? "hero-forest" : variant === "ivory" ? "hero-ivory" : ""} ${className}`}
      style={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
        ...(variant === "forest" ? { background: "var(--color-brand-forest)" } : variant === "ivory" ? { background: "var(--color-ivory-200)" } : { background: "var(--color-bg-primary)" }),
      }}
      aria-labelledby="hero-title"
    >
      {isLoaded && !prefersReduced && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <Hero3DCanvas
            band={band}
            moduleId={moduleId}
            assetUrl={assetUrl}
            sceneConfig={sceneConfig}
          />
        </div>
      )}

      {(prefersReduced || !isLoaded) && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background:
              variant === "forest"
                ? "var(--color-brand-forest)"
                : variant === "ivory"
                ? "var(--color-ivory-200)"
                : "var(--color-bg-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
        </div>
      )}

      <div
        className="hero-content container"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "var(--max-w-wide)",
          margin: "0 auto",
          padding: "calc(var(--header-h) + var(--space-16)) var(--space-8) var(--space-16)",
          textAlign: "center",
        }}
        id="hero-content"
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            padding: "6px 16px",
            borderRadius: "var(--radius-full)",
            background: "rgba(14, 56, 46, 0.08)",
            border: "1px solid rgba(14, 56, 46, 0.15)",
            fontSize: "var(--text-xs)",
            fontWeight: 600,
            color: "var(--color-brand-forest)",
            marginBottom: "var(--space-6)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Academy / Curriculum
        </span>

        <div style={{ marginBottom: "var(--space-8)" }}>
          {titleLines.map((line, index) => (
            <h1
              key={index}
              id="hero-title"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.75rem, 5.5vw, 4.5rem)",
                fontWeight: 400,
                color: variant === "forest" ? "var(--color-text-inverse)" : "var(--color-brand-forest)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                marginBottom: index === titleLines.length - 1 ? "var(--space-8)" : "var(--space-2)",
                opacity: 0,
                transform: "translateY(50px)",
                transition: `opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.15}s, transform 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.15}s`,
              }}
            >
              {line}
            </h1>
          ))}
        </div>

        <p
          style={{
            fontSize: "var(--text-lg)",
            color: variant === "forest" ? "rgba(247, 244, 236, 0.8)" : "var(--color-text-secondary)",
            maxWidth: "600px",
            margin: "0 auto var(--space-10)",
            lineHeight: 1.7,
          }}
        >
          {subtitle}
        </p>

        <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap", marginBottom: "var(--space-16)" }}>
          <a
            href={primaryCTA.href}
            className="btn btn-primary"
            style={{ minHeight: "48px", padding: "16px 32px" }}
          >
            {primaryCTA.label}
          </a>
          <a
            href={secondaryCTA.href}
            className="btn btn-secondary"
            style={{ minHeight: "48px", padding: "16px 32px" }}
          >
            {secondaryCTA.label}
          </a>
        </div>

        <div style={{ display: "flex", gap: "var(--space-12)", justifyContent: "center", flexWrap: "wrap", marginBottom: "var(--space-16)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, color: variant === "forest" ? "var(--color-text-inverse)" : "var(--color-brand-forest)", lineHeight: 1 }}>86</div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Modules</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, color: variant === "forest" ? "var(--color-text-inverse)" : "var(--color-brand-forest)", lineHeight: 1 }}>4</div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Tracks</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, color: variant === "forest" ? "var(--color-text-inverse)" : "var(--color-brand-forest)", lineHeight: 1 }}>6–18</div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Ages</div>
          </div>
        </div>

        {showScrollIndicator && (
          <div
            className="hero-scroll-cue"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-3)",
              minHeight: "44px",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              letterSpacing: "0.04em",
              color: variant === "forest" ? "rgba(247, 244, 236, 0.6)" : "var(--color-text-secondary)",
              textDecoration: "none",
              marginTop: "auto",
              paddingBottom: "var(--space-8)",
            }}
          >
            Scroll to explore
            <div className="hero-scroll-mouse" style={{ position: "relative", display: "inline-block", width: "22px", height: "34px", border: "1.5px solid currentColor", borderRadius: "12px", flexShrink: 0 }}>
              <div className="hero-scroll-wheel" style={{ position: "absolute", top: "6px", left: "50%", width: "3px", height: "7px", marginLeft: "-1.5px", borderRadius: "var(--radius-full)", background: "currentColor", animation: "hero-scroll-wheel 1.6s ease-in-out infinite" }} />
            </div>
          </div>
        )}

        <div
          className="scroll-indicator"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "var(--color-border-secondary)",
            borderRadius: "2px",
            overflow: "hidden",
            zIndex: 10,
          }}
          aria-hidden="true"
        >
          <div
            className="scroll-indicator-fill"
            style={{
              height: "100%",
              background: "linear-gradient(90deg, var(--color-brand-forest), var(--color-accent-gold))",
              transformOrigin: "left",
              transform: "scaleX(0)",
            }}
          />
</div>
    </div>
  </section>
  );
}

const bandColors: Record<string, string> = {
  "junior-a": "rgba(16, 185, 129, 0.5)",
  "junior-b": "rgba(245, 158, 11, 0.5)",
  "0": "rgba(14, 56, 46, 0.3)",
  "1": "rgba(14, 56, 46, 0.3)",
  "2": "rgba(14, 56, 46, 0.3)",
  "3": "rgba(245, 158, 11, 0.3)",
  "4": "rgba(14, 56, 46, 0.3)",
  "5": "rgba(14, 56, 46, 0.3)",
  "6": "rgba(245, 158, 11, 0.3)",
  "7": "rgba(212, 175, 55, 0.3)",
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

