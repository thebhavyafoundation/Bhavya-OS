/**
 * Knowledge Pipeline — Executes the full pipeline from a Knowledge Object
 * to all educational outputs: Lesson → Assessment → Guide → Workbook → Website
 *
 * Each stage calls the capability engine. The pipeline itself is not a builder;
 * it orchestrates multiple capability requests in sequence.
 */

import path from "path";
import { executeCapability, getExecutionStatus, writeProvenanceRecord } from "./capability-engine.mjs";
import { BHAVYA_LAB, writeJSON, ensureDir } from "./config.mjs";

export async function runKnowledgePipeline(ko, options = {}) {
  const stages = options.stages || ["lesson", "assessment", "guide", "workbook", "visual-spec", "video", "website"];
  const results = {};
  const pipelineId = `pipeline-${Date.now()}`;
  const startTime = Date.now();
  const RUNTIME_VERSION = "3.0.0";
  let artifactIds = [];

  // Merge KO fields to top level so quality gates can validate them.
  // The lesson builder extracts knowledgeObject internally.
  const context = {
    ...ko,
    knowledgeObject: ko,
    grade: options.grade || 9,
    duration: options.duration || 45,
    subject: ko.domain || options.subject || "General",
    _parentArtifactIds: [],
  };

  // Attempt to load existing provenance for this KO
  const { getProvenanceGraph } = await import("./capability-engine.mjs");
  const existingGraph = getProvenanceGraph(ko.id);

  // Stage 1: Lesson Generation
  if (stages.includes("lesson")) {
    const lessonResult = await executeCapability("lesson_generation", context);
    results.lesson = lessonResult;
    if (lessonResult.status === "completed" && lessonResult.builderResult?.output?.lesson) {
      context.lesson = lessonResult.builderResult.output.lesson;
      const provenance = lessonResult.builderResult.output.lesson._provenance;
      if (provenance) {
        artifactIds.push(provenance.artifactId);
        context._parentArtifactIds = [provenance.artifactId];
      }
    }
  }

  // Helper: extract provenance artifactId from a builder result and update parent chain
  function captureProvenance(result, stageName) {
    if (result?.builderResult?.output) {
      const key = Object.keys(result.builderResult.output)[0];
      const out = key ? result.builderResult.output[key] : null;
      if (out?._provenance?.artifactId) {
        const aid = out._provenance.artifactId;
        artifactIds.push(aid);
        context._parentArtifactIds = [aid];
        return aid;
      }
    }
    return null;
  }

  // Stage 2: Assessment (requires lesson)
  if (stages.includes("assessment") && context.lesson) {
    const assessResult = await executeCapability("quiz_generation", context);
    results.assessment = assessResult;
    captureProvenance(assessResult, "assessment");
    if (assessResult.status === "completed" && assessResult.builderResult?.output?.assessment) {
      context.assessment = assessResult.builderResult.output.assessment;
    }
  }

  // Stage 3: Teacher Guide (requires lesson)
  if (stages.includes("guide") && context.lesson) {
    const guideResult = await executeCapability("lesson_generation", { ...context, _builderHint: "teacher-guide" });
    results.teacherGuide = guideResult;
    captureProvenance(guideResult, "teacherGuide");
    if (guideResult.status === "completed" && guideResult.builderResult?.output?.teacherGuide) {
      context.teacherGuide = guideResult.builderResult.output.teacherGuide;
    }
  }

  // Stage 4: Workbook (requires lesson)
  if (stages.includes("workbook") && context.lesson) {
    const workbookResult = await executeCapability("lesson_generation", { ...context, _builderHint: "workbook" });
    results.workbook = workbookResult;
    captureProvenance(workbookResult, "workbook");
    if (workbookResult.status === "completed" && workbookResult.builderResult?.output?.workbook) {
      context.workbook = workbookResult.builderResult.output.workbook;
    }
  }

  // Stage 5: Visual Spec (requires lesson)
  if (stages.includes("visual-spec") && context.lesson) {
    const vsResult = await executeCapability("visual_spec_generation", context);
    results.visualSpec = vsResult;
    captureProvenance(vsResult, "visualSpec");
    if (vsResult.status === "completed" && vsResult.builderResult?.output?.visualSpec) {
      context.visualSpec = vsResult.builderResult.output.visualSpec;
    }
  }

  // Stage 6: Video / Animation (requires visual spec)
  if (stages.includes("video") && context.visualSpec) {
    const videoResult = await executeCapability("video_generation", context);
    results.video = videoResult;
    captureProvenance(videoResult, "video");
  }

  // Stage 7: Website / Publish (requires all previous)
  if (stages.includes("website") && context.lesson) {
    const websiteResult = await executeCapability("website_generation", context);
    results.website = websiteResult;
    captureProvenance(websiteResult, "website");
  }

  const duration = Date.now() - startTime;

  // Build Manifest
  const qualityGatesSummary = { passed: 0, failed: 0, warning: 0 };
  const artifacts = [];
  for (const [stage, result] of Object.entries(results)) {
    const r = result?.builderResult?.output;
    const key = r ? Object.keys(r)[0] : null;
    const out = key ? r[key] : null;
    const p = out?._provenance;
    if (p) {
      artifacts.push({ stage, artifactId: p.artifactId, builder: p.builder, status: p.qualityGate });
      if (p.qualityGate === "PASS") qualityGatesSummary.passed++;
      else if (p.qualityGate === "FAIL") qualityGatesSummary.failed++;
      else qualityGatesSummary.warning++;
    }
  }

  const buildManifest = {
    buildId: pipelineId,
    runtimeVersion: RUNTIME_VERSION,
    knowledgeObjectId: ko.id,
    knowledgeObjectTitle: ko.title,
    artifacts,
    qualityGates: qualityGatesSummary,
    durationMs: duration,
    completedAt: new Date().toISOString(),
  };

  // Write build manifest
  const manifestDir = path.join(BHAVYA_LAB, "institution", "manifests");
  try { writeJSON(path.join(manifestDir, `${pipelineId}.json`), buildManifest); } catch { /* manifest write is best-effort */ }

  return {
    pipelineId,
    stages: results,
    summary: Object.entries(results).map(([stage, result]) => ({
      stage,
      status: result.status,
      duration: result.steps?.reduce((s, step) => s + (step.duration || 0), 0) || 0,
    })),
    totalDuration: duration,
    completedAt: new Date().toISOString(),
    buildManifest,
  };
}

export async function getPipelineStatus(pipelineId) {
  // Pipeline IDs track by prefix; could store in a registry
  return { pipelineId, status: "completed" };
}

export async function stageStatus(stageName, executionId) {
  return getExecutionStatus(executionId);
}
