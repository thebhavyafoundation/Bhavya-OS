import {
  KnowledgePackage,
  PackageMetadata,
  PackageContent,
  PackageAssessment,
  PackageResources,
} from "./types.js";
import { contentEngine } from "./engine.js";

export interface ExportFormat {
  type: "json" | "markdown" | "pdf" | "scorm" | "xapi";
  version: string;
  timestamp: Date;
  content: string | KnowledgePackage;
}

export interface ImportResult {
  success: boolean;
  packageId?: string;
  errors: string[];
  warnings: string[];
}

export class ContentExporter {
  async exportPackage(
    packageId: string,
    format: "json" | "markdown",
  ): Promise<ExportFormat> {
    const pkg = await contentEngine.getPackage(packageId);
    if (!pkg) throw new Error(`Package ${packageId} not found`);

    let content: string | KnowledgePackage;

    if (format === "json") {
      content = pkg;
    } else if (format === "markdown") {
      content = this.convertToMarkdown(pkg);
    } else {
      content = pkg;
    }

    return {
      type: format,
      version: "1.0.0",
      timestamp: new Date(),
      content,
    };
  }

  async exportMultiplePackages(
    packageIds: string[],
    format: "json" | "markdown",
  ): Promise<ExportFormat[]> {
    const exports: ExportFormat[] = [];

    for (const id of packageIds) {
      const exp = await this.exportPackage(id, format);
      exports.push(exp);
    }

    return exports;
  }

  async exportBySchool(
    school: string,
    format: "json" | "markdown",
  ): Promise<ExportFormat[]> {
    const packages = await contentEngine.listPackages({ school });
    const exports: ExportFormat[] = [];

    for (const pkg of packages) {
      const exp = await this.exportPackage(pkg.id, format);
      exports.push(exp);
    }

    return exports;
  }

  private convertToMarkdown(pkg: KnowledgePackage): string {
    const lines: string[] = [];

    lines.push(`# ${pkg.metadata.title}`);
    lines.push("");
    lines.push(`**Subtitle:** ${pkg.metadata.subtitle}`);
    lines.push(`**School:** ${pkg.metadata.school}`);
    lines.push(`**Course:** ${pkg.metadata.course}`);
    lines.push(`**Module:** ${pkg.metadata.module}`);
    lines.push(`**Lesson:** ${pkg.metadata.lesson}`);
    lines.push(`**Difficulty:** ${pkg.metadata.difficulty}`);
    lines.push(`**Duration:** ${pkg.metadata.duration}`);
    lines.push("");

    lines.push("## Learning Outcomes");
    lines.push("");
    for (const outcome of pkg.metadata.learningOutcomes) {
      lines.push(`- ${outcome}`);
    }
    lines.push("");

    lines.push("## Content");
    lines.push("");
    for (const section of pkg.content.sections) {
      lines.push(`### ${section.title}`);
      lines.push("");
      lines.push(section.content);
      lines.push("");

      if (section.keyTakeaways.length > 0) {
        lines.push("**Key Takeaways:**");
        for (const takeaway of section.keyTakeaways) {
          lines.push(`- ${takeaway}`);
        }
        lines.push("");
      }
    }

    lines.push("## Glossary");
    lines.push("");
    for (const entry of pkg.content.glossary) {
      lines.push(`**${entry.term}:** ${entry.definition}`);
      lines.push("");
    }

    lines.push("## Assessment");
    lines.push("");
    lines.push("### Quiz");
    lines.push("");
    for (const question of pkg.assessment.quiz.questions) {
      lines.push(`**${question.content}**`);
      if (question.options) {
        for (const option of question.options) {
          lines.push(`- ${option}`);
        }
      }
      lines.push("");
    }

    return lines.join("\n");
  }
}

export class ContentImporter {
  async importFromJson(data: string): Promise<ImportResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const pkg = JSON.parse(data) as KnowledgePackage;

      if (!pkg.metadata) {
        errors.push("Missing metadata");
      }
      if (!pkg.content) {
        errors.push("Missing content");
      }
      if (!pkg.assessment) {
        errors.push("Missing assessment");
      }

      if (errors.length > 0) {
        return { success: false, errors, warnings };
      }

      const created = await contentEngine.createPackage(
        pkg.metadata,
        pkg.content,
        pkg.assessment,
        pkg.resources,
      );

