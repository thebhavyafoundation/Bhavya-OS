import { NextResponse } from "next/server";
import {
  createActionItem,
  listActionItems,
  updateActionStatus,
  completeAction,
  getActionSummary,
} from "@/lib/actions";
import type { ActionPriority, ActionStatus } from "@/lib/types";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  switch (action) {
    case "summary": {
      return NextResponse.json({ summary: getActionSummary() });
    }
    default: {
      const status = searchParams.get("status") as ActionStatus | undefined;
      const priority = searchParams.get("priority") as
        ActionPriority | undefined;
      const items = listActionItems({ status, priority });
      return NextResponse.json({ items });
    }
  }
});

export const POST = withAuth(async (request, _user) => {
  const body = await request.json();
  const { action } = body;

  switch (action) {
    case "create": {
      const {
        title,
        description,
        type,
        priority,
        owner,
        dueDate,
        linkedRiskId,
        linkedObjectiveId,
      } = body;
      if (!title || !type)
        return NextResponse.json(
          { error: "title and type required" },
          { status: 400 },
        );
      const item = createActionItem({
        title,
        description,
        type,
        priority,
        owner,
        dueDate,
        linkedRiskId,
        linkedObjectiveId,
      });
      return NextResponse.json({ item }, { status: 201 });
    }
    case "update-status": {
      const { itemId, status } = body;
      if (!itemId || !status)
        return NextResponse.json(
          { error: "itemId and status required" },
          { status: 400 },
        );
      const item = updateActionStatus(itemId, status);
      return NextResponse.json({ item });
    }
    case "complete": {
      const { itemId, result } = body;
      if (!itemId)
        return NextResponse.json({ error: "itemId required" }, { status: 400 });
      const item = completeAction(itemId, result);
      return NextResponse.json({ item });
    }
    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }
});
