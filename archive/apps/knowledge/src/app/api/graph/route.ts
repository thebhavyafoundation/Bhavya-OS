import { NextRequest, NextResponse } from "next/server";
import {
  getGraphNodeById,
  getNodeNeighbors,
  findPath,
  getGraphStatistics,
} from "@bhavya/intelligence";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action") || "node";
  const id = searchParams.get("id");
  const targetId = searchParams.get("targetId");

  switch (action) {
    case "node":
      if (!id) {
        return NextResponse.json({
          success: false,
          error: "Missing required parameter 'id'",
        });
      }
      return NextResponse.json({
        success: true,
        data: getGraphNodeById(id),
      });

    case "neighbors":
      if (!id) {
        return NextResponse.json({
          success: false,
          error: "Missing required parameter 'id'",
        });
      }
      return NextResponse.json({
        success: true,
        data: getNodeNeighbors(id),
      });

    case "path":
      if (!id || !targetId) {
        return NextResponse.json({
          success: false,
          error: "Missing required parameters 'id' and 'targetId'",
        });
      }
      return NextResponse.json({
        success: true,
        data: findPath(id, targetId),
      });

    case "stats":
      return NextResponse.json({
        success: true,
        data: getGraphStatistics(),
      });

    default:
      return NextResponse.json({
        success: false,
        error: `Unknown action: ${action}`,
      });
  }
}
