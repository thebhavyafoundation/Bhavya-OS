"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxHeroProps {
  children: ReactNode;
  backgroundImage?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  height?: string;
  speed?: number;
}

export function ParallaxHero({
  children,
  backgroundImage,
  overlayColor = "var(--color-bg-primary)",
  overlayOpacity = 0.7,
  height = "80vh",
  speed = 0.3,
}: ParallaxHeroProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    setIsReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (isReducedMotion || !bgRef.current) return;

    const tween = gsap.to(bgRef.current, {
      yPercent: speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: bgRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed, isReducedMotion]);

  return (
    <section
      style={{
        position: "relative",
        height,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {backgroundImage && (
        <div
          ref={bgRef}
          style={{
            position: "absolute",
            inset: `-${speed * 100}% 0 0 0`,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "transform",
          }}
          aria-hidden="true"
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: overlayColor,
          opacity: overlayOpacity,
        }}
        aria-hidden="true"
      />
      <div
        ref={contentRef}
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "800px",
          padding: "var(--space-8)",
          textAlign: "center",
        }}
      >
        {children}
      </div>
    </section>
  );
}
