import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

/**
 * Constitutional Design Validator
 *
 * Validates design decisions against the Bhavya Brand Constitution (Document 15)
 * and the Institutional Constitution (Document 01).
 *
 * Scoring dimensions:
 * - Brand Alignment: Colors, typography, personality match Brand Constitution
 * - Mission Alignment: Content serves one of 4 permanent missions
 * - Tone Compliance: Evidence-based, no exaggeration, no manipulation
 * - Anti-Pattern Score: Flags fake urgency, dark patterns, manipulative UX
 * - Accessibility Compliance: WCAG 2.1 AA, reduced motion, keyboard nav
 * - Evidence Quality: Data-driven claims, no vague slogans
 */

interface ConstitutionalRule {
  id: string;
  category: string;
  rule: string;
  severity: "critical" | "major" | "minor";
  check: (input: ValidationInput) => Violation | null;
}

interface ValidationInput {
  typography?: string;
  color_system?: string;
  content?: string;
  interaction_patterns?: string[];
  accessibility?: Record<string, unknown>;
  motion?: string;
  imagery?: string;
  tone?: string;
}

interface Violation {
  ruleId: string;
  category: string;
  severity: "critical" | "major" | "minor";
  message: string;
  recommendation: string;
}

interface AntiPattern {
  id: string;
  name: string;
  description: string;
  detection: (input: ValidationInput) => boolean;
}

