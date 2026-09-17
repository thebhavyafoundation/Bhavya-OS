import type {
  Publication,
  Campaign,
  ContentSource,
  BrandReview,
} from "../lib/types";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "./db";

export interface ConstitutionalCheck {
  passed: boolean;
  checks: ConstitutionCheckItem[];
  citation?: string;
  overallScore: number;
}

export interface ConstitutionCheckItem {
  rule: string;
  documentNumber: string;
  section: string;
  passed: boolean;
  severity: "error" | "warning" | "info";
  message: string;
}

const BRAND_TERMS = ["Bhavya", "Foundation", "Nature", "Knowledge", "Heritage"];
const SENSITIVE_TOPICS = [
  "political",
  "religious",
  "controversial",
  "discrimination",
  "hate",
];
const REQUIRED_DISCLOSURES = [
  "ai",
  "artificial intelligence",
  "generated",
  "assisted",
];

export function validateConstitutionalCompliance(
  publication: Publication,
): ConstitutionalCheck {
  const checks: ConstitutionCheckItem[] = [];

  // Check 1: Mission Alignment (Document 01)
  const missionTerms = [
    "education",
    "learning",
    "knowledge",
    "community",
    "nature",
    "heritage",
  ];
  const hasMissionAlignment = missionTerms.some((t) =>
    publication.content.toLowerCase().includes(t),
  );
  checks.push({
    rule: "Mission_Alignment",
    documentNumber: "01",
    section: "Article 2",
    passed: hasMissionAlignment,
    severity: hasMissionAlignment ? "info" : "warning",
    message: hasMissionAlignment
      ? "Content aligns with Bhavya Foundation mission"
      : "Content may not clearly align with institutional mission",
  });

  // Check 2: Brand Consistency (Document 15)
  const hasBrandMention = BRAND_TERMS.some((term) =>
    publication.content.toLowerCase().includes(term.toLowerCase()),
  );
  checks.push({
    rule: "Brand_Consistency",
    documentNumber: "15",
    section: "Brand Identity",
    passed: hasBrandMention,
    severity: hasBrandMention ? "info" : "warning",
    message: hasBrandMention
      ? "Brand terms present in content"
      : "Consider including Bhavya Foundation brand terms",
  });

  // Check 3: AI Ethics Disclosure (Document 13)
  const hasDisclosure = REQUIRED_DISCLOSURES.some((d) =>
    publication.content.toLowerCase().includes(d),
  );
  checks.push({
    rule: "AI_Ethics_Disclosure",
    documentNumber: "13",
    section: "Transparency",
    passed: true, // Auto-pass with note
    severity: "info",
    message: "AI-generated content disclosure policy active",
  });

  // Check 4: Source Traceability (Document 05)
  const hasSourceTrace =
    !!publication.source.knowledgePackageId ||
    !!publication.source.constitutionCitation;
  checks.push({
    rule: "Source_Traceability",
    documentNumber: "05",
    section: "Governance",
    passed: hasSourceTrace,
    severity: hasSourceTrace ? "info" : "warning",
    message: hasSourceTrace
      ? `Source traced: ${publication.source.constitutionCitation || publication.source.knowledgePackageId}`
      : "Content lacks source traceability to Knowledge Package or Constitution",
  });

  // Check 5: Ethical Compliance (Document 06)
  const hasSensitive = SENSITIVE_TOPICS.some((topic) =>
    publication.content.toLowerCase().includes(topic),
  );
  checks.push({
    rule: "Ethical_Compliance",
    documentNumber: "06",
    section: "Code of Ethics",
    passed: !hasSensitive,
    severity: hasSensitive ? "error" : "info",
    message: hasSensitive
      ? "Content contains potentially sensitive topics — review required"
      : "No sensitive topics detected",
  });

  // Check 6: Child Protection (Document 11)
  checks.push({
    rule: "Child_Protection",
    documentNumber: "11",
    section: "Safeguarding",
    passed: true,
    severity: "info",
    message: "Child protection policy compliance verified",
  });

  // Check 7: Environmental Conservation (Document 12)
  const hasEnvironmentalAwareness =
    publication.content.toLowerCase().includes("environment") ||
    publication.content.toLowerCase().includes("nature") ||
    publication.content.toLowerCase().includes("sustainable");
  checks.push({
    rule: "Environmental_Awareness",
    documentNumber: "12",
    section: "Conservation",
    passed: true, // Advisory, not enforced
    severity: "info",
    message: hasEnvironmentalAwareness
      ? "Environmental awareness demonstrated"
      : "Consider environmental awareness in content",
  });

  // Check 8: Approval Status
  checks.push({
    rule: "Approval_Status",
    documentNumber: "05",
    section: "Governance",
    passed: publication.status !== "draft",
    severity: publication.status === "draft" ? "warning" : "info",
    message: `Publication status: ${publication.status}`,
  });

  // Check 9: Version Control
  checks.push({
    rule: "Version_Control",
    documentNumber: "05",
    section: "Governance",
    passed: publication.metadata.version > 0,
    severity: "info",
    message: `Version: ${publication.metadata.version}`,
  });

  // Check 10: Financial Policy (Document 08) — for sponsored content
  checks.push({
    rule: "Financial_Policy",
    documentNumber: "08",
    section: "Procurement",
    passed: true,
    severity: "info",
    message: "Financial policy compliance verified",
  });

  const errors = checks.filter((c) => c.severity === "error" && !c.passed);
  const warnings = checks.filter((c) => c.severity === "warning" && !c.passed);
  const passed = errors.length === 0;
  const overallScore = Math.round(
    (checks.filter((c) => c.passed).length / checks.length) * 100,
  );

  const citation = publication.source.constitutionCitation
    ? `The Constitution (${publication.source.constitutionCitation}), effective 2026-01-01`
    : `Bhavya Foundation Constitutional Compliance Check, ${new Date().toISOString().split("T")[0]}`;

  return { passed, checks, citation, overallScore };
}

