import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
} from "fs";
import { join } from "path";

const ROOT = join(process.cwd(), "..", "..");
const ARTIFACTS_DIR = join(
  ROOT,
  "bhavya-ai-lab",
  "knowledge-studio",
  "artifacts",
);
const PLANS_DIR = join(ROOT, "bar", "bee-state");

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

export interface Artifact {
  id: string;
  planId: string;
  type: string;
  nodeId: string;
  capabilityId: string;
  data: any;
  provenance: any;
  createdAt: string;
}

export function saveArtifact(artifact: Artifact): void {
  ensureDir(ARTIFACTS_DIR);
  const filename = `${artifact.id}.json`;
  writeFileSync(
    join(ARTIFACTS_DIR, filename),
    JSON.stringify(artifact, null, 2),
  );
}

export function getArtifact(id: string): Artifact | null {
  const filepath = join(ARTIFACTS_DIR, `${id}.json`);
  if (!existsSync(filepath)) return null;
  return JSON.parse(readFileSync(filepath, "utf-8"));
}

export function listArtifacts(planId?: string): Artifact[] {
  if (!existsSync(ARTIFACTS_DIR)) return [];
  const files = readdirSync(ARTIFACTS_DIR).filter((f) => f.endsWith(".json"));
  let artifacts = files
    .map((f) => {
      try {
        return JSON.parse(readFileSync(join(ARTIFACTS_DIR, f), "utf-8"));
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  if (planId) artifacts = artifacts.filter((a) => a.planId === planId);
  return artifacts;
}

export function getArtifactsByPlan(planId: string): Artifact[] {
  return listArtifacts(planId);
}

export interface PipelineResult {
  planId: string;
  goal: string;
  status: string;
  artifacts: Artifact[];
  startedAt: string;
  completedAt: string | null;
  totalDurationMs: number | null;
  nodeResults: {
    nodeId: string;
    capabilityId: string;
    status: string;
    artifactId?: string;
    error?: string;
  }[];
}

export function savePipelineResult(result: PipelineResult): void {
  ensureDir(join(ROOT, "bhavya-ai-lab", "knowledge-studio", "pipelines"));
  const filename = `${result.planId}.json`;
  const dir = join(ROOT, "bhavya-ai-lab", "knowledge-studio", "pipelines");
  writeFileSync(join(dir, filename), JSON.stringify(result, null, 2));
}

export function getPipelineResult(planId: string): PipelineResult | null {
  const filepath = join(
    ROOT,
    "bhavya-ai-lab",
    "knowledge-studio",
    "pipelines",
    `${planId}.json`,
  );
  if (!existsSync(filepath)) return null;
  return JSON.parse(readFileSync(filepath, "utf-8"));
}

export function listPipelineResults(): PipelineResult[] {
  const dir = join(ROOT, "bhavya-ai-lab", "knowledge-studio", "pipelines");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        return JSON.parse(readFileSync(join(dir, f), "utf-8"));
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}