// Brand Constitution rules (Document 15)
const CONSTITUTIONAL_RULES: ConstitutionalRule[] = [
  {
    id: "brand-colors",
    category: "brand",
    rule: "Must use Bhavya brand palette: Forest Green #0E382E, Heritage Gold #D4AF37, Warm Ivory #F7F4EC",
    severity: "critical",
    check: (input) => {
      if (!input.color_system) return null;
      const colorLower = input.color_system.toLowerCase();
      const hasBrandGreen =
        colorLower.includes("0e382e") || colorLower.includes("forest");
      const hasBrandGold =
        colorLower.includes("d4af37") || colorLower.includes("gold");
      const hasBrandIvory =
        colorLower.includes("f7f4ec") || colorLower.includes("ivory");
      if (!hasBrandGreen && !hasBrandGold && !hasBrandIvory) {
        return {
          ruleId: "brand-colors",
          category: "brand",
          severity: "critical",
          message: "No Bhavya brand colors detected in color system",
          recommendation:
            "Use Forest Green (#0E382E) as primary, Heritage Gold (#D4AF37) as accent, Warm Ivory (#F7F4EC) as background",
        };
      }
      return null;
    },
  },
  {
    id: "brand-typography",
    category: "brand",
    rule: "Must use Inter for body, Playfair Display or serif for headings",
    severity: "major",
    check: (input) => {
      if (!input.typography) return null;
      const typoLower = input.typography.toLowerCase();
      const hasInter = typoLower.includes("inter");
      const hasPlayfair =
        typoLower.includes("playfair") || typoLower.includes("serif");
      if (!hasInter && !hasPlayfair) {
        return {
          ruleId: "brand-typography",
          category: "brand",
          severity: "major",
          message: "Typography does not match Brand Constitution requirements",
          recommendation:
            "Use Inter for body text and Playfair Display (or similar serif) for headings",
        };
      }
      return null;
    },
  },
  {
    id: "tone-exaggeration",
    category: "tone",
    rule: "Never exaggerate, boast, or use emotional manipulation (Brand Constitution Ch. 16)",
    severity: "critical",
    check: (input) => {
      if (!input.content) return null;
      const contentLower = input.content.toLowerCase();
      const exaggerationPatterns = [
        "best ever",
        "amazing",
        "incredible",
        "revolutionary",
        "game-changing",
        "world-class",
        "cutting-edge",
        "state-of-the-art",
        "unprecedented",
        "groundbreaking",
        "disruptive",
        "don't miss out",
        "limited time",
        "act now",
        "hurry",
        "you'll regret",
        "fomo",
        "once in a lifetime",
      ];
      const found = exaggerationPatterns.filter((p) =>
        contentLower.includes(p),
      );
      if (found.length > 0) {
        return {
          ruleId: "tone-exaggeration",
          category: "tone",
          severity: "critical",
          message: `Exaggeration or manipulation detected: "${found.join('", "')}"`,
          recommendation:
            "Use evidence-based language. Instead of 'amazing results', write '89% first-year survival rate across 8 hectares'",
        };
      }
      return null;
    },
  },
  {
    id: "tone-evidence",
    category: "tone",
    rule: "Write like Apple, OpenAI, NASA — simple, clear, confident, scientific (Brand Constitution Ch. 17)",
    severity: "major",
    check: (input) => {
      if (!input.content) return null;
      const contentLower = input.content.toLowerCase();
      const vaguePatterns = [
        "many people",
        "a lot of",
        "very successful",
        "great impact",
        "significant progress",
        "major achievement",
        "considerable",
        "various",
        "numerous",
        "substantial",
      ];
      const found = vaguePatterns.filter((p) => contentLower.includes(p));
      if (found.length > 0) {
        return {
          ruleId: "tone-evidence",
          category: "tone",
          severity: "major",
          message: `Vague language detected: "${found.join('", "')}"`,
          recommendation:
            "Replace vague claims with specific evidence. Instead of 'great impact', write '50+ communities engaged with measurable outcomes'",
        };
      }
      return null;
    },
  },
  {
    id: "mission-alignment",
    category: "mission",
    rule: "Every Bhavya experience must serve one of 4 permanent missions: Forest, Knowledge, Heritage, Community",
    severity: "critical",
    check: (input) => {
      if (!input.content) return null;
      const contentLower = input.content.toLowerCase();
      const missions = [
        "forest",
        "ecolog",
        "nature",
        "tree",
        "biodiversity",
        "knowledge",
        "ai",
        "research",
        "education",
        "stem",
        "learning",
        "heritage",
        "culture",
        "tradition",
        "temple",
        "history",
        "community",
        "youth",
        "volunteer",
        "empowerment",
        "development",
      ];
      const found = missions.filter((m) => contentLower.includes(m));
      if (found.length === 0) {
        return {
          ruleId: "mission-alignment",
          category: "mission",
          severity: "critical",
          message: "No alignment with any of the 4 permanent missions detected",
          recommendation:
            "Content should serve Forest, Knowledge, Heritage, or Community mission",
        };
      }
      return null;
    },
  },
  {
    id: "dark-patterns",
    category: "anti-pattern",
    rule: "No dark patterns, fake urgency, or manipulative UX (Brand Constitution Ch. 16)",
    severity: "critical",
    check: (input) => {
      if (!input.interaction_patterns) return null;
      const patterns = input.interaction_patterns.join(" ").toLowerCase();
      const darkPatterns = [
        "countdown timer",
        "limited offer",
        "act now",
        "hurry",
        "only left",
        "slots remaining",
        "expiring soon",
        "confirm shaming",
        "hidden costs",
        "forced continuity",
        "misdirection",
        "obstruction",
        "sneaking",
        "urgency",
        "scarcity",
      ];
      const found = darkPatterns.filter((p) => patterns.includes(p));
      if (found.length > 0) {
        return {
          ruleId: "dark-patterns",
          category: "anti-pattern",
          severity: "critical",
          message: `Dark pattern detected: "${found.join('", "')}"`,
          recommendation:
            "Remove manipulative UX elements. Bhavya builds trust through transparency, not pressure",
        };
      }
      return null;
    },
  },
  {
    id: "accessibility-basic",
    category: "accessibility",
    rule: "Must support keyboard navigation and screen readers (Brand Constitution Ch. 20)",
    severity: "major",
    check: (input) => {
      if (!input.accessibility) return null;
      const a11y = input.accessibility;
      const hasKeyboard = a11y.keyboard || a11y.keyboardNavigation;
      const hasScreenReader = a11y.screenReader || a11y.aria || a11y.semantics;
      if (!hasKeyboard && !hasScreenReader) {
        return {
          ruleId: "accessibility-basic",
          category: "accessibility",
          severity: "major",
          message: "No keyboard navigation or screen reader support detected",
          recommendation:
            "Add keyboard navigation, ARIA labels, and semantic HTML for accessibility",
        };
      }
      return null;
    },
  },
  {
    id: "minimal-design",
    category: "design",
    rule: "Design should be simple, minimal, premium, timeless (Brand Constitution Ch. 10)",
    severity: "minor",
    check: (input) => {
      if (!input.color_system) return null;
      const colorLower = input.color_system.toLowerCase();
      const flashyPatterns = [
        "neon",
        "gradient",
        "rainbow",
        "glow",
        "shadow",
        "animation",
        "particle",
        "sparkle",
        "shine",
      ];
      const found = flashyPatterns.filter((p) => colorLower.includes(p));
      if (found.length > 2) {
        return {
          ruleId: "minimal-design",
          category: "design",
          severity: "minor",
          message: `Potentially non-minimal design detected: "${found.join('", "')}"`,
          recommendation:
            "Bhavya design philosophy: Apple, Tesla, Notion — simple, minimal, premium, timeless",
        };
      }
      return null;
    },
  },
  {
    id: "photography-authentic",
    category: "imagery",
    rule: "Use real forests, real villages, real children learning — no staged corporate photos (Brand Constitution Ch. 15)",
    severity: "major",
    check: (input) => {
      if (!input.imagery) return null;
      const imageryLower = input.imagery.toLowerCase();
      const fakePatterns = [
        "stock photo",
        "stock image",
        "corporate",
        "business meeting",
        "office",
        "boardroom",
        "handshake",
        "smiling office",
        "ai generated",
        "illustration",
        "cartoon",
        "clipart",
      ];
      const found = fakePatterns.filter((p) => imageryLower.includes(p));
      if (found.length > 0) {
        return {
          ruleId: "photography-authentic",
          category: "imagery",
          severity: "major",
          message: `Non-authentic imagery detected: "${found.join('", "')}"`,
          recommendation:
            "Use real photographs: forests, villages, children learning, volunteers, farmers, mountains, libraries",
        };
      }
      return null;
    },
  },
  {
    id: "reduced-motion",
    category: "accessibility",
    rule: "Must respect prefers-reduced-motion (Brand Constitution Ch. 20, Motion System)",
    severity: "minor",
    check: (input) => {
      if (!input.motion) return null;
      const motionLower = input.motion.toLowerCase();
      if (motionLower.includes("animation") || motionLower.includes("motion")) {
        if (
          !motionLower.includes("reduced-motion") &&
          !motionLower.includes("prefers")
        ) {
          return {
            ruleId: "reduced-motion",
            category: "accessibility",
            severity: "minor",
            message:
              "Motion detected but no prefers-reduced-motion support noted",
            recommendation:
              "Add @media (prefers-reduced-motion: reduce) to disable animations for sensitive users",
          };
        }
      }
      return null;
    },
  },
];

