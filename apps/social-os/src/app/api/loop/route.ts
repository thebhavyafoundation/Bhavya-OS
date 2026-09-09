import { NextRequest, NextResponse } from "next/server";
import {
  runCommunicationLoop,
  processEvents,
  getCommunicationLoopStatus,
} from "@/campaign/communication-loop.js";
import type { CommunicationChannel } from "@/lib/types.js";
import { withAuth } from "@/lib/api-auth";

export const POST = withAuth(async (request, _user) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
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
});

export const GET = withAuth(async (_request, _user) => {
  const status = getCommunicationLoopStatus();
  return NextResponse.json({ status });
});
