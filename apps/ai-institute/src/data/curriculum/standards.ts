import type { Standards } from "./types";
import { getAllModules } from "./index";

const BAND_STAGE: Record<string, 1 | 2 | 3 | 4> = {
  "6-8": 1,
  "9-11": 2,
  "12-15": 4,
  advanced: 4,
};

function cnDimForModule(
  moduleId: string,
  title: string,
): "认知" | "技能" | "思维" | "价值观" {
  const t = title.toLowerCase();
  if (
    t.includes("ethic") ||
    t.includes("fair") ||
    t.includes("bias") ||
    t.includes("citizen") ||
    t.includes("rule") ||
    t.includes("society") ||
    t.includes("impact") ||
    t.includes("governance") ||
    t.includes("responsib")
  ) {
    return "价值观";
  }
  if (
    t.includes("build") ||
    t.includes("make") ||
    t.includes("project") ||
    t.includes("lab") ||
    t.includes("code") ||
    t.includes("program") ||
    t.includes("deploy") ||
    t.includes("engineer")
  ) {
    return "技能";
  }
  if (
    t.includes("data") ||
    t.includes("model") ||
    t.includes("reason") ||
    t.includes("analy") ||
    t.includes("clust") ||
    t.includes("pattern") ||
    t.includes("predict") ||
    t.includes("feature")
  ) {
    return "思维";
  }
  return "认知";
}

function bigIdeasForModule(
  moduleId: string,
  title: string,
): ("BI1" | "BI2" | "BI3" | "BI4" | "BI5")[] {
  const t = title.toLowerCase();
  const ideas: ("BI1" | "BI2" | "BI3" | "BI4" | "BI5")[] = [];
  if (
    t.includes("percept") ||
    t.includes("sensor") ||
    t.includes("see") ||
    t.includes("hear") ||
    t.includes("vision") ||
    t.includes("speech")
  ) {
    ideas.push("BI1");
  }
  if (
    t.includes("data") ||
    t.includes("model") ||
    t.includes("reason") ||
    t.includes("learn") ||
    t.includes("train") ||
    t.includes("algorithm") ||
    t.includes("representation")
  ) {
    ideas.push("BI2", "BI3");
  }
  if (
    t.includes("interact") ||
    t.includes("chat") ||
    t.includes("talk") ||
    t.includes("language") ||
    t.includes("nlp") ||
    t.includes("conversat")
  ) {
    ideas.push("BI4");
  }
  if (
    t.includes("ethic") ||
    t.includes("fair") ||
    t.includes("bias") ||
    t.includes("society") ||
    t.includes("impact") ||
    t.includes("responsib") ||
    t.includes("governance") ||
    t.includes("citizen") ||
    t.includes("safety")
  ) {
    ideas.push("BI5");
  }
  if (ideas.length === 0) ideas.push("BI1");
  return [...new Set(ideas)];
}

function cstaForModule(moduleId: string, title: string): string[] | undefined {
  const t = title.toLowerCase();
  const codes: string[] = [];

  // 2-AP-10: Use flowcharts and/or pseudocode to address complex problems
  // 2-AP-13: Decompose problems into smaller subproblems
  // 2-AP-17: Systematically test and refine programs
  // 3A-AP-08: Use lists/arrays/collections to solve problems
  // 3A-AP-13: Create prototypes that use algorithms
  // 3A-IC-25: Evaluate computational artifacts for their impacts
  // 3A-DA-11: Create interactive data visualizations
  // 3B-AP-09: Implement AI algorithms
  // 3B-IC-25: Evaluate AI systems for bias

  if (t.includes("algorithm") || t.includes("code") || t.includes("program")) {
    codes.push("2-AP-13", "2-AP-17");
  }
  if (t.includes("data") || t.includes("visual")) {
    codes.push("3A-DA-11");
  }
  if (
    t.includes("model") ||
    t.includes("learn") ||
    t.includes("ai") ||
    t.includes("neural") ||
    t.includes("train")
  ) {
    codes.push("3B-AP-09");
  }
  if (
    t.includes("ethic") ||
    t.includes("fair") ||
    t.includes("bias") ||
    t.includes("impact")
  ) {
    codes.push("3A-IC-25", "3B-IC-25");
  }
  if (t.includes("prototype") || t.includes("project") || t.includes("build")) {
    codes.push("3A-AP-13");
  }
  if (t.includes("array") || t.includes("list") || t.includes("collection")) {
    codes.push("3A-AP-08");
  }
  if (t.includes("flowchart") || t.includes("pseudocode")) {
    codes.push("2-AP-10");
  }

  return [...new Set(codes)].length > 0 ? [...new Set(codes)] : undefined;
}

const STANDARDS_RECORD: Record<string, Standards> = {};

for (const m of getAllModules()) {
  const stage = BAND_STAGE[m.ageBand] || 4;
  const dim = cnDimForModule(m.id, m.title);
  const bigIdeas = bigIdeasForModule(m.id, m.title);
  const csta = cstaForModule(m.id, m.title);

  STANDARDS_RECORD[m.id] = {
    bigIdeas,
    csta,
    cnDim: dim,
    cnStage: stage,
  };
}

export function getStandards(moduleId: string): Standards {
  const s = STANDARDS_RECORD[moduleId];
  if (!s) throw new Error(`Missing standards for module: ${moduleId}`);
  return s;
}
