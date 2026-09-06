"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export function Parallax({
  children,
  speed = 0.5,
  direction = "up",
  className,
}: ParallaxProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  if (reducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const distance = speed * 100;

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "left"
      ? [distance, -distance]
      : direction === "right"
        ? [-distance, distance]
        : [0, 0],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "up"
      ? [distance, -distance]
      : direction === "down"
        ? [-distance, distance]
        : [0, 0],
  );

  return (
    <motion.div ref={ref} style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}
