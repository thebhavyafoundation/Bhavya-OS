"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion, useInView as framerUseInView } from "framer-motion";
import { motionPresets } from "./presets";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.6,
  y = 30,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = framerUseInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0.1,
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          ...motionPresets.staggerChildren,
          staggerChildren: stagger,
          delayChildren: delay,
        },
      }}
    >
      {children}
    </motion.div>
  );
}

interface SlideInProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
}

export function SlideIn({
  children,
  className,
  direction = "left",
  delay = 0,
}: SlideInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = framerUseInView(ref, { once: true, margin: "-50px" });

  const directionMap = {
    left: { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 } },
    up: { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } },
    down: { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 } },
  };

  const { initial, animate } = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={isInView ? animate : initial}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface ScaleInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  scale?: number;
}

export function ScaleIn({
  children,
  className,
  delay = 0,
  scale = 0.95,
}: ScaleInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = framerUseInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface CountUpProps {
  target: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function CountUp({
  target,
  duration = 2000,
  className,
  prefix = "",
  suffix = "",
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = framerUseInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isInView) return;

    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Number((target * eased).toFixed(decimals)));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isInView, target, duration, decimals]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </motion.span>
  );
}

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  tapScale?: number;
}

export function AnimatedCard({
  children,
  className,
  hoverScale = 1.02,
  tapScale = 0.98,
}: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: hoverScale, y: -2 }}
      whileTap={{ scale: tapScale }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  gradient?: string;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  barClassName,
  gradient = "linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)",
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div
      className={`relative h-2 w-full overflow-hidden rounded-full bg-white/10 ${className ?? ""}`}
    >
      <motion.div
        className={`absolute inset-y-0 left-0 rounded-full ${barClassName ?? ""}`}
        style={{ background: gradient }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

interface TypingIndicatorProps {
  className?: string;
  dotClassName?: string;
}

export function TypingIndicator({
  className,
  dotClassName,
}: TypingIndicatorProps) {
  return (
    <div className={`flex items-center gap-1 ${className ?? ""}`}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={`h-2 w-2 rounded-full bg-current ${dotClassName ?? ""}`}
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

interface PulseGlowProps {
  children: ReactNode;
  className?: string;
  color?: string;
  duration?: number;
}

export function PulseGlow({
  children,
  className,
  color = "rgba(99, 102, 241, 0.4)",
  duration = 2,
}: PulseGlowProps) {
  return (
    <motion.div
      className={`relative ${className ?? ""}`}
      animate={{
        boxShadow: [
          `0 0 0 0 ${color}`,
          `0 0 20px 4px ${color}`,
          `0 0 0 0 ${color}`,
        ],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
