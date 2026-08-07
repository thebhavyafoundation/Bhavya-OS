import { KnowledgePackage } from "./types.js";

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  category: "content" | "assessment" | "metadata" | "accessibility" | "quality";
  severity: "error" | "warning" | "info";
  validate: (pkg: KnowledgePackage) => ValidationResult;
}

export interface ValidationResult {
  ruleId: string;
  passed: boolean;
  message: string;
  severity: "error" | "warning" | "info";
  details?: Record<string, unknown>;
}

export interface ValidationReport {
  packageId: string;
  timestamp: Date;
  results: ValidationResult[];
  summary: {
    total: number;
    passed: number;
    warnings: number;
    errors: number;
    score: number;
  };
}

export class QualityValidator {
  private rules: ValidationRule[] = [];

  constructor() {
    this.registerDefaultRules();
  }

  registerRule(rule: ValidationRule): void {
    this.rules.push(rule);
  }

  async validatePackage(pkg: KnowledgePackage): Promise<ValidationReport> {
    const results: ValidationResult[] = [];

    for (const rule of this.rules) {
      const result = rule.validate(pkg);
      results.push(result);
    }

    const summary = {
      total: results.length,
      passed: results.filter((r) => r.passed).length,
      warnings: results.filter((r) => !r.passed && r.severity === "warning")
        .length,
      errors: results.filter((r) => !r.passed && r.severity === "error").length,
      score: 0,
    };

    summary.score = Math.round((summary.passed / summary.total) * 100);

    return {
      packageId: pkg.id,
      timestamp: new Date(),
      results,
      summary,
    };
  }

  private registerDefaultRules(): void {
    this.rules = [
      {
        id: "META-001",
        name: "Title Required",
        description: "Package must have a title",
        category: "metadata",
        severity: "error",
        validate: (pkg) => ({
          ruleId: "META-001",
          passed: !!pkg.metadata.title && pkg.metadata.title.length > 0,
          message: pkg.metadata.title ? "Title exists" : "Title is missing",
          severity: "error",
        }),
      },
      {
        id: "META-002",
        name: "Learning Outcomes Required",
        description: "Package must have at least 3 learning outcomes",
        category: "metadata",
        severity: "error",
        validate: (pkg) => ({
          ruleId: "META-002",
          passed:
            pkg.metadata.learningOutcomes &&
            pkg.metadata.learningOutcomes.length >= 3,
          message: `Has ${pkg.metadata.learningOutcomes?.length || 0} learning outcomes (minimum 3)`,
          severity: "error",
        }),
      },
      {
        id: "META-003",
        name: "Prerequisites Defined",
        description: "Package should have prerequisites defined",
        category: "metadata",
        severity: "warning",
        validate: (pkg) => ({
          ruleId: "META-003",
          passed:
            pkg.metadata.prerequisites && pkg.metadata.prerequisites.length > 0,
          message: pkg.metadata.prerequisites?.length
            ? "Prerequisites defined"
            : "No prerequisites defined",
          severity: "warning",
        }),
      },
      {
        id: "CONTENT-001",
        name: "Content Sections Required",
        description: "Package must have at least 3 content sections",
        category: "content",
        severity: "error",
        validate: (pkg) => ({
          ruleId: "CONTENT-001",
          passed: pkg.content.sections && pkg.content.sections.length >= 3,
          message: `Has ${pkg.content.sections?.length || 0} content sections (minimum 3)`,
          severity: "error",
        }),
      },
      {
        id: "CONTENT-002",
        name: "Visual Explanations Recommended",
        description: "Package should have visual explanations",
        category: "content",
        severity: "warning",
        validate: (pkg) => ({
          ruleId: "CONTENT-002",
          passed:
            pkg.content.visualExplanations &&
            pkg.content.visualExplanations.length > 0,
          message: pkg.content.visualExplanations?.length
            ? "Has visual explanations"
            : "No visual explanations",
          severity: "warning",
        }),
      },
      {
        id: "CONTENT-003",
        name: "Code Examples Recommended",
        description: "Package should have code examples",
        category: "content",
        severity: "warning",
        validate: (pkg) => ({
          ruleId: "CONTENT-003",
          passed:
            pkg.content.codeExamples && pkg.content.codeExamples.length > 0,
          message: pkg.content.codeExamples?.length
            ? "Has code examples"
            : "No code examples",
          severity: "warning",
        }),
      },
      {
        id: "CONTENT-004",
        name: "Glossary Recommended",
        description: "Package should have a glossary",
        category: "content",
        severity: "info",
        validate: (pkg) => ({
          ruleId: "CONTENT-004",
          passed: pkg.content.glossary && pkg.content.glossary.length > 0,
          message: pkg.content.glossary?.length
            ? "Has glossary"
            : "No glossary",
          severity: "info",
        }),
      },
      {
        id: "ASSESS-001",
        name: "Quiz Questions Required",
        description: "Package must have quiz questions",
        category: "assessment",
        severity: "error",
        validate: (pkg) => ({
          ruleId: "ASSESS-001",
          passed:
            pkg.assessment.quiz && pkg.assessment.quiz.questions.length > 0,
          message: `Has ${pkg.assessment.quiz?.questions.length || 0} quiz questions`,
          severity: "error",
        }),
      },
      {
        id: "ASSESS-002",
        name: "Lab Required",
        description: "Package must have a lab exercise",
        category: "assessment",
        severity: "error",
        validate: (pkg) => ({
          ruleId: "ASSESS-002",
          passed: !!pkg.assessment.lab,
          message: pkg.assessment.lab ? "Has lab exercise" : "No lab exercise",
          severity: "error",
        }),
      },
      {
        id: "ASSESS-003",
        name: "Project Required",
        description: "Package must have a project",
        category: "assessment",
        severity: "error",
        validate: (pkg) => ({
          ruleId: "ASSESS-003",
          passed: !!pkg.assessment.project,
          message: pkg.assessment.project ? "Has project" : "No project",
          severity: "error",
        }),
      },
      {
        id: "QUALITY-001",
        name: "Quality Score Minimum",
        description: "Overall quality score must be at least 70",
        category: "quality",
        severity: "error",
        validate: (pkg) => ({
          ruleId: "QUALITY-001",
          passed: pkg.quality.overallScore >= 70,
          message: `Quality score is ${pkg.quality.overallScore} (minimum 70)`,
          severity: "error",
        }),
      },
      {
        id: "QUALITY-002",
        name: "Content Accuracy Minimum",
        description: "Content accuracy must be at least 80",
        category: "quality",
        severity: "warning",
        validate: (pkg) => ({
          ruleId: "QUALITY-002",
          passed: pkg.quality.contentAccuracy >= 80,
          message: `Content accuracy is ${pkg.quality.contentAccuracy} (minimum 80)`,
          severity: "warning",
        }),
      },
    ];
  }
}

export const qualityValidator = new QualityValidator();
