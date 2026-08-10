import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  createKO,
  createPackage,
  createArtifact,
  createExecution,
} from "@/lib/db";
import { checkRateLimit, RateLimits } from "@/lib/rate-limit";
import { join } from "path";
import { writeFile, mkdirSync, existsSync } from "fs";

const UPLOAD_DIR = join(process.cwd(), "uploads");
if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ["pdf", "docx", "md", "markdown", "txt"];

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    // Rate limit uploads
    const { limited, remaining, resetAt } = checkRateLimit(
      `upload:${userId}`,
      RateLimits.upload,
    );
    if (limited) {
      return NextResponse.json(
        { error: "Too many upload attempts. Please try again later." },
        { status: 429 },
      );
    }

    const contentType = req.headers.get("content-type") || "";

    let title: string;
    let text: string;
    let domain: string;
    let subject: string;
    let gradeLevel: string;
    let sourceType: string;
    let sourceUrl: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      // File upload
      const formData = await req.formData();
      title = (formData.get("title") as string) || "Untitled";
      domain = (formData.get("domain") as string) || "academics";
      subject = (formData.get("subject") as string) || "";
      gradeLevel = (formData.get("gradeLevel") as string) || "";
      sourceUrl = (formData.get("sourceUrl") as string) || undefined;

      const file = formData.get("file") as File | null;
      if (file) {
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            {
              error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
            },
            { status: 400 },
          );
        }

        const ext = file.name.split(".").pop()?.toLowerCase() || "";

        // Validate file extension
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          return NextResponse.json(
            {
              error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`,
            },
            { status: 400 },
          );
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Save file with sanitized filename
        const safeName = sanitizeFilename(file.name);
        const filename = `${Date.now()}-${safeName}`;
        await writeFile(join(UPLOAD_DIR, filename), buffer);

        if (ext === "pdf") {
          const pdfParse = (await import("pdf-parse")).default;
          const pdfData = await pdfParse(buffer);
          text = pdfData.text;
          sourceType = "pdf";
        } else if (ext === "docx") {
          const mammoth = await import("mammoth");
          const result = await mammoth.extractRawText({ buffer });
          text = result.value;
          sourceType = "docx";
        } else if (ext === "md" || ext === "markdown") {
          text = buffer.toString("utf-8");
          sourceType = "markdown";
        } else {
          text = buffer.toString("utf-8");
          sourceType = "text";
        }
      } else {
        text = (formData.get("text") as string) || "";
        sourceType = "text";
      }
    } else {
      // JSON body
      const body = await req.json();
      title = body.title;
      text = body.text;
      domain = body.domain || "academics";
      subject = body.subject || "";
      gradeLevel = body.gradeLevel || "";
      sourceType = body.sourceType || "text";
      sourceUrl = body.sourceUrl;
    }

    if (!title || !text) {
      return NextResponse.json(
        { error: "title and text/file content required" },
        { status: 400 },
      );
    }

    // Extract knowledge from text
    const sentences = text
      .split(/[.!?]+/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 20);
    const concepts = sentences.slice(0, 8).map((s: string, i: number) => ({
      name: s.split(" ").slice(0, 5).join(" "),
      description: s,
      difficulty: i < 3 ? "beginner" : i < 6 ? "intermediate" : "advanced",
    }));

    const words = text
      .toLowerCase()
      .split(/\W+/)
      .filter((w: string) => w.length > 5);
    const freq = new Map<string, number>();
    for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
    const topTerms = [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    const definitions = topTerms.map(([term]) => ({
      term,
      definition: `Key concept: ${term} (extracted from source material)`,
    }));

    const exercises = sentences.slice(0, 5).map((s: string) => ({
      prompt: `Explain in your own words: ${s.split(" ").slice(0, 8).join(" ")}...`,
      type: "short-answer",
      difficulty: "intermediate",
    }));

    const koId = `ko-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Create KO in database
    const ko = createKO({
      id: koId,
      title,
      domain,
      subject: subject || undefined,
      gradeLevel: gradeLevel || undefined,
      description: text.slice(0, 200),
      sourceType,
      sourceContent: text,
      sourceUrl,
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
        sourceFileName: contentType.includes("multipart")
          ? "uploaded"
          : undefined,
      },
      userId,
    });

    return NextResponse.json({
      success: true,
      ko: {
        id: ko.id,
        title: ko.title,
        domain: ko.domain,
        subject: ko.subject,
        gradeLevel: ko.grade_level,
        status: ko.status,
        concepts: ko.parsed.concepts.length,
        definitions: ko.parsed.definitions.length,
        sourceType: ko.source_type,
        createdAt: ko.created_at,
      },
    });
  } catch (err: any) {
    console.error("Ingest error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
