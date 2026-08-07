export const motionPresets = {
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  pageExit: {
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 },
  },
  staggerChildren: {
    staggerChildren: 0.08,
    delayChildren: 0.1,
  },
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
  },
  countUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  },
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  },
  smoothSpring: {
    type: "spring",
    stiffness: 100,
    damping: 20,
  },
} as const;
