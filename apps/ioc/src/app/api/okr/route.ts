import { NextResponse } from "next/server";
import {
  createObjective,
  listObjectives,
  getObjective,
  updateObjectiveStatus,
  addKeyResult,
  updateKeyResult,
  getOKRSummary,
} from "@/okr/engine";
import type { ObjectiveStatus, DepartmentType } from "@/lib/types";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  switch (action) {
    case "list": {
      const quarter = searchParams.get("quarter") || undefined;
      const department = searchParams.get("department") as
        DepartmentType | undefined;
      const status = searchParams.get("status") as ObjectiveStatus | undefined;
      const objectives = listObjectives({ quarter, department, status });
      return NextResponse.json({ objectives });
    }
    case "get": {
      const id = searchParams.get("id");
      if (!id)
        return NextResponse.json({ error: "id required" }, { status: 400 });
      const objective = getObjective(id);
      if (!objective)
        return NextResponse.json({ error: "not found" }, { status: 404 });
      return NextResponse.json({ objective });
    }
    case "summary": {
      const summary = getOKRSummary();
      return NextResponse.json({ summary });
    }
    default: {
      const objectives = listObjectives({ limit: 20 });
      return NextResponse.json({ objectives });
    }
  }
});

export const POST = withAuth(async (request, _user) => {
  const body = await request.json();
  const { action } = body;

  switch (action) {
    case "create": {
      const { title, description, department, quarter } = body;
      if (!title || !quarter)
        return NextResponse.json(
          { error: "title and quarter required" },
          { status: 400 },
        );
      const objective = createObjective({
        title,
        description,
        department,
        quarter,
      });
      return NextResponse.json({ objective }, { status: 201 });
    }
    case "update-status": {
      const { objectiveId, status, progress } = body;
      if (!objectiveId || !status)
        return NextResponse.json(
          { error: "objectiveId and status required" },
          { status: 400 },
        );
      const objective = updateObjectiveStatus(
        objectiveId,
        status,
        progress || 0,
      );
      return NextResponse.json({ objective });
    }
    case "add-key-result": {
      const { objectiveId, title, description, metric, targetValue, unit } =
        body;
      if (!objectiveId || !title || !metric || !targetValue)
        return NextResponse.json(
          { error: "objectiveId, title, metric, targetValue required" },
          { status: 400 },
        );
      const kr = addKeyResult(objectiveId, {
        title,
        description,
        metric,
        targetValue,
        unit,
      });
      return NextResponse.json({ keyResult: kr }, { status: 201 });
    }
    case "update-key-result": {
      const { objectiveId, krId, currentValue } = body;
      if (!objectiveId || !krId || currentValue === undefined)
        return NextResponse.json(
          { error: "objectiveId, krId, currentValue required" },
          { status: 400 },
        );
      updateKeyResult(objectiveId, krId, currentValue);
      return NextResponse.json({ success: true });
    }
    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }
});
