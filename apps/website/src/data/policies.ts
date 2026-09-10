export type PolicyStatus = "published" | "draft";

export interface PolicySection {
  readonly heading: string;
  readonly body: string;
}

export interface Policy {
  id: string;
  title: string;
  status: PolicyStatus;
  icon: string;
  description: string;
  sections: readonly PolicySection[];
}

export const policies: readonly Policy[] = [
  {
    id: "POL-001",
    title: "Data Governance & Privacy Policy",
    status: "published",
    icon: "🔒",
    description:
      "Data collection, processing, storage, and retention policies aligned with Indian IT Act and global privacy standards. All personal data is minimized and purpose-limited.",
    sections: [
      {
        heading: "Data Collection",
        body: "Only data necessary for stated institutional purposes is collected. Explicit consent is obtained for all personal data.",
      },
      {
        heading: "Retention",
        body: "Personal data is retained only as long as necessary for the purpose for which it was collected, or as required by law.",
      },
    ],
  },
  {
    id: "POL-002",
    title: "AI Agent Oversight Policy",
    status: "published",
    icon: "🤖",
    description:
      "All autonomous AI agents operate under human supervision with explicit capability contracts, audit logging, and fail-safe termination procedures.",
    sections: [
      {
        heading: "Capability Contracts",
        body: "Every agent must have a registered capability contract defining scope, permissions, inputs, outputs, and termination conditions.",
      },
      {
        heading: "Audit",
        body: "All agent actions are logged to the institutional audit log with actor, action, resource, timestamp, and detail.",
      },
    ],
  },
  {
    id: "POL-003",
    title: "Open Source Contribution Policy",
    status: "published",
    icon: "📖",
    description:
      "All software produced by the Foundation is open-source under OSI-approved licenses. Contribution guidelines follow standard fork-and-PR workflow.",
    sections: [
      {
        heading: "Licensing",
        body: "Default license is MIT for libraries, AGPL for platform infrastructure. All third-party dependencies must be OSI-approved.",
      },
      {
        heading: "Contributions",
        body: "External contributors must sign a Developer Certificate of Origin. Maintainers review all contributions.",
      },
    ],
  },
  {
    id: "POL-004",
    title: "Vendor Independence Policy",
    status: "published",
    icon: "🔗",
    description:
      "The Foundation maintains provider-agnostic abstractions for all critical infrastructure. No single vendor dependency is permitted.",
    sections: [
      {
        heading: "Abstraction",
        body: "All external service integrations must be behind provider-agnostic interfaces. Adherence to ADR-0002 is mandatory.",
      },
      {
        heading: "Review",
        body: "The Architecture Board reviews all new dependencies for vendor lock-in risk during the ADR approval process.",
      },
    ],
  },
  {
    id: "POL-005",
    title: "Digital Accessibility Policy",
    status: "published",
    icon: "♿",
    description:
      "All public-facing digital properties conform to WCAG AA standards. Accessibility is a release-blocking criterion.",
    sections: [
      {
        heading: "Standard",
        body: "WCAG 2.2 Level AA compliance is required for all public digital properties.",
      },
      {
        heading: "Verification",
        body: "Automated accessibility scanning in CI/CD. Manual testing with screen readers and keyboard-only navigation before each production release.",
      },
    ],
  },
  {
    id: "POL-006",
    title: "Architecture Decision Records Policy",
    status: "published",
    icon: "📋",
    description:
      "All significant architectural decisions are recorded as immutable ADRs with full rationale, alternatives considered, and approval chain.",
    sections: [
      {
        heading: "ADR Format",
        body: "Each ADR must include: title, status, context, decision, consequences, alternatives considered, and approval date.",
      },
      {
        heading: "Immutability",
        body: "ADRs are never modified retroactively. Superseding an ADR requires a new ADR that references the superseded record.",
      },
    ],
  },
] as const;
