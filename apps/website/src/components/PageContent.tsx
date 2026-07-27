"use client";

import { useGsapFadeIn, useGsapStagger } from "../lib/animations";

interface PageContentProps {
  children: React.ReactNode;
}

export function PageContent({ children }: PageContentProps) {
  const ref = useGsapFadeIn();

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

interface AnimatedGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

export function AnimatedGrid({ children, columns = 2 }: AnimatedGridProps) {
  const count = Array.isArray(children) ? children.length : 1;
  const containerRef = useGsapStagger(count);

  return (
    <div
      ref={containerRef}
      className={columns === 3 ? "grid-3" : columns === 4 ? "grid-4" : "grid-2"}
    >
      {children}
    </div>
  );
}
