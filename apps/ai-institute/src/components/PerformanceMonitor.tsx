"use client";

import { useEffect } from "react";

interface WebVitals {
  fcp?: number;
  lcp?: number;
  cls?: number;
  inp?: number;
}

export default function PerformanceMonitor() {
  useEffect(() => {
    const metrics: WebVitals = {};

    const report = (name: string, value: number) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`[Performance] ${name}: ${value}ms`);
      }
    };

    const fcpObserver = new PerformanceObserver((list) => {
      const entry = list.getEntriesByName(
        "first-contentful-paint",
      )[0] as PerformanceEntry;
      if (entry) {
        metrics.fcp = entry.startTime;
        report("FCP", entry.startTime);
      }
    });
    fcpObserver.observe({ type: "paint", buffered: true });

    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      if (lastEntry) {
        metrics.lcp = lastEntry.startTime;
        report("LCP", lastEntry.startTime);
      }
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

    const clsObserver = new PerformanceObserver((list) => {
      let cls = 0;
      for (const entry of list.getEntries()) {
        const e = entry as PerformanceEntry & {
          hadRecentInput?: boolean;
          value?: number;
        };
        if (!e.hadRecentInput) {
          cls += e.value ?? 0;
        }
      }
      metrics.cls = cls;
      report("CLS", cls);
    });
    clsObserver.observe({ type: "layout-shift", buffered: true });

    const inpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEventTiming;
      if (lastEntry) {
        metrics.inp = lastEntry.processingEnd - lastEntry.startTime;
        report("INP", metrics.inp);
      }
    });
    inpObserver.observe({ type: "event", buffered: true });

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      clsObserver.disconnect();
      inpObserver.disconnect();
    };
  }, []);

  return null;
}