// Anti-pattern detection (Brand Constitution Ch. 16, 17)
const ANTI_PATTERNS: AntiPattern[] = [
  {
    id: "fake-urgency",
    name: "Fake Urgency",
    description: "Creating artificial time pressure to force decisions",
    detection: (input) => {
      if (!input.content) return false;
      const lower = input.content.toLowerCase();
      return [
        "limited time",
        "act now",
        "hurry",
        "expiring",
        "last chance",
        "only today",
      ].some((p) => lower.includes(p));
    },
  },
  {
    id: "emotional-manipulation",
    name: "Emotional Manipulation",
    description: "Using guilt, fear, or shame to influence behavior",
    detection: (input) => {
      if (!input.content) return false;
      const lower = input.content.toLowerCase();
      return [
        "you'll regret",
        "don't you care",
        "how could you",
        "shame on",
        "guilty",
      ].some((p) => lower.includes(p));
    },
  },
  {
    id: "exaggerated-claims",
    name: "Exaggerated Claims",
    description: "Making unsupported or inflated performance claims",
    detection: (input) => {
      if (!input.content) return false;
      const lower = input.content.toLowerCase();
      return [
        "best in class",
        "number one",
        "unmatched",
        "unrivaled",
        "no comparison",
      ].some((p) => lower.includes(p));
    },
  },
  {
    id: "dark-ux",
    name: "Dark UX Pattern",
    description: "Using deceptive UI patterns to trick users",
    detection: (input) => {
      if (!input.interaction_patterns) return false;
      const patterns = input.interaction_patterns.join(" ").toLowerCase();
      return [
        "confirm shaming",
        "hidden unsubscribe",
        "forced continuity",
        "trick question",
      ].some((p) => patterns.includes(p));
    },
  },
  {
    id: "vague-impact",
    name: "Vague Impact Claims",
    description: "Making impact claims without specific evidence",
    detection: (input) => {
      if (!input.content) return false;
      const lower = input.content.toLowerCase();
      return (
        [
          "helping thousands",
          "making a difference",
          "changing lives",
          "transforming communities",
        ].some((p) => lower.includes(p)) && !/\d+/.test(input.content)
      );
    },
  },
];

function calculateMissionRelevance(content: string): Record<string, number> {
  const lower = content.toLowerCase();
  return {
    forest: (
      lower.match(
        /forest|ecolog|nature|tree|biodiversity|plantation|conservation/g,
      ) || []
    ).length,
    knowledge: (
      lower.match(
        /knowledge|ai|research|education|stem|learning|library|digital/g,
      ) || []
    ).length,
    heritage: (
      lower.match(
        /heritage|culture|tradition|temple|history|yoga|architecture/g,
      ) || []
    ).length,
    community: (
      lower.match(
        /community|youth|volunteer|empowerment|development|school|women/g,
      ) || []
    ).length,
  };
}

