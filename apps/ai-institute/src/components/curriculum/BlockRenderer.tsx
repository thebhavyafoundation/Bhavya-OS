import type { LessonBlock } from "@/types/curriculum";
import type { DiagramSpec } from "@/data/curriculum";
import { QuizBlock } from "./QuizBlock";
import { WidgetRenderer } from "./widgets/WidgetRenderer";
import { FigureBlock } from "@/components/editorial/FigureBlock";

/**
 * Derives a readable equivalent of a diagram from its structure, so the meaning
 * survives for a learner who never sees the graphic. Content authors can still
 * override this by supplying a textEquivalent on the figure.
 */
function describeDiagram(spec: DiagramSpec): string {
  switch (spec.kind) {
    case "flow":
    case "pipeline":
      return `A left-to-right sequence: ${spec.steps.join(", then ")}.`;
    case "cycle":
      return `A repeating cycle of ${spec.steps.length} stages: ${spec.steps.join(
        ", then ",
      )}, then back to the first.`;
    case "timeline":
      return `A timeline: ${spec.points.map((p) => p.label).join(", then ")}.`;
    case "compare":
      return `A comparison. ${spec.left.label}: ${spec.left.items.join(
        ", ",
      )}. ${spec.right.label}: ${spec.right.items.join(", ")}.`;
    case "network":
      return `A network of ${spec.nodes.length} connected parts: ${spec.nodes.join(
        ", ",
      )}.`;
    case "labeled-photo":
      return `An annotated image showing ${spec.labels
        .map((l) => l.text)
        .join(", ")}.`;
    default:
      return spec.title;
  }
}

type ProseNode = { type: "p"; text: string } | { type: "ul"; items: string[] };

function parseProse(text: string): ProseNode[] {
  const nodes: ProseNode[] = [];
  for (const line of text.split("\n")) {
    if (line.startsWith("- ")) {
      const last = nodes[nodes.length - 1];
      if (last && last.type === "ul") {
        last.items.push(line.slice(2));
      } else {
        nodes.push({ type: "ul", items: [line.slice(2)] });
      }
    } else if (line.trim().length > 0) {
      nodes.push({ type: "p", text: line });
    }
  }
  return nodes;
}

export function BlockRenderer({ block }: { block: LessonBlock }) {
  switch (block.kind) {
    case "prose":
      return (
        <div className="ai-prose">
          {parseProse(block.text).map((node, index) =>
            node.type === "p" ? (
              <p key={index}>{node.text}</p>
            ) : (
              <ul key={index}>
                {node.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ),
          )}
        </div>
      );
    case "quiz": {
      const moduleId = (block as { moduleId?: string }).moduleId || "unknown";
      return (
        <section className="ai-block" aria-label="Check your understanding">
          <h2 className="ai-block-title">Check your understanding</h2>
          <QuizBlock
            questions={
              block.questions as import("@/data/curriculum/types").QuizQuestion[]
            }
            moduleId={moduleId}
          />
        </section>
      );
    }
    case "interactive":
      return (
        <section className="ai-block" aria-label="Try it">
          <h2 className="ai-block-title">Try it</h2>
          <WidgetRenderer
            spec={block.widget as import("@/data/curriculum/types").WidgetSpec}
          />
        </section>
      );
    case "experiment":
      return (
        <section className="ai-block" aria-label="Hands-on lab">
          <h2 className="ai-block-title">Hands-on lab</h2>
          <div className="ai-experiment">
            <h3 className="ai-experiment-title">{block.title}</h3>
            <div className="ai-chip-row">
              <span className="ai-chip-label">Materials</span>
              {block.materials.map((material) => (
                <span key={material} className="ai-chip">
                  {material}
                </span>
              ))}
            </div>
            <ol className="ai-steps">
              {block.steps.map((step, index) => (
                <li key={index}>
                  {step.includes("\n\n") ? (
                    <pre className="ai-step-code">{step}</pre>
                  ) : (
                    step
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
      );
    case "project":
      return (
        <section className="ai-block" aria-label="Project">
          <h2 className="ai-block-title">Project</h2>
          <div className="ai-project">
            <p className="ai-project-brief">{block.brief}</p>
            <ol className="ai-steps">
              {block.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            <p className="ai-project-deliverable">
              <strong>Deliverables:</strong> {block.deliverable}
            </p>
          </div>
        </section>
      );
    case "visual":
      return (
        <FigureBlock
          spec={block.diagram}
          textEquivalent={describeDiagram(block.diagram)}
        />
      );
    default:
      return (
        <p className="ai-block-unsupported">
          This part of the lesson could not be displayed. The text content is
          still available — please contact the Foundation if this persists.
        </p>
      );
  }
}
