import { Collection, DocumentCategory } from "./models";
import { getDocuments } from "./documents";

// ── Default Collections ────────────────────────────────────

const DEFAULT_COLLECTIONS: Omit<Collection, "documentIds">[] = [
  {
    id: "governance-framework",
    name: "Governance Framework",
    description:
      "Core governing documents, decision records, and institutional policies",
    icon: "\u{2696}",
    category: "governance",
    created: "2026-07-15",
  },
  {
    id: "engineering-standards",
    name: "Engineering Standards",
    description:
      "Technical standards, architecture rules, and development practices",
    icon: "\u{1F527}",
    category: "standard",
    created: "2026-07-15",
  },
  {
    id: "decision-records",
    name: "Decision Records (ADRs)",
    description:
      "Architectural Decision Records documenting key technical choices",
    icon: "\u{1F4CB}",
    category: "adr",
    created: "2026-07-15",
  },
  {
    id: "technical-rfcs",
    name: "Technical RFCs",
    description:
      "Request for Comments \u2014 technical proposals and specifications",
    icon: "\u{1F4DD}",
    category: "rfc",
    created: "2026-07-20",
  },
  {
    id: "release-history",
    name: "Release History",
    description: "All platform releases with changelogs and highlights",
    icon: "\u{1F680}",
    category: "release",
    created: "2026-07-22",
  },
  {
    id: "institutional-policies",
    name: "Institutional Policies",
    description:
      "Organizational policies for governance, ethics, and operations",
    icon: "\u{1F4DC}",
    category: "policy",
    created: "2026-07-15",
  },
  {
    id: "environmental-restoration",
    name: "Environmental Restoration",
    description:
      "Plantation standards, forest management, biodiversity reports",
    icon: "\u{1F333}",
    category: "standard",
    created: "2026-07-15",
  },
  {
    id: "traditional-knowledge",
    name: "Traditional Knowledge",
    description:
      "Indigenous heritage, cultural preservation, yoga, traditional practices",
    icon: "\u{1F3DB}",
    category: "content",
    created: "2026-07-15",
  },
  {
    id: "research-papers",
    name: "Research Papers",
    description:
      "Technical RFCs, research findings, evidence-based recommendations",
    icon: "\u{1F52C}",
    category: "rfc",
    created: "2026-07-15",
  },
  {
    id: "education",
    name: "Education",
    description: "AI literacy, digital library resources, learning modules",
    icon: "\u{1F4DA}",
    category: "content",
    created: "2026-07-15",
  },
  {
    id: "platform-releases",
    name: "Platform Releases",
    description: "Release notes, changelogs, and version history",
    icon: "\u{1F680}",
    category: "release",
    created: "2026-07-15",
  },
];

// ── Collection Repository ──────────────────────────────────

let _collectionsCache: Collection[] | null = null;

export function getCollections(): Collection[] {
  if (!_collectionsCache) {
    const docs = getDocuments();
    _collectionsCache = DEFAULT_COLLECTIONS.map((col) => ({
      ...col,
      documentIds: docs
        .filter((d) => {
          if (col.id === "environmental-restoration") {
            return (
              d.category === "standard" &&
              d.tags.some(
                (t) =>
                  t.includes("forest") ||
                  t.includes("environment") ||
                  t.includes("plantation"),
              )
            );
          }
          if (col.id === "traditional-knowledge") {
            return (
              d.category === "content" &&
              (d.id.includes("heritage") || d.id.includes("nature"))
            );
          }
          if (
            col.id === "governance-framework" ||
            col.id === "institutional-policies"
          ) {
            return ["governance", "policy"].includes(d.category);
          }
          if (col.id === "decision-records") return d.category === "adr";
          if (col.id === "technical-rfcs" || col.id === "research-papers") {
            return ["rfc", "research"].includes(d.category);
          }
          if (col.id === "engineering-standards")
            return d.category === "standard";
          if (col.id === "release-history" || col.id === "platform-releases") {
            return d.category === "release";
          }
          if (col.id === "education") {
            return (
              d.category === "content" &&
              (d.id.includes("knowledge") || d.id.includes("education"))
            );
          }
          return d.category === col.category;
        })
        .map((d) => d.id),
    }));
  }
  return _collectionsCache;
}

export function getCollection(id: string): Collection | undefined {
  return getCollections().find((c) => c.id === id);
}
