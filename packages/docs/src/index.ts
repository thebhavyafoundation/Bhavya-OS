import type { DocEntry } from "./types.js";

export const docsVersion = "Founding Edition";

export const docs: DocEntry[] = [
  {
    slug: "constitution/preamble",
    title: "Foundation Preamble",
    section: "Constitution",
    version: docsVersion,
    excerpt:
      "Bhavya Foundation is established as a perpetual charitable institution dedicated to forests, culture, knowledge, responsible science, AI, yoga, wellbeing, and service.",
  },
  {
    slug: "constitution/founding-principles",
    title: "Founding Principles",
    section: "Constitution",
    version: docsVersion,
    excerpt:
      "Service before self, nature before exploitation, knowledge before ignorance, integrity before convenience, transparency before secrecy, and long-term stewardship.",
  },
  {
    slug: "trust-deed/board-duties",
    title: "Board Duties",
    section: "Trust Deed",
    version: docsVersion,
    excerpt:
      "Trustees protect Foundation assets, mission, legal compliance, budgets, donor trust, and the public interest.",
  },
  {
    slug: "founder-charter/founder-role",
    title: "Founder Charter",
    section: "Founder Charter",
    version: docsVersion,
    excerpt:
      "The Founder protects the vision, safeguards institutional integrity, guides long-term strategy, and represents the Foundation nationally and internationally.",
  },
  {
    slug: "governance/transparency",
    title: "Transparency",
    section: "Governance",
    version: docsVersion,
    excerpt:
      "The Foundation shall maintain audited accounts, donation records, annual reports, project reports, and complete financial accountability.",
  },
  {
    slug: "policies/digital-library",
    title: "Digital Library Policy",
    section: "Policies",
    version: "BF-KNOW-001 v1.0",
    excerpt:
      "The Bhavya Digital Library democratizes access to books, research, AI tools, educational technology, and lifelong learning opportunities.",
  },
  {
    slug: "volunteer/responsibilities",
    title: "Volunteer Responsibilities",
    section: "Volunteer",
    version: docsVersion,
    excerpt:
      "Volunteers support community service with discipline, respect, lawful conduct, and protection of Foundation assets.",
  },
  {
    slug: "environment/forest-mission",
    title: "Forest Mission",
    section: "Environment",
    version: docsVersion,
    excerpt:
      "Restore forests, protect biodiversity, conserve water, and restore sacred landscapes through long-term ecological stewardship.",
  },
  {
    slug: "ai/responsible-learning",
    title: "Responsible AI Learning",
    section: "AI",
    version: docsVersion,
    excerpt:
      "AI shall supplement critical thinking. Users are encouraged to verify information and understand AI limitations.",
  },
  {
    slug: "digital-library/services",
    title: "Digital Library Services",
    section: "Digital Library",
    version: "BF-KNOW-001 v1.0",
    excerpt:
      "Services include book lending, digital access, AI learning sessions, coding workshops, research assistance, and community study spaces.",
  },
  {
    slug: "brand/theme",
    title: "Brand Theme",
    section: "Brand",
    version: "0.1.0",
    excerpt:
      "Forest Green, Earth Brown, Accent Gold, and Neutral Gray provide a timeless system for light and dark interfaces.",
  },
];

export const docSections = Array.from(new Set(docs.map((doc) => doc.section)));

export function getDoc(slug: string) {
  return docs.find((doc) => doc.slug === slug);
}

export function getAdjacentDocs(slug: string) {
  const index = docs.findIndex((doc) => doc.slug === slug);
  return {
    previous: index > 0 ? docs[index - 1] : undefined,
    next: index >= 0 && index < docs.length - 1 ? docs[index + 1] : undefined,
  };
}
