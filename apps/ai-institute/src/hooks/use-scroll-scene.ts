"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollSceneConfig {
  /** Pin the scene element during scroll */
  pin?: boolean;
  /** Scrub animation to scroll position (boolean or number for smoothing) */
  scrub?: boolean | number;
  /** ScrollTrigger start position (e.g. "top top", "top 80%") */
  start?: string;
  /** ScrollTrigger end position (e.g. "bottom top", "+=500") */
  end?: string;
  /** Markers for debugging */
  markers?: boolean;
}

interface UseScrollSceneReturn {
  /** Ref to attach to the scene container */
  sceneRef: React.RefObject<HTMLDivElement | null>;
  /** Normalized progress (0–1) through the scroll scene */
  progress: number;
}

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useScrollScene(
  config: ScrollSceneConfig = {},
): UseScrollSceneReturn {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  const {
    pin = false,
    scrub = false,
    start = "top top",
    end = "bottom top",
    markers = false,
  } = config;

  useGSAP(
    () => {
      if (!sceneRef.current) return;
      if (getPrefersReducedMotion()) return;

      const trigger = ScrollTrigger.create({
        trigger: sceneRef.current,
        pin,
        scrub,
        start,
        end,
        markers,
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: sceneRef },
  );

  return { sceneRef, progress };
}

export type { ScrollSceneConfig, UseScrollSceneReturn };
