import { useState, useEffect, useRef, useCallback } from "react";

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setProgress(window.scrollY / scrollHeight);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}

export function useInView(
  ref: React.RefObject<HTMLElement | null>,
  options?: IntersectionObserverInit,
) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1, ...options },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, options]);

  return isInView;
}

export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);

    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}

export function useCountUp(target: number, duration: number = 2000) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  const animate = useCallback(
    (timestamp: number) => {
      if (startRef.current === null) {
        startRef.current = timestamp;
        startValueRef.current = value;
      }

      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setValue(
        Math.round(
          startValueRef.current + (target - startValueRef.current) * eased,
        ),
      );

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    },
    [target, duration, value],
  );

  useEffect(() => {
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [animate]);

  return value;
}
