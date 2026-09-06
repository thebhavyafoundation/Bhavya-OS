"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface NumberRevealProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function NumberReveal({
  value,
  suffix = "",
  duration = 2,
  className = "",
}: NumberRevealProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);

  useEffect(() => {
    if (isInView && !reducedMotion) {
      animate(count, value, {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      });
    }
  }, [isInView, value, duration, count, reducedMotion]);

  const rounded = useTransform(count, (latest) => Math.round(latest));

  if (reducedMotion) {
    return (
      <span ref={ref} className={className}>
        {value}
        {suffix}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
