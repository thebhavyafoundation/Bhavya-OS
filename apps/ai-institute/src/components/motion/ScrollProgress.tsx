"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

interface ScrollProgressProps {
  className?: string;
  color?: string;
  height?: number;
}

export function ScrollProgress({
  className,
  color = "var(--primary)",
  height = 3,
}: ScrollProgressProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <motion.div
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height,
        background: color,
        transformOrigin: "0%",
        scaleX,
        zIndex: 9999,
      }}
    />
  );
}
