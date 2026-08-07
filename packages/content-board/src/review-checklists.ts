import type { ReviewChecklist } from "./types";

const technicalAccuracy: ReviewChecklist = {
  type: "technical-accuracy",
  role: "subject-matter-expert",
  items: [
    {
      id: "ta-1",
      label: "Code executes without errors",
      description: "All code examples run successfully in a clean environment",
    },
    {
      id: "ta-2",
      label: "Concepts are factually correct",
      description: "All technical claims are accurate and current",
    },
    {
      id: "ta-3",
      label: "References are valid",
      description: "All citations point to real, accessible sources",
    },
    {
      id: "ta-4",
      label: "Definitions are precise",
      description: "Technical terms are defined correctly and completely",
    },
    {
      id: "ta-5",
      label: "Examples demonstrate concepts",
      description:
        "Code and non-code examples accurately illustrate stated concepts",
    },
    {
      id: "ta-6",
      label: "Edge cases addressed",
      description: "Known edge cases or limitations are acknowledged",
    },
    {
      id: "ta-7",
      label: "No deprecated patterns",
      description:
        "Content uses current best practices, not outdated approaches",
    },
    {
      id: "ta-8",
      label: "Version compatibility noted",
      description: "Any version-specific behavior is documented",
    },
    {
      id: "ta-9",
      label: "Data flow is accurate",
      description: "Process descriptions match actual system behavior",
    },
    {
      id: "ta-10",
      label: "Terminology consistent",
      description: "Same terms used throughout without mixing synonyms",
    },
  ],
};

const educationalQuality: ReviewChecklist = {
  type: "educational-quality",
  role: "curriculum-designer",
  items: [
    {
      id: "eq-1",
      label: "Learning objectives are clear",
      description: "Objectives are specific, measurable, and achievable",
    },
    {
      id: "eq-2",
      label: "Content is scaffolded",
      description: "Complexity increases gradually from simple to advanced",
    },
    {
      id: "eq-3",
      label: "Engaging for target audience",
      description: "Content is age-appropriate and motivating",
    },
    {
      id: "eq-4",
      label: "Assessment aligns with objectives",
      description: "Questions test what the lesson claims to teach",
    },
    {
      id: "eq-5",
      label: "Prior knowledge acknowledged",
      description:
        "Prerequisites are stated and assumed knowledge is reasonable",
    },
    {
      id: "eq-6",
      label: "Active learning included",
      description:
        "Exercises promote hands-on practice, not just passive reading",
    },
    {
      id: "eq-7",
      label: "Multiple representations used",
      description: "Concepts shown through text, visuals, code, and examples",
    },
    {
      id: "eq-8",
      label: "Feedback opportunities exist",
      description: "Students can check understanding before moving on",
    },
    {
      id: "eq-9",
      label: "Real-world connections",
      description: "Abstract concepts linked to practical applications",
    },
    {
      id: "eq-10",
      label: "Time estimates are realistic",
      description: "Suggested durations match actual completion times",
    },
  ],
};

const researchQuality: ReviewChecklist = {
  type: "research-quality",
  role: "research-librarian",
  items: [
    {
      id: "rq-1",
      label: "Citations are current",
      description: "Sources published within the last 5 years unless seminal",
    },
    {
      id: "rq-2",
      label: "Methodology is sound",
      description: "Any referenced studies use appropriate methods",
    },
    {
      id: "rq-3",
      label: "Sources are authoritative",
      description:
        "Peer-reviewed journals, reputable organizations, or established authors",
    },
    {
      id: "rq-4",
      label: "Claims are supported",
      description:
        "Every factual claim has a corresponding citation or evidence",
    },
    {
      id: "rq-5",
      label: "No cherry-picking",
      description: "Multiple perspectives represented where debate exists",
    },
    {
      id: "rq-6",
      label: "Data is accurately represented",
      description: "Statistics and data points match source publications",
    },
    {
      id: "rq-7",
      label: "Research gap acknowledged",
      description: "Limitations and open questions are noted where relevant",
    },
    {
      id: "rq-8",
      label: "Ethical considerations noted",
      description:
        "Any ethical implications of the research or application are addressed",
    },
  ],
};

