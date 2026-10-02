import type { AIBand } from "@/types/curriculum";

export type AIBandFilterId = AIBand | "all";

export interface AIBandOption {
  id: AIBandFilterId;
  label: string;
  count: number;
}

interface AIBandFilterProps {
  options: readonly AIBandOption[];
  active: AIBandFilterId;
  onChange: (id: AIBandFilterId) => void;
}

export function AIBandFilter({ options, active, onChange }: AIBandFilterProps) {
  return (
    <div className="ai-band-filter" role="group" aria-label="Filter by band">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="ai-band-btn"
          aria-pressed={active === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label} ({option.count})
        </button>
      ))}
    </div>
  );
}