      return {
        success: true,
        packageId: created.id,
        errors,
        warnings,
      };
    } catch (e) {
      return {
        success: false,
        errors: [`Import failed: ${e}`],
        warnings,
      };
    }
  }

  async importFromMarkdown(data: string): Promise<ImportResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const lines = data.split("\n");
      let title = "";
      let subtitle = "";
      let school = "";
      let course = "";
      let module = "";
      let lesson = "";
      let difficulty: "beginner" | "intermediate" | "advanced" | "expert" =
        "beginner";
      let duration = "";
      const learningOutcomes: string[] = [];
      const contentSections: { title: string; content: string }[] = [];
      let currentSection: { title: string; content: string } | null = null;

      for (const line of lines) {
        if (line.startsWith("# ")) {
          title = line.slice(2).trim();
        } else if (line.startsWith("**Subtitle:**")) {
          subtitle = line.replace("**Subtitle:**", "").trim();
        } else if (line.startsWith("**School:**")) {
          school = line.replace("**School:**", "").trim();
        } else if (line.startsWith("**Course:**")) {
          course = line.replace("**Course:**", "").trim();
        } else if (line.startsWith("**Module:**")) {
          module = line.replace("**Module:**", "").trim();
        } else if (line.startsWith("**Lesson:**")) {
          lesson = line.replace("**Lesson:**", "").trim();
        } else if (line.startsWith("**Difficulty:**")) {
          const diffValue = line.replace("**Difficulty:**", "").trim();
          if (
            ["beginner", "intermediate", "advanced", "expert"].includes(
              diffValue,
            )
          ) {
            difficulty = diffValue as
              "beginner" | "intermediate" | "advanced" | "expert";
          }
        } else if (line.startsWith("**Duration:**")) {
          duration = line.replace("**Duration:**", "").trim();
        } else if (line.startsWith("## Learning Outcomes")) {
          // Next lines are outcomes
        } else if (line.startsWith("- ") && learningOutcomes.length < 10) {
          learningOutcomes.push(line.slice(2).trim());
        } else if (line.startsWith("## Content")) {
          // Content sections follow
        } else if (line.startsWith("### ")) {
          if (currentSection) {
            contentSections.push(currentSection);
          }
          currentSection = { title: line.slice(4).trim(), content: "" };
        } else if (currentSection && line.trim()) {
          currentSection.content += line + "\n";
        }
      }

      if (currentSection) {
        contentSections.push(currentSection);
      }

      if (!title) {
        errors.push("No title found");
      }
      if (!school) {
        errors.push("No school found");
      }

      if (errors.length > 0) {
        return { success: false, errors, warnings };
      }

      const metadata: PackageMetadata = {
        title,
        subtitle,
        description: subtitle,
        school,
        program: "",
        course,
        module,
        lesson,
        order: 0,
        duration,
        difficulty,
        tags: [],
        prerequisites: [],
        learningOutcomes,
        competencies: [],
        careerRelevance: [],
        authors: ["Imported"],
        reviewers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        contentHash: "",
      };

      const content: PackageContent = {
        sections: contentSections.map((s, i) => ({
          id: `section-${i}`,
          type: "concept" as const,
          title: s.title,
          content: s.content,
          order: i,
          estimatedReadTime: "5 min",
          keyTakeaways: [],
          concepts: [],
        })),
        visualExplanations: [],
        interactiveDiagrams: [],
        codeExamples: [],
        executableNotebooks: [],
        glossary: [],
        revisionNotes: [],
      };

      const assessment: PackageAssessment = {
        checkpoints: [],
        quiz: {
          id: "quiz-1",
          questions: [],
          timeLimit: 30,
          passingScore: 70,
          attempts: 3,
        },
        assignment: {
          id: "assignment-1",
          title: "Assignment",
          description: "",
          requirements: [],
          rubric: { categories: [], passingScore: 70 },
          estimatedTime: "2 hours",
        },
        lab: {
          id: "lab-1",
          title: "Lab",
          objective: "",
          problemStatement: "",
          requirements: [],
          hints: [],
          solution: { code: "", explanation: "", alternatives: [] },
          tests: [],
          estimatedTime: "1 hour",
        },
        project: {
          id: "project-1",
          title: "Project",
          brief: "",
          milestones: [],
          rubric: { categories: [], passingScore: 70 },
          estimatedTime: "1 week",
        },
      };

      const resources: PackageResources = {
        reading: [],
        researchPapers: [],
        githubReferences: [],
        benchmarks: [],
        datasets: [],
        interviewQuestions: [],
      };

      const created = await contentEngine.createPackage(
        metadata,
        content,
        assessment,
        resources,
      );

      return {
        success: true,
        packageId: created.id,
        errors,
        warnings,
      };
    } catch (e) {
      return {
        success: false,
        errors: [`Import failed: ${e}`],
        warnings,
      };
    }
  }
}

export const contentExporter = new ContentExporter();
export const contentImporter = new ContentImporter();
