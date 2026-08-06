"use client";

import { type ReactNode } from "react";
import { SmoothScroll } from "../components/motion/SmoothScroll";
import { ScrollProgress } from "../components/motion/ScrollProgress";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SmoothScroll>
      <ScrollProgress />
      {children}
    </SmoothScroll>
  );
}
