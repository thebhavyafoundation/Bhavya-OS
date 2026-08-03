import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createPackage,
  updatePackage,
  createArtifact,
  createExecution,
  updateExecution,
  getKO,
} from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const { koId, goal } = await req.json();
    if (!koId) {
      return NextResponse.json({ error: "koId required" }, { status: 400 });
    }

    const ko = getKO(koId);
    if (!ko) {
      return NextResponse.json({ error: "KO not found" }, { status: 404 });
    }

    const executionId = `exec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const packageId = `pkg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const goalText = goal || `Create educational package for: ${ko.title}`;

    createExecution({
      id: executionId,
      goal: goalText,
      userId,
      koId,
      packageId,
    });
    createPackage({
      id: packageId,
      title: ko.title,
      koId,
      userId,
      description: ko.description || undefined,
      domain: ko.domain || undefined,
      subject: ko.subject || undefined,
      gradeLevel: ko.grade_level || undefined,
    });
    updateExecution(executionId, { status: "running" });

    const startTime = Date.now();
    const { join } = await import("path");
    const { existsSync } = await import("fs");
    const ROOT = join(process.cwd(), "..", "..");
    const builderDir = join(ROOT, "packages", "runtime", "builders");

    try {
      const lessonMod = await import(join(builderDir, "lesson.mjs"));
      const assessmentMod = await import(join(builderDir, "assessment.mjs"));
      const teacherMod = await import(join(builderDir, "teacher-guide.mjs"));
      const workbookMod = await import(join(builderDir, "workbook.mjs"));
      const visualMod = await import(join(builderDir, "visual-spec.mjs"));
      const videoMod = await import(join(builderDir, "video.mjs"));

      const koData = {
        id: ko.id,
        title: ko.title,
        domain: ko.domain,
        subject: ko.subject,
        gradeLevel: ko.grade_level,
        description: ko.description,
        concepts: ko.parsed.concepts,
        definitions: ko.parsed.definitions,
        examples: ko.parsed.examples,
        misconceptions: ko.parsed.misconceptions,
        exercises: ko.parsed.exercises,
      };

      const lessonResult = await lessonMod.execute({ knowledgeObject: koData });
      const lesson = lessonResult.output?.lesson || lessonResult.output;
      createArtifact({
        id: `art-lesson-${Date.now()}`,
        type: "lesson",
        data: lesson,
        capabilityId: "D03-C02",
        skillId: "SK-L1-001",
        agentId: "AG-EDU-001",
        koId,
        packageId,
      });

      const [assessmentResult, guideResult, workbookResult] = await Promise.all(
        [
          assessmentMod.execute({ lesson, knowledgeObject: koData }),
          teacherMod.execute({ lesson, knowledgeObject: koData }),
          workbookMod.execute({ lesson, knowledgeObject: koData }),
        ],
      );

      const assessment =
        assessmentResult.output?.assessment || assessmentResult.output;
      const teacherGuide =
        guideResult.output?.teacherGuide || guideResult.output;
      const workbook = workbookResult.output?.workbook || workbookResult.output;

      createArtifact({
        id: `art-assessment-${Date.now()}`,
        type: "assessment",
        data: assessment,
        capabilityId: "D03-C04",
        skillId: "SK-L1-002",
        agentId: "AG-EDU-001",
        koId,
        packageId,
      });
      createArtifact({
        id: `art-guide-${Date.now()}`,
        type: "teacher-guide",
        data: teacherGuide,
        capabilityId: "D03-C05",
        skillId: "SK-L1-003",
        agentId: "AG-EDU-002",
        koId,
        packageId,
      });
      createArtifact({
        id: `art-workbook-${Date.now()}`,
        type: "workbook",
        data: workbook,
        capabilityId: "D03-C01",
        skillId: "SK-L1-004",
        agentId: "AG-EDU-001",
        koId,
        packageId,
      });

      const visualResult = await visualMod.execute({ lesson });
      const visualSpec = visualResult.output?.visualSpec || visualResult.output;
      createArtifact({
        id: `art-visual-${Date.now()}`,
        type: "visual-spec",
        data: visualSpec,
        capabilityId: "D08-C01",
        skillId: "SK-L3-001",
        agentId: "AG-MEDIA-001",
        koId,
        packageId,
      });

      const videoResult = await videoMod.execute({ visualSpec, lesson });
      const video = videoResult.output?.video || videoResult.output;
      createArtifact({
        id: `art-video-${Date.now()}`,
        type: "video",
        data: video,
        capabilityId: "D08-C02",
        skillId: "SK-L3-002",
        agentId: "AG-MEDIA-001",
        koId,
        packageId,
      });

      updatePackage(packageId, {
        lesson,
        assessment,
        teacherGuide,
        workbook,
        visualSpec,
        video,
        status: "draft",
        publicationStatus: "draft",
      });

      const totalDuration = Date.now() - startTime;
      updateExecution(executionId, {
        status: "completed",
        completedAt: new Date().toISOString(),
        totalDurationMs: totalDuration,
        nodeResults: [
          { nodeId: "n-001", capabilityId: "D03-C02", status: "completed" },
          { nodeId: "n-002", capabilityId: "D03-C04", status: "completed" },
          { nodeId: "n-003", capabilityId: "D03-C05", status: "completed" },
          { nodeId: "n-004", capabilityId: "D03-C01", status: "completed" },
          { nodeId: "n-005", capabilityId: "D08-C01", status: "completed" },
          { nodeId: "n-006", capabilityId: "D08-C02", status: "completed" },
        ],
      });

      return NextResponse.json({
        success: true,
        executionId,
        packageId,
        status: "completed",
        totalDurationMs: totalDuration,
        artifacts: [
          "lesson",
          "assessment",
          "teacher-guide",
          "workbook",
          "visual-spec",
          "video",
        ],
      });
    } catch (err: any) {
      updateExecution(executionId, {
        status: "failed",
        completedAt: new Date().toISOString(),
        error: err.message,
      });
      throw err;
    }
  } catch (err: any) {
    console.error("Pipeline error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