const constitutionalCompliance: ReviewChecklist = {
  type: "constitutional-compliance",
  role: "editor",
  items: [
    {
      id: "cc-1",
      label: "Brand voice consistent",
      description: "Tone aligns with Bhavya Foundation voice guidelines",
    },
    {
      id: "cc-2",
      label: "Ethical standards met",
      description:
        "Content promotes responsible AI use and digital citizenship",
    },
    {
      id: "cc-3",
      label: "Culturally sensitive",
      description: "Content respects diverse backgrounds and perspectives",
    },
    {
      id: "cc-4",
      label: "No harmful content",
      description:
        "Free from bias, stereotypes, or potentially harmful material",
    },
    {
      id: "cc-5",
      label: "Privacy respected",
      description:
        "No personally identifiable information or unsafe data practices",
    },
    {
      id: "cc-6",
      label: "Inclusive language",
      description:
        "Gender-neutral, accessible, and non-exclusionary language used",
    },
    {
      id: "cc-7",
      label: "Attribution complete",
      description: "All third-party content properly attributed",
    },
    {
      id: "cc-8",
      label: "License compliant",
      description: "Content usage complies with applicable licenses and terms",
    },
  ],
};

const accessibility: ReviewChecklist = {
  type: "accessibility",
  role: "accessibility-auditor",
  items: [
    {
      id: "ac-1",
      label: "WCAG 2.1 AA compliant",
      description: "Meets Web Content Accessibility Guidelines at AA level",
    },
    {
      id: "ac-2",
      label: "Keyboard navigable",
      description: "All interactive elements accessible via keyboard",
    },
    {
      id: "ac-3",
      label: "Screen reader compatible",
      description: "Semantic HTML and ARIA labels where needed",
    },
    {
      id: "ac-4",
      label: "Color contrast sufficient",
      description: "Text meets 4.5:1 contrast ratio, large text 3:1",
    },
    {
      id: "ac-5",
      label: "Alt text provided",
      description: "All images have descriptive alternative text",
    },
    {
      id: "ac-6",
      label: "Captions/transcripts available",
      description: "Video and audio content has captions or transcripts",
    },
    {
      id: "ac-7",
      label: "Focus indicators visible",
      description: "Keyboard focus is clearly visible on interactive elements",
    },
    {
      id: "ac-8",
      label: "Text resizable",
      description: "Content remains usable when text is scaled to 200%",
    },
    {
      id: "ac-9",
      label: "No content flashing",
      description: "Nothing flashes more than 3 times per second",
    },
    {
      id: "ac-10",
      label: "Reading level appropriate",
      description: "Text complexity matches target audience level",
    },
  ],
};

const writingQuality: ReviewChecklist = {
  type: "writing-quality",
  role: "editor",
  items: [
    {
      id: "wq-1",
      label: "Clear and concise",
      description: "No unnecessary jargon or filler words",
    },
    {
      id: "wq-2",
      label: "Grammar correct",
      description: "No grammatical errors throughout",
    },
    {
      id: "wq-3",
      label: "Spelling correct",
      description: "No spelling errors throughout",
    },
    {
      id: "wq-4",
      label: "Consistent tone",
      description: "Voice remains consistent from start to finish",
    },
    {
      id: "wq-5",
      label: "Logical flow",
      description: "Sections transition smoothly and follow a clear order",
    },
    {
      id: "wq-6",
      label: "Paragraph structure",
      description: "Each paragraph has a clear topic and supporting sentences",
    },
    {
      id: "wq-7",
      label: "Active voice preferred",
      description:
        "Active constructions used unless passive is more appropriate",
    },
    {
      id: "wq-8",
      label: "Formatting consistent",
      description: "Headings, lists, and spacing follow a consistent pattern",
    },
  ],
};

export const REVIEW_CHECKLISTS: Record<string, ReviewChecklist> = {
  "technical-accuracy": technicalAccuracy,
  "educational-quality": educationalQuality,
  "research-quality": researchQuality,
  "constitutional-compliance": constitutionalCompliance,
  accessibility: accessibility,
  "writing-quality": writingQuality,
};

export function getChecklist(type: string): ReviewChecklist | undefined {
  return REVIEW_CHECKLISTS[type];
}

export function getChecklistByRole(role: string): ReviewChecklist[] {
  return Object.values(REVIEW_CHECKLISTS).filter((cl) => cl.role === role);
}
