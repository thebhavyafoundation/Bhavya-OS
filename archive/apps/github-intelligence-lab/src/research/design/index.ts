// Design Intelligence System (DIS)
// Research domain inside GitHub Intelligence Lab
// Continuously learns from elite design systems and evolves @bhavya/platform-ui

export type DesignDomain =
  | "typography"
  | "spacing"
  | "elevation"
  | "motion"
  | "layout"
  | "density"
  | "navigation"
  | "tables"
  | "forms"
  | "dashboards"
  | "command_palette"
  | "keyboard_shortcuts"
  | "empty_states"
  | "skeletons"
  | "loading_ux"
  | "error_ux"
  | "accessibility"
  | "mobile_responsiveness"
  | "dark_mode"
  | "color_system"
  | "iconography"
  | "border_radius"
  | "shadows"
  | "animations";

export type ResearchSource =
  // Design Systems
  | "shadcn_ui"
  | "radix_ui"
  | "base_ui"
  | "chakra_ui"
  | "mantine"
  | "ark_ui"
  | "park_ui"
  | "material_design_3"
  | "carbon_design"
  | "fluent_ui"
  | "ant_design"
  | "tailwind_ui_patterns"
  // SaaS Products
  | "linear"
  | "vercel"
  | "github"
  | "notion"
  | "raycast"
  | "stripe_dashboard"
  | "supabase"
  | "clerk"
  | "resend"
  | "trigger_dev"
  | "inngest"
  | "cal_com"
  | "better_auth_demo"
  // Open Source Apps
  | "docmost"
  | "appflowy"
  | "twenty_crm"
  | "plane"
  | "coolify"
  | "activepieces"
  | "n8n"
  | "budibase"
  | "tooljet"
  | "penpot";

export interface DesignResearchEntry {
  id: string;
  source: ResearchSource;
  domain: DesignDomain;
  pattern: string;
  description: string;
  implementation: string;
  accessibility: AccessibilityImpact;
  performance: PerformanceImpact;
  mobileSupport: boolean;
  darkModeSupport: boolean;
  examples: string[];
  antiPatterns: string[];
  version: string;
  extractedAt: string;
  confidence: number;
}

export interface AccessibilityImpact {
  wcagLevel: "A" | "AA" | "AAA";
  keyboardNavigation: boolean;
  screenReaderSupport: boolean;
  colorContrast: boolean;
  focusManagement: boolean;
  ariaLabels: boolean;
  score: number;
}

export interface PerformanceImpact {
  bundleSize: "tiny" | "small" | "medium" | "large";
  renderCost: "low" | "medium" | "high";
  memoryFootprint: "minimal" | "moderate" | "significant";
  score: number;
}

export interface ComponentResearch {
  name: string;
  purpose: string;
  researchSources: ResearchSource[];
  accessibilityScore: number;
  performanceScore: number;
  mobileSupport: boolean;
  desktopSupport: boolean;
  animations: boolean;
  variants: ComponentVariant[];
  designTokens: DesignToken[];
  bestPractices: string[];
  antiPatterns: string[];
  aiExplanation: string;
  versionHistory: VersionEntry[];
  evolutionHistory: EvolutionEntry[];
}

export interface ComponentVariant {
  name: string;
  purpose: string;
  usage: string;
  props: Record<string, string>;
}

export interface DesignToken {
  category: string;
  name: string;
  value: string;
  purpose: string;
  source: ResearchSource;
  confidence: number;
}

export interface VersionEntry {
  version: string;
  date: string;
  changes: string[];
  reason: string;
}

export interface EvolutionEntry {
  date: string;
  trigger: string;
  source: ResearchSource;
  change: string;
  approvedBy: string;
  impact: string;
}

export interface DesignKnowledgePackage {
  id: string;
  domain: DesignDomain;
  title: string;
  content: string;
  researchSources: ResearchSource[];
  extractableIdeas: string[];
  reusablePatterns: string[];
  designPrinciples: string[];
  implementationNotes: string;
  accessibilityScore: number;
  performanceScore: number;
  confidence: number;
  version: string;
  extractedAt: string;
}

