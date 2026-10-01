import { ChevronDown } from "lucide-react";
import type { AIModule, AIStandard } from "@/types/curriculum";

interface AIModuleRowProps {
  module: AIModule;
  completed: boolean;
  expanded: boolean;
  standards: readonly AIStandard[];
  prerequisites: readonly AIModule[];
  onToggleComplete: () => void;
  onToggleExpand: () => void;
}

export function AIModuleRow({
  module,
  completed,
  expanded,
  standards,
  prerequisites,
  onToggleComplete,
  onToggleExpand,
}: AIModuleRowProps) {
  const panelId = `ai-module-panel-${module.id}`;

  return (
    <li className="ai-module">
      <div className="ai-module-row">
        <input
          type="checkbox"
          className="ai-module-check"
          checked={completed}
          onChange={onToggleComplete}
          aria-label={`Mark ${module.title} complete`}
        />
        <button
          type="button"
          className="ai-module-title"
          data-complete={completed}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={onToggleExpand}
        >
          <span className="ai-module-name">{module.title}</span>
          <span className="ai-module-level">{module.level}</span>
          <span className="ai-module-hours">{module.estimatedHours} h</span>
          <ChevronDown
            size={14}
            className="ai-module-chevron"
            data-open={expanded}
            aria-hidden="true"
          />
        </button>
      </div>
      <div id={panelId} className="ai-module-panel" hidden={!expanded}>
        <p className="ai-module-desc">{module.description}</p>
        <div className="ai-chip-row">
          {module.topics.map((topic) => (
            <span key={topic} className="ai-chip">
              {topic}
            </span>
          ))}
        </div>
        <div className="ai-chip-row">
          {standards.map((standard) => (
            <span
              key={standard.id}
              className="ai-chip"
              title={`${standard.source} · ${standard.gradeBand}`}
            >
              {standard.concept}
            </span>
          ))}
        </div>
        <p className="ai-module-prereq">
          {prerequisites.length > 0
            ? `Builds on: ${prerequisites.map((pre) => pre.title).join(", ")}`
            : "No prerequisites"}
        </p>
      </div>
    </li>
  );
}
