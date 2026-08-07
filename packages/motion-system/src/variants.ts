import { type Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -16,
    filter: "blur(4px)",
    transition: { duration: 0.3 },
  },
};

export const cardVariants: Variants = {
  rest: {
    scale: 1,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  hover: {
    scale: 1.02,
    y: -6,
    rotateX: 2,
    rotateY: -1,
    boxShadow: "0 12px 40px rgba(201,162,39,0.12)",
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: { duration: 0.15 },
  },
};

export const textVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.02, staggerDirection: -1 },
  },
};

export const textWordVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(4px)",
    transition: { duration: 0.2 },
  },
};

export const navVariants: Variants = {
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  hidden: {
    y: -80,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 10,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
};

export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.96,
    transition: { duration: 0.25 },
  },
};
