export interface ConstitutionArticle {
  readonly number: string;
  readonly title: string;
  readonly summary: string;
}

export interface ConstitutionDocument {
  readonly documentNumber: string;
  readonly title: string;
  readonly status: string;
  readonly effectiveDate: string;
  readonly authority: string;
  readonly supersedes: string;
  readonly preamble: string;
  readonly articles: readonly ConstitutionArticle[];
  readonly engineeringPrinciples: readonly string[];
  readonly transformationJourney: readonly string[];
  readonly successMetrics: readonly {
    readonly metric: string;
    readonly target: string;
  }[];
  readonly constitutionalHierarchy: readonly string[];
}

export const constitution: ConstitutionDocument = {
  documentNumber: "00",
  title: "The Vision",
  status: "SUPREME",
  effectiveDate: "2026-01-01",
  authority: "Foundational",
  supersedes: "All conflicting documents",
  preamble:
    "Bhavya Foundation exists to restore nature, advance knowledge, and preserve heritage for generations to come. This document is the supreme source of truth for all institutional decisions, platform architecture, curriculum design, and governance. Every other document, every codebase, every decision traces back to this Constitution. Nothing supersedes this document.",
  articles: [
    {
      number: "1",
      title: "Nature of the Institution",
      summary:
        "Bhavya Foundation is a nature-based institutional platform operating across four missions: Forest, Knowledge, Heritage, and Community. It is designed to outlive its founders, its technology stack, and any single generation of participants.",
    },
    {
      number: "2",
      title: "The Three Pillars",
      summary:
        "Nature (Forest Mission), Knowledge (AI labs, digital libraries, research), Heritage (traditional knowledge preservation), and Community (youth empowerment, village development).",
    },
    {
      number: "3",
      title: "The Transformation Journey",
      summary:
        "Every person moves through: Visitor → Builder → Contributor → Mentor → Institution Builder. Every product must reinforce this transformation.",
    },
    {
      number: "4",
      title: "The 10-Year Vision",
      summary:
        "Foundation (Year 1-2): 100 Knowledge Packages, first AI Institute cohort. Institutionalization (Year 3-5): 16 domains operational. Permanence (Year 6-10): Institution operates independently of any single technology or leader.",
    },
    {
      number: "5",
      title: "The Constitutional Hierarchy",
      summary:
        "00-VISION.md is supreme. 15 constitutional documents form the hierarchy. Citation required for all governance actions.",
    },
    {
      number: "6",
      title: "Engineering Principles",
      summary:
        "Research before implementation, reuse before creation, simplify before expanding, teach before automating, measure before optimizing, human approval before platform evolution, cite the Constitution.",
    },
    {
      number: "7",
      title: "The Institutional Cycle",
      summary:
        "Research → Knowledge Package → Proposal → Review → Approval → Publication → Feedback → Continuous Improvement. No stage may be skipped.",
    },
    {
      number: "8",
      title: "What We Build vs. What We Reuse",
      summary:
        "Build only what is unique to Bhavya Foundation's mission. Reuse open-source tools and existing platforms before building custom.",
    },
    {
      number: "9",
      title: "Domain Isolation",
      summary:
        "Mission applications operate independently. All missions share Content OS, Design System, Governance Model, Engineering Constitution, and Quality Gates.",
    },
    {
      number: "10",
      title: "Enforcement",
      summary:
        "Every pull request must demonstrate constitutional compliance. AI systems must cite authority, log actions, and never override human judgment.",
    },
    {
      number: "11",
      title: "Definitions",
      summary:
        "Key terms: Knowledge Package, Content OS, Institution Builder, Constitutional Document, Mission, Platform, BEE 2.0.",
    },
    {
      number: "12",
      title: "Effective Date and Authority",
      summary:
        "Takes effect 2026-01-01. May only be amended through the process defined in Article 5.3.",
    },
  ],
  engineeringPrinciples: [
    "Research before implementation — every change traces back to evidence.",
    "Reuse before creation — check existing packages and components first.",
    "Simplify before expanding — remove complexity before adding features.",
    "Teach before automating — educational value is a core requirement.",
    "Measure before optimizing — data guides decisions, not intuition.",
    "Human approval before platform evolution — no platform change without review.",
    "Cite the Constitution — every AI action referencing institutional authority must cite sources.",
  ],
  transformationJourney: [
    "Visitor — discovers Bhavya Foundation, browses, reads, explores.",
    "Builder — creates projects, completes labs, contributes code.",
    "Contributor — gives back through pull requests, reviews, mentoring.",
    "Mentor — guides study groups, advises projects, shapes curriculum.",
    "Institution Builder — extends the institution itself through governance and partnerships.",
  ],
  successMetrics: [
    { metric: "Students transformed", target: "50,000+ reaching Builder or above" },
    { metric: "Open source contributions", target: "10,000+ meaningful contributions" },
    { metric: "Forest restored", target: "100+ hectares" },
    { metric: "Knowledge Packages", target: "500+ packages" },
    { metric: "Institutional domains", target: "16 domains" },
    { metric: "Communities served", target: "100+ villages" },
    { metric: "Heritage documented", target: "100+ systems" },
    { metric: "Platform adoption", target: "25+ institutions" },
  ],
  constitutionalHierarchy: [
    "00-VISION.md (Supreme)",
    "01-BRAND-CONSTITUTION.md",
    "02-BHAVYA-OS-CONSTITUTION.md",
    "03-EDUCATION-CONSTITUTION.md",
    "04-GOVERNANCE-CONSTITUTION.md",
    "05-FOREST-CONSTITUTION.md",
    "06-HERITAGE-CONSTITUTION.md",
    "07-COMMUNITY-CONSTITUTION.md",
    "08-OPEN-SOURCE-CONSTITUTION.md",
    "09-RESEARCH-CONSTITUTION.md",
    "10-INSTITUTION-CONSTITUTION.md",
    "11-SECURITY-CONSTITUTION.md",
    "12-QUALITY-CONSTITUTION.md",
    "13-DESIGN-CONSTITUTION.md",
    "14-DATA-CONSTITUTION.md",
    "15-AI-ETHICS-CONSTITUTION.md",
  ],
} as const;