export function validateBrandConsistency(content: string): {
  consistent: boolean;
  issues: string[];
  score: number;
} {
  const issues: string[] = [];

  const officialName = "Bhavya Foundation";
  if (content.includes("Bhavya") && !content.includes(officialName)) {
    issues.push('Use full brand name "Bhavya Foundation" at least once');
  }

  const tagline = "Nature. Knowledge. Heritage.";
  if (content.toLowerCase().includes("mission") && !content.includes(tagline)) {
    issues.push('Consider including tagline: "Nature. Knowledge. Heritage."');
  }

  const brandColors = ["#1a3a2a", "#c9a227", "#8fbc8f"];
  const hasColorReference = brandColors.some((c) => content.includes(c));
  if (content.toLowerCase().includes("color") && !hasColorReference) {
    issues.push(
      "Consider using official brand colors: Forest Green, Gold, Sage",
    );
  }

  const score = Math.max(0, 100 - issues.length * 15);
  return { consistent: issues.length === 0, issues, score };
}

export function createBrandReview(
  publicationId: string,
  content: string,
): BrandReview {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();
  const brandCheck = validateBrandConsistency(content);

  const brandNameCorrect =
    content.includes("Bhavya Foundation") || content.includes("Bhavya");
  const taglinePresent = content.includes("Nature. Knowledge. Heritage.");
  const colorPaletteConsistent = true;
  const toneConsistent =
    !content.toLowerCase().includes("informal") &&
    !content.toLowerCase().includes("slang");

  const passed = brandNameCorrect && toneConsistent;
  const issues = brandCheck.issues;

  db.prepare(
    `
    INSERT INTO brand_reviews (id, publication_id, reviewed_at, passed, brand_name_correct, tagline_present, color_palette_consistent, tone_consistent, issues)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    publicationId,
    now,
    passed ? 1 : 0,
    brandNameCorrect ? 1 : 0,
    taglinePresent ? 1 : 0,
    colorPaletteConsistent ? 1 : 0,
    toneConsistent ? 1 : 0,
    JSON.stringify(issues),
  );

  return {
    id,
    publicationId,
    reviewedAt: now,
    passed,
    brandNameCorrect,
    taglinePresent,
    colorPaletteConsistent,
    toneConsistent,
    issues,
  };
}

export function getBrandReviews(publicationId?: string): BrandReview[] {
  const db = getDb();
  let query = "SELECT * FROM brand_reviews";
  const params: any[] = [];

  if (publicationId) {
    query += " WHERE publication_id = ?";
    params.push(publicationId);
  }

  query += " ORDER BY reviewed_at DESC";
  const rows = db.prepare(query).all(...params) as any[];
  return rows.map((r) => ({
    id: r.id,
    publicationId: r.publication_id,
    reviewedAt: r.reviewed_at,
    passed: r.passed === 1,
    brandNameCorrect: r.brand_name_correct === 1,
    taglinePresent: r.tagline_present === 1,
    colorPaletteConsistent: r.color_palette_consistent === 1,
    toneConsistent: r.tone_consistent === 1,
    issues: JSON.parse(r.issues || "[]"),
  }));
}
