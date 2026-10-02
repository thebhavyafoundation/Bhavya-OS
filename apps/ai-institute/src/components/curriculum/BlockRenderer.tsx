import type { LessonBlock } from "@/types/curriculum";
import { QuizBlock } from "./QuizBlock";
import { WidgetRenderer } from "./widgets/WidgetRenderer";

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
    case "quiz":
      return (
        <section className="ai-block" aria-label="Check your understanding">
          <h2 className="ai-block-title">Check your understanding</h2>
          <QuizBlock questions={block.questions} />
        </section>
      );
    case "interactive":
      return (
        <section className="ai-block" aria-label="Try it">
          <h2 className="ai-block-title">Try it</h2>
          <WidgetRenderer widget={block.widget} />
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
  }
}
