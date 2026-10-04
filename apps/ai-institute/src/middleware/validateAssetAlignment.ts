import type { AILesson } from "@/data/curriculum/ai-lessons";

interface ValidationResult {
  isValid: boolean;
  issues: string[];
}

export function validateAssetAlignment(lesson: AILesson): ValidationResult {
  const issues: string[] = [];

  if (!lesson.learningObjective) {
    issues.push("Lesson missing learning objective");
  }

  if (!lesson.bloomVerb) {
    issues.push("Lesson missing Bloom's taxonomy verb");
  }

  if (!lesson.stages) {
    issues.push("Lesson missing 4-stage pedagogical flow");
  } else {
    const requiredStages = [
      "visualHook",
      "guidedExploration",
      "collaborativeInquiry",
      "boardExamAlignment",
    ];
    for (const stage of requiredStages) {
      if (!(stage in lesson.stages)) {
        issues.push(`Lesson missing stage: ${stage}`);
      }
    }
  }

  if (!lesson.visuals || lesson.visuals.length === 0) {
    issues.push("Lesson missing visual alignment metadata");
  } else {
    lesson.visuals.forEach((visual, index) => {
      if (!visual.visualType) {
        issues.push(`Visual ${index + 1} missing visual type`);
      }
      if (!visual.visualFormat) {
        issues.push(`Visual ${index + 1} missing visual format`);
      }
      if (!visual.cognitiveLoadType) {
        issues.push(`Visual ${index + 1} missing cognitive load type`);
      }
      if (!visual.multimediaPrinciples) {
        issues.push(`Visual ${index + 1} missing multimedia principles`);
      } else {
        const principles = visual.multimediaPrinciples;
        if (!principles.spatialContiguity && !principles.temporalContiguity) {
          issues.push(`Visual ${index + 1} missing contiguity principle`);
        }
        if (!principles.coherence) {
          issues.push(`Visual ${index + 1} missing coherence principle`);
        }
      }
    });
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
