import { ScrollReveal } from "@/components/motion/ScrollReveal";

export interface ProofPoint {
  value: string;
  label: string;
  source?: string;
  state?: "verified" | "reported" | "pending";
}

interface ProofStripProps {
  points: ProofPoint[];
  className?: string;
}

/**
 * ProofStrip — 2–4 verified impact metrics. Never invent values.
 */
export function ProofStrip({ points, className = "" }: ProofStripProps) {
  return (
    <dl className={`proof-strip ${className}`.trim()}>
      {points.map((row, i) => (
        <ScrollReveal
          key={row.label}
          direction="up"
          distance={16}
          delay={i * 0.08}
          className="proof-item"
        >
          <>
            <dt className="proof-label">{row.label}</dt>
            <dd className="proof-value">{row.value}</dd>
            {row.state ? (
              <span className={`proof-state proof-state--${row.state}`}>
                {row.state}
              </span>
            ) : null}
            {row.source ? (
              <span className="proof-source">{row.source}</span>
            ) : null}
          </>
        </ScrollReveal>
      ))}
    </dl>
  );
}