export class DesignIntelligenceSystem {
  private research = new Map<string, DesignResearchEntry>();
  private components = new Map<string, ComponentResearch>();
  private knowledgePackages = new Map<string, DesignKnowledgePackage>();
  private evolutionLog: EvolutionEntry[] = [];

  // === Research Management ===

  addResearch(entry: DesignResearchEntry): void {
    this.research.set(entry.id, entry);
  }

  getResearch(id: string): DesignResearchEntry | undefined {
    return this.research.get(id);
  }

  listResearch(filter?: {
    domain?: DesignDomain;
    source?: ResearchSource;
    minConfidence?: number;
  }): DesignResearchEntry[] {
    let results = Array.from(this.research.values());
    if (filter?.domain)
      results = results.filter((r) => r.domain === filter.domain);
    if (filter?.source)
      results = results.filter((r) => r.source === filter.source);
    if (filter?.minConfidence !== undefined)
      results = results.filter((r) => r.confidence >= filter.minConfidence!);
    return results.sort((a, b) => b.confidence - a.confidence);
  }

  // === Component Research ===

  addComponent(component: ComponentResearch): void {
    this.components.set(component.name, component);
  }

  getComponent(name: string): ComponentResearch | undefined {
    return this.components.get(name);
  }

  listComponents(filter?: {
    minAccessibility?: number;
    minPerformance?: number;
    mobileSupport?: boolean;
  }): ComponentResearch[] {
    let results = Array.from(this.components.values());
    if (filter?.minAccessibility !== undefined)
      results = results.filter(
        (c) => c.accessibilityScore >= filter.minAccessibility!,
      );
    if (filter?.minPerformance !== undefined)
      results = results.filter(
        (c) => c.performanceScore >= filter.minPerformance!,
      );
    if (filter?.mobileSupport !== undefined)
      results = results.filter((c) => c.mobileSupport === filter.mobileSupport);
    return results.sort(
      (a, b) =>
        b.accessibilityScore +
        b.performanceScore -
        (a.accessibilityScore + a.performanceScore),
    );
  }

  // === Knowledge Package Generation ===

  generateKnowledgePackage(
    domain: DesignDomain,
    title: string,
    content: string,
    sources: ResearchSource[],
  ): DesignKnowledgePackage {
    const relevantResearch = this.listResearch({ domain });
    const kp: DesignKnowledgePackage = {
      id: `design-kp-${Date.now()}`,
      domain,
      title,
      content,
      researchSources: sources,
      extractableIdeas: relevantResearch.map((r) => r.pattern),
      reusablePatterns: relevantResearch
        .filter((r) => r.confidence > 0.7)
        .map((r) => r.pattern),
      designPrinciples: this.extractPrinciples(domain),
      implementationNotes: `Implement ${title} based on research from ${sources.join(", ")}`,
      accessibilityScore: this.calculateAccessibilityScore(relevantResearch),
      performanceScore: this.calculatePerformanceScore(relevantResearch),
      confidence: this.calculateConfidence(relevantResearch),
      version: "1.0.0",
      extractedAt: new Date().toISOString(),
    };
    this.knowledgePackages.set(kp.id, kp);
    return kp;
  }

  // === Evolution Tracking ===

  proposeChange(
    trigger: string,
    source: ResearchSource,
    change: string,
    impact: string,
  ): EvolutionEntry {
    const entry: EvolutionEntry = {
      date: new Date().toISOString(),
      trigger,
      source,
      change,
      approvedBy: "pending",
      impact,
    };
    this.evolutionLog.push(entry);
    return entry;
  }

  approveChange(date: string, approvedBy: string): void {
    const entry = this.evolutionLog.find((e) => e.date === date);
    if (entry) {
      entry.approvedBy = approvedBy;
    }
  }

  getEvolutionLog(): EvolutionEntry[] {
    return this.evolutionLog;
  }

  // === Analysis ===