export const GET = withAuth(async (request, _user) => {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const sourceId = searchParams.get("sourceId") || "";
  const sourceType = searchParams.get("sourceType") || "";

  let query = "SELECT * FROM constitutional_validations WHERE 1=1";
  const params: string[] = [];

  if (sourceId) {
    query += " AND source_id = ?";
    params.push(sourceId);
  }
  if (sourceType) {
    query += " AND source_type = ?";
    params.push(sourceType);
  }

  query += " ORDER BY overall_constitutional_score DESC";

  const validations = db.prepare(query).all(...params);

  return NextResponse.json({ validations });
});

export const POST = withAuth(async (request, _user) => {
  const db = getDb();
  const body = await request.json();

  const { source_id, source_type, input } = body;

  if (!source_id || !source_type || !input) {
    return NextResponse.json(
      { error: "source_id, source_type, and input are required" },
      { status: 400 },
    );
  }

  const validationInput: ValidationInput = {
    typography: input.typography,
    color_system: input.color_system,
    content: input.content,
    interaction_patterns: input.interaction_patterns,
    accessibility: input.accessibility,
    motion: input.motion,
    imagery: input.imagery,
    tone: input.tone,
  };

  // Run all constitutional rules
  const violations: Violation[] = [];
  for (const rule of CONSTITUTIONAL_RULES) {
    const violation = rule.check(validationInput);
    if (violation) violations.push(violation);
  }

  // Detect anti-patterns
  const antiPatternsDetected: string[] = [];
  for (const ap of ANTI_PATTERNS) {
    if (ap.detection(validationInput)) {
      antiPatternsDetected.push(ap.id);
    }
  }

  // Calculate mission relevance
  const missionRelevance = calculateMissionRelevance(input.content || "");

  // Calculate scores (0-100, higher is better)
  const criticalViolations = violations.filter(
    (v) => v.severity === "critical",
  ).length;
  const majorViolations = violations.filter(
    (v) => v.severity === "major",
  ).length;
  const minorViolations = violations.filter(
    (v) => v.severity === "minor",
  ).length;

  const brandAlignment = Math.max(
    0,
    100 - criticalViolations * 30 - majorViolations * 15 - minorViolations * 5,
  );
  const missionAlignment = Math.min(
    100,
    (Object.values(missionRelevance).reduce((a, b) => a + b, 0) / 4) * 25,
  );
  const toneCompliance = Math.max(
    0,
    100 - violations.filter((v) => v.category === "tone").length * 25,
  );
  const antiPatternScore = Math.max(0, 100 - antiPatternsDetected.length * 20);
  const accessibilityCompliance = Math.max(
    0,
    100 - violations.filter((v) => v.category === "accessibility").length * 25,
  );
  const evidenceQuality = Math.max(
    0,
    100 - violations.filter((v) => v.ruleId === "tone-evidence").length * 30,
  );

  const overallConstitutionalScore = Math.round(
    (brandAlignment +
      missionAlignment +
      toneCompliance +
      antiPatternScore +
      accessibilityCompliance +
      evidenceQuality) /
      6,
  );

  // Generate recommendations
  const recommendations = violations.map((v) => v.recommendation);
  if (antiPatternsDetected.length > 0) {
    recommendations.push(
      "Remove all detected anti-patterns to maintain institutional integrity",
    );
  }

  const id = `cv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  db.prepare(
    `
    INSERT INTO constitutional_validations (
      id, source_id, source_type, brand_alignment, mission_alignment,
      tone_compliance, anti_pattern_score, accessibility_compliance,
      evidence_quality, overall_constitutional_score, violations,
      recommendations, anti_patterns_detected, mission_relevance
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    id,
    source_id,
    source_type,
    Math.round(brandAlignment),
    Math.round(missionAlignment),
    Math.round(toneCompliance),
    Math.round(antiPatternScore),
    Math.round(accessibilityCompliance),
    Math.round(evidenceQuality),
    overallConstitutionalScore,
    JSON.stringify(violations),
    JSON.stringify(recommendations),
    JSON.stringify(antiPatternsDetected),
    JSON.stringify(missionRelevance),
  );

  return NextResponse.json({
    id,
    overall_constitutional_score: overallConstitutionalScore,
    brand_alignment: Math.round(brandAlignment),
    mission_alignment: Math.round(missionAlignment),
    tone_compliance: Math.round(toneCompliance),
    anti_pattern_score: Math.round(antiPatternScore),
    accessibility_compliance: Math.round(accessibilityCompliance),
    evidence_quality: Math.round(evidenceQuality),
    violations,
    recommendations,
    anti_patterns_detected: antiPatternsDetected,
    mission_relevance: missionRelevance,
  });
});
