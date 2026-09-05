/**
 * Public Mentor API
 *
 * Returns mentor agent data WITHOUT system prompts.
 * This is the public projection boundary for agent data.
 */

import { NextResponse } from "next/server";
import { agents } from "@/lib/agents";
import { projectMentorAgents } from "@/lib/public-projection";

export async function GET() {
  const publicAgents = projectMentorAgents(agents);
  return NextResponse.json({ agents: publicAgents });
}
