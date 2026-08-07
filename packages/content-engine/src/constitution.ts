export interface ConstitutionalDocument {
  id: string;
  name: string;
  version: string;
  articles: ConstitutionalArticle[];
}

export interface ConstitutionalArticle {
  id: string;
  title: string;
  content: string;
  category:
    | "brand"
    | "engineering"
    | "ethics"
    | "curriculum"
    | "research"
    | "ux"
    | "motion"
    | "design";
  enforceable: boolean;
}

export interface ComplianceCheck {
  id: string;
  documentId: string;
  articleId: string;
  passed: boolean;
  message: string;
  severity: "error" | "warning" | "info";
  details?: string;
}

export interface ComplianceReport {
  timestamp: Date;
  checks: ComplianceCheck[];
  summary: {
    total: number;
    passed: number;
    warnings: number;
    errors: number;
    score: number;
  };
  documents: string[];
}

export class ConstitutionEnforcementRuntime {
  private documents: Map<string, ConstitutionalDocument> = new Map();
  private checks: ComplianceCheck[] = [];

  constructor() {
    this.loadConstitutionalDocuments();
  }

  private loadConstitutionalDocuments(): void {
    // Brand Constitution
    this.documents.set("brand", {
      id: "brand",
      name: "Brand Constitution",
      version: "1.0.0",
      articles: [
        {
          id: "B001",
          title: "Visual Identity",
          content:
            "The logo must remain unchanged. Color palette: forest #1a3a2a, gold #c9a227, earth #8a7359, cream #f5f1e6",
          category: "brand",
          enforceable: true,
        },
        {
          id: "B002",
          title: "Typography",
          content:
            "Primary font: Inter. Monospace: JetBrains Mono. No other fonts without approval.",
          category: "brand",
          enforceable: true,
        },
        {
          id: "B003",
          title: "Visual Tone",
          content:
            "Minimal, premium, calm, scientific, elegant, timeless. Avoid bright gradients, excessive glassmorphism, unnecessary animations.",
          category: "brand",
          enforceable: true,
        },
      ],
    });

    // Engineering Constitution
    this.documents.set("engineering", {
      id: "engineering",
      name: "Engineering Constitution",
      version: "1.0.0",
      articles: [
        {
          id: "E001",
          title: "Code Quality",
          content:
            "All code must pass ESLint and TypeScript type checking before commit.",
          category: "engineering",
          enforceable: true,
        },
        {
          id: "E002",
          title: "Package Reuse",
          content:
            "Reuse existing Bhavya OS packages before creating new ones.",
          category: "engineering",
          enforceable: true,
        },
        {
          id: "E003",
          title: "Test Coverage",
          content: "Critical paths must have test coverage.",
          category: "engineering",
          enforceable: true,
        },
      ],
    });

    // Curriculum Constitution
    this.documents.set("curriculum", {
      id: "curriculum",
      name: "Curriculum Constitution",
      version: "1.0.0",
      articles: [
        {
          id: "C001",
          title: "Learning Outcomes",
          content: "Every lesson must have measurable learning outcomes.",
          category: "curriculum",
          enforceable: true,
        },
        {
          id: "C002",
          title: "Assessment",
          content:
            "Every lesson must include assessment (quiz, lab, or project).",
          category: "curriculum",
          enforceable: true,
        },
        {
          id: "C003",
          title: "Research Integration",
          content:
            "Content must cite research papers and authoritative sources.",
          category: "curriculum",
          enforceable: true,
        },
      ],
    });

    // UX Architecture
    this.documents.set("ux", {
      id: "ux",
      name: "UX Architecture",
      version: "1.0.0",
      articles: [
        {
          id: "U001",
          title: "Navigation",
          content:
            "Breadcrumbs must show location in hierarchy. Command palette available.",
          category: "ux",
          enforceable: true,
        },
        {
          id: "U002",
          title: "Accessibility",
          content:
            "WCAG 2.1 AA compliance. Keyboard navigation for all interactive elements.",
          category: "ux",
          enforceable: true,
        },
        {
          id: "U003",
          title: "Mobile Responsive",
          content: "All interfaces must work on mobile devices.",
          category: "ux",
          enforceable: true,
        },
      ],
    });

    // Design System
    this.documents.set("design", {
      id: "design",
      name: "Design System",
      version: "1.0.0",
      articles: [
        {
          id: "D001",
          title: "Token Usage",
          content:
            "Use design tokens from @bhavya/design-system. No hardcoded values.",
          category: "design",
          enforceable: true,
        },
        {
          id: "D002",
          title: "Component Reuse",
          content:
            "Use existing UI components from @bhavya/platform-ui before creating new ones.",
          category: "design",
          enforceable: true,
        },
        {
          id: "D003",
          title: "Dark Mode",
          content: "Primary interface is dark mode. Light mode optional.",
          category: "design",
          enforceable: true,
        },
      ],
    });

    // Motion Guidelines
    this.documents.set("motion", {
      id: "motion",
      name: "Motion Guidelines",
      version: "1.0.0",
      articles: [
        {
          id: "M001",
          title: "Purpose",
          content: "Motion must communicate understanding, not decoration.",
          category: "motion",
          enforceable: true,
        },
        {
          id: "M002",
          title: "Performance",
          content:
            "Animations must maintain 60fps. Use transforms and opacity.",
          category: "motion",
          enforceable: true,
        },
        {
          id: "M003",
          title: "Reduced Motion",
          content: "Respect prefers-reduced-motion media query.",
          category: "motion",
          enforceable: true,
        },
      ],
    });
  }

