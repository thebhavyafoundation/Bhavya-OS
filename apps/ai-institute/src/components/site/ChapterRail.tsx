"use client";

import { useEffect, useState } from "react";

const beats = [
  { id: "story", label: "Why" },
  { id: "chapter-forest", label: "Forest" },
  { id: "chapter-knowledge", label: "Knowledge" },
  { id: "chapter-heritage", label: "Heritage" },
  { id: "chapter-community", label: "Community" },
  { id: "structure", label: "Structure" },
  { id: "evidence", label: "Evidence" },
  { id: "invite", label: "Join" },
];

/**
 * ChapterRail — fixed edge indicator tracking story position.
 * IntersectionObserver only (no scroll handlers); transform-based active
 * state; hidden on small screens; static under reduced motion.
 */
export function ChapterRail() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const b of beats) {
      const el = document.getElementById(b.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label="Story chapters" className="chapter-rail">
      <ol>
        {beats.map((b, i) => (
          <li key={b.id}>
            <a
              href={`#${b.id}`}
              className={active === b.id ? "is-active" : undefined}
              aria-current={active === b.id ? "true" : undefined}
            >
              <span className="chapter-rail-label">
                {String(i + 1).padStart(2, "0")} {b.label}
              </span>
              <span className="chapter-rail-dot" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
