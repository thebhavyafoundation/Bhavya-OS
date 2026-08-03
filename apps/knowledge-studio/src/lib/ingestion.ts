import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const ROOT = join(process.cwd(), "..", "..");
const KB_DIR = join(ROOT, "bhavya-ai-lab", "knowledge", "objects");

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export interface KnowledgeObject {
  id: string;
  title: string;
  domain: string;
  subject?: string;
  gradeLevel?: string;
  description: string;
  sourceType:
    "text" | "pdf" | "docx" | "markdown" | "url" | "youtube" | "research-paper";
  sourceContent?: string;
  sourceUrl?: string;
  concepts: { name: string; description: string; difficulty: string }[];
  definitions: { term: string; definition: string }[];
  examples: { scenario: string; explanation: string }[];
  misconceptions: { misconception: string; correction: string }[];
  exercises: { prompt: string; type: string; difficulty: string }[];
  metadata: Record<string, any>;
  createdAt: string;
}

/**
 * Create a Knowledge Object from raw text input.
 */
export function createKOFromText(input: {
  title: string;
  text: string;
  domain?: string;
  subject?: string;
  gradeLevel?: string;
  sourceType?: KnowledgeObject["sourceType"];
  sourceUrl?: string;
}): KnowledgeObject {
  const id = `ko-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const text = input.text;

  // Extract concepts from text (simple sentence-based extraction)
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
  const concepts = sentences.slice(0, 8).map((s, i) => ({
    name: s.split(" ").slice(0, 5).join(" "),
    description: s,
    difficulty: i < 3 ? "beginner" : i < 6 ? "intermediate" : "advanced",
  }));

  // Extract key terms (words that appear frequently)
  const words = text
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 5);
  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
  const topTerms = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
  const definitions = topTerms.map(([term]) => ({
    term,
    definition: `Key concept: ${term} (extracted from source material)`,
  }));

  // Create exercises from sentences
  const exercises = sentences.slice(0, 5).map((s) => ({
    prompt: `Explain in your own words: ${s.split(" ").slice(0, 8).join(" ")}...`,
    type: "short-answer",
    difficulty: "intermediate",
  }));

  const ko: KnowledgeObject = {
    id,
    title: input.title,
    domain: input.domain || "academics",
    subject: input.subject,
    gradeLevel: input.gradeLevel,
    description: text.slice(0, 200),
    sourceType: input.sourceType || "text",
    sourceContent: text,
    sourceUrl: input.sourceUrl,
    concepts,
    definitions,
    examples: [
      {
        title: "Application",
        description: concepts[0]?.description || text.slice(0, 100),
      },
    ],
    misconceptions: [
      {
        misconception: "Surface-level understanding",
        correction: "Deep conceptual understanding required",
      },
    ],
    exercises,
    metadata: {
      wordCount: text.split(/\s+/).length,
      createdAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
  };

  // Persist to filesystem
  ensureDir(KB_DIR);
  writeFileSync(join(KB_DIR, `${id}.json`), JSON.stringify(ko, null, 2));

  return ko;
}

/**
 * Create a KO from structured input (for testing).
 */
export function createKOFromStructured(
  input: Partial<KnowledgeObject> & { title: string },
): KnowledgeObject {
  const id =
    input.id || `ko-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const ko: KnowledgeObject = {
    id,
    title: input.title,
    domain: input.domain || "academics",
    subject: input.subject,
    gradeLevel: input.gradeLevel || "8",
    description: input.description || input.title,
    sourceType: input.sourceType || "text",
    sourceContent: input.sourceContent,
    concepts: input.concepts || [
      {
        name: "Core concept",
        description: input.title,
        difficulty: "beginner",
      },
    ],
    definitions: input.definitions || [
      { term: input.title, definition: input.description || input.title },
    ],
    examples: input.examples || [],
    misconceptions: input.misconceptions || [],
    exercises: input.exercises || [],
    metadata: input.metadata || {},
    createdAt: new Date().toISOString(),
  };

  ensureDir(KB_DIR);
  writeFileSync(join(KB_DIR, `${id}.json`), JSON.stringify(ko, null, 2));

  return ko;
}

export function getKO(id: string): KnowledgeObject | null {
  const filepath = join(KB_DIR, `${id}.json`);
  if (!existsSync(filepath)) return null;
  return JSON.parse(readFileSync(filepath, "utf-8"));
}

export function listKOs(): KnowledgeObject[] {
  if (!existsSync(KB_DIR)) return [];
  const { readdirSync } = require("fs");
  return readdirSync(KB_DIR)
    .filter((f: string) => f.endsWith(".json"))
    .map((f: string) => {
      try {
        return JSON.parse(readFileSync(join(KB_DIR, f), "utf-8"));
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}
