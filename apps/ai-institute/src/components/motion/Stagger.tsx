"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

interface StaggerProps {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
}

export function Stagger({
  children,
  stagger = 0.1,
  delay = 0,
  className,
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  variant?: "fade" | "slide-up" | "scale";
}

export function StaggerItem({
  children,
  className,
  variant = "slide-up",
}: StaggerItemProps) {
  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
      },
    },
    "slide-up": {
      hidden: { opacity: 0, y: 40 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
      },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
      },
    },
  };

  return (
    <motion.div className={className} variants={variants[variant]}>
      {children}
    </motion.div>
  );
}
