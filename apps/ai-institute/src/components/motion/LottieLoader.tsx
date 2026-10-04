"use client";

import { useEffect, useRef, useState } from "react";

interface LottieLoaderProps {
  src: string;
  width?: number;
  height?: number;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

export function LottieLoader({
  src,
  width = 120,
  height = 120,
  loop = true,
  autoplay = true,
  className,
}: LottieLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let isMounted = true;
    let animation: { destroy: () => void; addEventListener?: (event: string, callback: () => void) => void } | null = null;

    const loadLottie = async () => {
      try {
        const lottieModule = await import(
          // @ts-expect-error lottie-web is an optional dependency
          "lottie-web"
        );
        if (!isMounted || !containerRef.current) return;

        const lottie = lottieModule.default;
        const anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop,
          autoplay,
          path: src,
        });

        animation = anim;
        if (anim.addEventListener) {
          anim.addEventListener("DOMLoaded", () => {
            if (isMounted) setIsLoaded(true);
          });
        } else {
          setIsLoaded(true);
        }
      } catch {
        if (isMounted) setIsLoaded(true);
      }
    };

    loadLottie();

    return () => {
      isMounted = false;
      if (animation) animation.destroy();
    };
  }, [src, loop, autoplay]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width,
        height,
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
      aria-hidden="true"
    />
  );
}

export function PageLoader() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg-primary)",
        zIndex: 10000,
      }}
    >
      <LottieLoader src="/lottie/loading.json" width={80} height={80} />
    </div>
  );
}
