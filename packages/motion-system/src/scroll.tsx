import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
  type Variants,
} from "framer-motion";

export const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export function parallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, mass: 0.5 });
  return { ref, y: smoothY };
}

export function scrollProgress(ref: React.RefObject<HTMLElement>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.5,
  });
  const [progress, setProgress] = useState(0);
  useMotionValueEvent(smoothProgress, "change", (v) => setProgress(v));
  return progress;
}

export function useScrollSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState(sectionIds[0] || "");
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visibilityMap = new Map<string, number>();

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visibilityMap.set(id, entry.intersectionRatio);
            } else {
              visibilityMap.delete(id);
            }
          });

          let maxRatio = 0;
          let maxId = "";
          visibilityMap.forEach((ratio, sectionId) => {
            if (ratio > maxRatio) {
              maxRatio = ratio;
              maxId = sectionId;
            }
          });
          if (maxId) setActiveId(maxId);
        },
        { threshold: [0, 0.25, 0.5, 0.75, 1] },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds]);

  return activeId;
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export type ScrollRevealProps = {
  variants?: Variants;
  className?: string;
  children: React.ReactNode;
  delay?: number;
};

export function ScrollReveal({
  variants = scrollReveal,
  className,
  children,
  delay = 0,
}: ScrollRevealProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
