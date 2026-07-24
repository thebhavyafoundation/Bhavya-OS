"use client";

import { useEffect, useRef } from "react";

export function MissionField() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const onPointerMove = (event: PointerEvent) => {
      const bounds = field.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      field.style.setProperty("--field-x", `${x * 18}px`);
      field.style.setProperty("--field-y", `${y * 12}px`);
      field.style.setProperty("--spot-x", `${(x + 0.5) * 100}%`);
      field.style.setProperty("--spot-y", `${(y + 0.5) * 100}%`);
    };
    const onPointerLeave = () => {
      field.style.setProperty("--field-x", "0px");
      field.style.setProperty("--field-y", "0px");
      field.style.setProperty("--spot-x", "52%");
      field.style.setProperty("--spot-y", "48%");
    };

    field.addEventListener("pointermove", onPointerMove);
    field.addEventListener("pointerleave", onPointerLeave);
    return () => {
      field.removeEventListener("pointermove", onPointerMove);
      field.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div ref={fieldRef} className="mission-field" aria-label="Live mission activity visualization">
      <div className="mission-grid" aria-hidden="true" />
      <div className="mission-orbit orbit-one" aria-hidden="true" />
      <div className="mission-orbit orbit-two" aria-hidden="true" />
      <div className="mission-orbit orbit-three" aria-hidden="true" />
      <div className="mission-core" aria-hidden="true">
        <span />
      </div>
      <div className="mission-signal signal-nature"><span />NATURE / 01</div>
      <div className="mission-signal signal-knowledge"><span />KNOWLEDGE / 02</div>
      <div className="mission-signal signal-community"><span />COMMUNITY / 04</div>
      <div className="mission-caption">
        <span className="status-dot" /> FIELD NETWORK <strong>ONLINE</strong>
      </div>
    </div>
  );
}
