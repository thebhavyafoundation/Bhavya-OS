"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { EASING, PILLAR_COLORS, PILLAR_SCENES, NOISE } from "@/lib/three/setup";

interface Card3DProps {
  children: React.ReactNode;
  pillar?: "forest" | "knowledge" | "heritage" | "community" | "home";
  tiltIntensity?: number;
  hoverScale?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  href?: string;
  aspectRatio?: number;
  enableOrbit?: boolean;
  showGlow?: boolean;
  glowColor?: string;
}

/**
 * 3D Card with tilt, hover, and scroll animations
 * Uses Framer Motion-style spring physics via Three.js
 */
export function Card3D({
  children,
  pillar = "forest",
  tiltIntensity = 15,
  hoverScale = 1.05,
  className,
  style,
  onClick,
  href,
  aspectRatio = 1.5,
  enableOrbit = false,
  showGlow = true,
  glowColor,
}: Card3DProps) {
  const colors = PILLAR_COLORS[pillar as keyof typeof PILLAR_COLORS];
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  // Track scroll progress for scroll animations
  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = 1 - rect.bottom / viewportHeight;
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Use a simpler 3D renderer
  const CardRenderer = dynamic(
    () => import("./Card3DSimple").then((m) => ({ default: m.Card3DSimple })),
    { ssr: false, loading: () => <CardFallback pillar={pillar} /> },
  );

  const cardStyles = useMemo(
    () => ({
      position: "relative",
      width: "100%",
      aspectRatio: aspectRatio.toString(),
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      cursor: href || onClick ? "pointer" : "default",
      ...style,
    }),
    [aspectRatio, style, href, onClick],
  );

  return (
    <div
      ref={cardRef}
      className={className}
      style={cardStyles as React.CSSProperties}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      role={href || onClick ? "button" : undefined}
      tabIndex={href || onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && (href || onClick)) {
          e.preventDefault();
          onClick?.();
          if (href) window.location.href = href;
        }
      }}
    >
      <Suspense fallback={<CardFallback pillar={pillar} />}>
        <CardRenderer
          pillar={pillar}
          isHovered={isHovered}
          isPressed={isPressed}
          scrollProgress={scrollProgress}
          tiltIntensity={tiltIntensity}
          hoverScale={hoverScale}
          showGlow={showGlow}
          glowColor={glowColor || colors.gold}
          prefersReducedMotion={prefersReducedMotion}
        >
          {children}
        </CardRenderer>
      </Suspense>

      {/* Click handler for anchor tags */}
      {href && (
        <a
          href={href}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            opacity: 0,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

/**
 * Card fallback for SSR and loading states
 */
function CardFallback({ pillar }: { pillar: string }) {
  const colors = PILLAR_COLORS[pillar as keyof typeof PILLAR_COLORS];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(160deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );
}

/**
 * Reduce motion hook
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  return reduced;
}
