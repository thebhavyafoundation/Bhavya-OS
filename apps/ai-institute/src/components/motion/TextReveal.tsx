"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerChildren?: number;
}

export function TextReveal({
  text,
  className,
  delay = 0,
  duration = 0.5,
  staggerChildren = 0.03,
}: TextRevealProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const words = text.split(" ");

  if (reducedMotion) {
    return (
      <div ref={ref} className={className}>
        {text}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ staggerChildren, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span key={i} style={{ display: "inline-block", marginRight: "0.3em" }}>
          {word.split("").map((char, j) => (
            <motion.span
              key={j}
              style={{ display: "inline-block" }}
              variants={{
                hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
}
