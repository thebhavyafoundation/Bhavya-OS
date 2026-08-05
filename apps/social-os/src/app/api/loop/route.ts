import { NextRequest, NextResponse } from "next/server";
import {
  runCommunicationLoop,
  processEvents,
  getCommunicationLoopStatus,
} from "@/campaign/communication-loop.js";
import type { CommunicationChannel } from "@/lib/types.js";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  switch (action) {
    case "launch-kp": {
      const { knowledgePackageId, title, summary, domain, level, channels } =
        body;
      if (!knowledgePackageId || !title || !summary) {
        return NextResponse.json(
          { error: "knowledgePackageId, title, summary required" },
          { status: 400 },
        );
      }
      const result = runCommunicationLoop({
        knowledgePackageId,
        title,
        summary,
        domain: domain || "AI",
        level: level || 1,
        channels: channels as CommunicationChannel[],
      });
      return NextResponse.json({ result }, { status: 201 });
    }

    case "process-events": {
      const result = processEvents();
      return NextResponse.json({ result });
    }

    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }
}

export async function GET() {
  const status = getCommunicationLoopStatus();
  return NextResponse.json({ status });
}
