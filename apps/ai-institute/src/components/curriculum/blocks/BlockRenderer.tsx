import type { LessonBlock } from "@/data/curriculum";
import { DiagramRenderer } from "../diagram/DiagramRenderer";
import { WidgetRenderer } from "../widgets/WidgetRenderer";
import { QuizBlock } from "../QuizBlock";

export function BlockRenderer({
  blocks,
  moduleId,
}: {
  blocks: LessonBlock[];
  moduleId: string;
}) {
  return (
    <div className="lesson-blocks">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "visual":
            return <DiagramRenderer key={i} spec={b.diagram} />;
          case "prose":
            return (
              <p key={i} className="lesson-prose">
                {b.text}
              </p>
            );
          case "interactive":
            return <WidgetRenderer key={i} spec={b.widget} />;
          case "quiz":
            return (
              <QuizBlock key={i} questions={b.questions} moduleId={moduleId} />
            );
          case "experiment":
            return (
              <section key={i} className="lesson-card">
                <h3>Experiment — {b.title}</h3>
                <p>
                  <strong>Materials:</strong> {b.materials.join(", ")}
                </p>
                <ol>
                  {b.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                {b.safety && (
                  <p>
                    <strong>Safety:</strong> {b.safety}
                  </p>
                )}
              </section>
            );
          case "project":
            return (
              <section key={i} className="lesson-card">
                <h3>Project</h3>
                <p>{b.brief}</p>
                <ol>
                  {b.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <p>
                  <strong>Deliverable:</strong> {b.deliverable}
                </p>
              </section>
            );
        }
      })}
    </div>
  );
}