  analyzeDesignSystem(
    name: string,
    url: string,
  ): {
    designTokens: boolean;
    colorSystem: string;
    typographyScale: string[];
    spacingScale: string[];
    componentCount: number;
    darkMode: boolean;
    responsive: boolean;
    accessibility: number;
    score: number;
  } {
    // Placeholder for actual analysis
    return {
      designTokens: true,
      colorSystem: "semantic",
      typographyScale: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl"],
      spacingScale: ["0", "1", "2", "3", "4", "5", "6", "8", "10", "12"],
      componentCount: 0,
      darkMode: true,
      responsive: true,
      accessibility: 0,
      score: 0,
    };
  }

  // === Helpers ===

  private extractPrinciples(domain: DesignDomain): string[] {
    const principles: Record<DesignDomain, string[]> = {
      typography: [
        "Use a modular scale",
        "Limit font families to 2",
        "Establish clear hierarchy",
      ],
      spacing: [
        "Use consistent spacing scale",
        "4px or 8px base unit",
        "White space is a feature",
      ],
      elevation: [
        "Use shadows sparingly",
        "Layer hierarchy through elevation",
        "Consistent shadow tokens",
      ],
      motion: [
        "Purposeful animation",
        "Respect prefers-reduced-motion",
        "60fps or don't animate",
      ],
      layout: [
        "Consistent grid system",
        "Responsive breakpoints",
        "Content-first design",
      ],
      density: [
        "Information density matches user expertise",
        "Progressive disclosure",
        "Compact for power users",
      ],
      navigation: [
        "Predictable navigation",
        "Keyboard-first workflow",
        "Command palette for power users",
      ],
      tables: [
        "Responsive table design",
        "Sort and filter affordances",
        "Virtual scrolling for large datasets",
      ],
      forms: [
        "Inline validation",
        "Clear error messages",
        "Logical field grouping",
      ],
      dashboards: [
        "Most important info first",
        "Customizable layouts",
        "Real-time updates",
      ],
      command_palette: [
        "Keyboard-first access",
        "Fuzzy search",
        "Context-aware actions",
      ],
      keyboard_shortcuts: [
        "Discoverable shortcuts",
        "Consistent modifiers",
        "Customizable bindings",
      ],
      empty_states: [
        "Guide user to action",
        "Illustrate value",
        "Provide clear next steps",
      ],
      skeletons: [
        "Match content shape",
        "Animate subtly",
        "Reduce perceived wait",
      ],
      loading_ux: [
        "Progress indicators",
        "Optimistic updates",
        "Skeleton screens",
      ],
      error_ux: [
        "Clear error messages",
        "Recovery paths",
        "Graceful degradation",
      ],
      accessibility: [
        "WCAG 2.1 AA minimum",
        "Keyboard navigation",
        "Screen reader support",
      ],
      mobile_responsiveness: [
        "Mobile-first design",
        "Touch-friendly targets",
        "Adaptive layouts",
      ],
      dark_mode: [
        "Semantic color tokens",
        "Contrast ratios maintained",
        "System preference detection",
      ],
      color_system: [
        "Semantic color tokens",
        "Accessible color palette",
        "Consistent usage patterns",
      ],
      iconography: [
        "Consistent icon style",
        "Accessible labels",
        "Appropriate sizing",
      ],
      border_radius: [
        "Consistent radius scale",
        "Semantic radius tokens",
        "Purposeful rounding",
      ],
      shadows: [
        "Elevation-based shadows",
        "Consistent shadow tokens",
        "Subtle depth cues",
      ],
      animations: [
        "Purposeful motion",
        "Consistent timing",
        "Performance-conscious",
      ],
    };
    return principles[domain] || [];
  }

  private calculateAccessibilityScore(
    research: DesignResearchEntry[],
  ): number {
    if (research.length === 0) return 0;
    const total = research.reduce(
      (sum, r) => sum + r.accessibility.score,
      0,
    );
    return Math.round(total / research.length);
  }

  private calculatePerformanceScore(
    research: DesignResearchEntry[],
  ): number {
    if (research.length === 0) return 0;
    const total = research.reduce(
      (sum, r) => sum + r.performance.score,
      0,
    );
    return Math.round(total / research.length);
  }

  private calculateConfidence(research: DesignResearchEntry[]): number {
    if (research.length === 0) return 0;
    const total = research.reduce((sum, r) => sum + r.confidence, 0);
    return Math.round((total / research.length) * 100) / 100;
  }
}