  async validateImplementation(implementation: {
    files: string[];
    components: string[];
    pages: string[];
    dependencies: string[];
  }): Promise<ComplianceReport> {
    const checks: ComplianceCheck[] = [];

    // Check brand compliance
    for (const file of implementation.files) {
      if (file.includes("color") || file.includes("theme")) {
        checks.push({
          id: `brand-color-${Date.now()}`,
          documentId: "brand",
          articleId: "B001",
          passed: true,
          message: "Color usage detected in file",
          severity: "info",
        });
      }
    }

    // Check engineering compliance
    for (const dep of implementation.dependencies) {
      if (dep.startsWith("@bhavya/")) {
        checks.push({
          id: `eng-reuse-${Date.now()}`,
          documentId: "engineering",
          articleId: "E002",
          passed: true,
          message: `Reusing package: ${dep}`,
          severity: "info",
        });
      }
    }

    // Check UX compliance
    for (const page of implementation.pages) {
      if (page.includes("lesson") || page.includes("course")) {
        checks.push({
          id: `ux-nav-${Date.now()}`,
          documentId: "ux",
          articleId: "U001",
          passed: true,
          message: "Educational page detected - navigation required",
          severity: "warning",
        });
      }
    }

    const summary = {
      total: checks.length,
      passed: checks.filter((c) => c.passed).length,
      warnings: checks.filter((c) => !c.passed && c.severity === "warning")
        .length,
      errors: checks.filter((c) => !c.passed && c.severity === "error").length,
      score: 0,
    };

    summary.score =
      summary.total > 0
        ? Math.round((summary.passed / summary.total) * 100)
        : 100;

    return {
      timestamp: new Date(),
      checks,
      summary,
      documents: Array.from(this.documents.keys()),
    };
  }

  async getConstitutionalDocument(
    id: string,
  ): Promise<ConstitutionalDocument | undefined> {
    return this.documents.get(id);
  }

  async listDocuments(): Promise<ConstitutionalDocument[]> {
    return Array.from(this.documents.values());
  }

  async addDocument(document: ConstitutionalDocument): Promise<void> {
    this.documents.set(document.id, document);
  }
}

export const constitutionEnforcement = new ConstitutionEnforcementRuntime();
