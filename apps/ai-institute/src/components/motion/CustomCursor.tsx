"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });
      setIsVisible(true);
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    const onHoverStart = () => setIsHovering(true);
    const onHoverEnd = () => setIsHovering(false);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);

    const interactiveElements = document.querySelectorAll(
      "a, button, [role='button'], input, textarea, select"
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", onHoverStart);
      el.addEventListener("mouseleave", onHoverEnd);
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onHoverStart);
        el.removeEventListener("mouseleave", onHoverEnd);
      });
    };
  }, []);

  if (typeof window === "undefined") return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: isHovering ? "48px" : "12px",
        height: isHovering ? "48px" : "12px",
        borderRadius: "50%",
        background: isHovering
          ? "var(--color-accent-gold)"
          : "var(--color-forest-500)",
        opacity: isVisible ? 0.6 : 0,
        pointerEvents: "none",
        zIndex: 9998,
        transform: "translate(-50%, -50%)",
        transition: "width 0.3s, height 0.3s, background 0.3s, opacity 0.3s",
        mixBlendMode: "difference",
      }}
      aria-hidden="true"
    />
  );
}
