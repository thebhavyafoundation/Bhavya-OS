"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";

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
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);

  useEffect(() => {
    if (isInView) {
      animate(count, value, {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      });
    }
  }, [isInView, value, duration, count]);

  const rounded = useTransform(count, (latest) => Math.round(latest));

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
