export type GovernanceType =
  | "Governing Document"
  | "Board Resolution"
  | "Policy";

export type GovernanceStatus = "published" | "draft";

export interface GovernanceSection {
  readonly heading: string;
  readonly body: string;
}

export interface GovernanceDocument {
  id: string;
  title: string;
  type: GovernanceType;
  status: GovernanceStatus;
  ratified: string;
  owner: string;
  summary: string;
  sections: readonly GovernanceSection[];
}

export const governance: readonly GovernanceDocument[] = [
  {
    id: "GOV-001",
    title: "Foundation Trust Deed",
    type: "Governing Document",
    status: "published",
    ratified: "2026-07-15",
    owner: "Trustees",
    summary:
      "Establishing trust deed for Bhavya Foundation as a non-profit institutional entity. Mandates radical transparency, vendor independence, and immutable decision logging.",
    sections: [
      {
        heading: "Purpose",
        body: "To establish an enduring institutional foundation that serves humanity and the natural world across generations.",
      },
      {
        heading: "Principles",
        body: "Radical transparency, vendor and provider agnosticism, immutable institutional memory, direct impact routing.",
      },
    ],
  },
  {
    id: "GOV-002",
    title: "Architecture Board Charter",
    type: "Board Resolution",
    status: "published",
    ratified: "2026-07-20",
    owner: "Architecture Board",
    summary:
      "Charter establishing the Architecture Board as the governing body for all technical and architectural decisions within Bhavya Foundation.",
    sections: [
      {
        heading: "Authority",
        body: "The Architecture Board has authority to approve, reject, or supersede all Architecture Decision Records (ADRs), technical standards, and capability contracts.",
      },
      {
        heading: "Membership",
        body: "Board members are appointed by the Trustees and include representatives from Engineering, Governance, and Release domains.",
      },
    ],
  },
  {
    id: "GOV-003",
    title: "AI Agent Oversight Policy",
    type: "Policy",
    status: "published",
    ratified: "2026-07-22",
    owner: "Governance Agent",
    summary:
      "Policy governing the operation, supervision, and auditing of autonomous AI agents within the Bhavya OS runtime.",
    sections: [
      {
        heading: "Supervision Requirements",
        body: "All autonomous AI agents must operate under human supervision with explicit capability contracts defining scope, permissions, and termination conditions.",
      },
      {
        heading: "Audit Trail",
        body: "Every agent action must be logged with immutable timestamp, actor identity, action type, and resource reference in the institutional audit log.",
      },
    ],
  },
  {
    id: "GOV-004",
    title: "Open Source Contribution Framework",
    type: "Board Resolution",
    status: "published",
    ratified: "2026-07-22",
    owner: "Architecture Board",
    summary:
      "Framework governing open source contributions, licensing, and community participation.",
    sections: [
      {
        heading: "Licensing",
        body: "All software produced by the Foundation is open-source under OSI-approved licenses. Standard license is MIT for libraries and AGPL for platform infrastructure.",
      },
      {
        heading: "Contributions",
        body: "External contributions follow standard fork-and-PR workflow with maintainer review. All contributors must sign a Developer Certificate of Origin.",
      },
    ],
  },
  {
    id: "GOV-005",
    title: "Vendor Independence Mandate",
    type: "Board Resolution",
    status: "published",
    ratified: "2026-07-20",
    owner: "Architecture Board",
    summary:
      "Mandate prohibiting critical infrastructure dependency on any single commercial vendor or proprietary platform.",
    sections: [
      {
        heading: "Abstraction Requirement",
        body: "All integrations with external services must be behind provider-agnostic abstraction layers. No business logic may depend on a specific provider's SDK or API.",
      },
      {
        heading: "Compliance",
        body: "The Architecture Board reviews all new dependencies for vendor lock-in risk. Violations are treated as architectural debt requiring remediation within one release cycle.",
      },
    ],
  },
  {
    id: "GOV-006",
    title: "Digital Accessibility Compliance Standard",
    type: "Policy",
    status: "draft",
    ratified: "2026-07-23",
    owner: "Architecture Board",
    summary:
      "Mandates WCAG AA compliance for all public-facing digital properties. Requires automated and manual accessibility auditing as a release-blocking criterion.",
    sections: [
      {
        heading: "Standard",
        body: "All public-facing digital properties must conform to Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.",
      },
      {
        heading: "Verification",
        body: "Automated accessibility scanning is required in CI/CD pipeline. Manual testing with screen readers and keyboard-only navigation required before production release.",
      },
    ],
  },
] as const;
