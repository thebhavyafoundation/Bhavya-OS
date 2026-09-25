export type StatusValue =
  "vision" | "planned" | "in-development" | "coming-soon" | "available";

const STATUS_LABELS: Record<StatusValue, string> = {
  vision: "Vision",
  planned: "Planned",
  "in-development": "In Development",
  "coming-soon": "Coming Soon",
  available: "Available",
};

const STATUS_STYLES: Record<StatusValue, string> = {
  vision: "text-text-secondary border-border",
  planned: "text-text-secondary border-border",
  "in-development": "text-accent-gold border-accent-gold/40",
  "coming-soon": "text-accent-gold border-accent-gold/40",
  available: "text-forest border-forest/40",
};

interface StatusLabelProps {
  status: StatusValue;
}

export function StatusLabel({ status }: StatusLabelProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
