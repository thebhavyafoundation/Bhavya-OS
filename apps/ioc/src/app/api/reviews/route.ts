import { NextResponse } from "next/server";
import {
  generateWeeklyReview,
  getWeeklyReviews,
  getLatestReview,
} from "@/reviews/weekly";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  switch (action) {
    case "latest": {
      const review = getLatestReview();
      return NextResponse.json({ review });
    }
    case "list": {
      const limit = Math.min(Number(searchParams.get("limit")) || 10, 1000);
      const reviews = getWeeklyReviews(limit);
      return NextResponse.json({ reviews });
    }
    default: {
      const reviews = getWeeklyReviews(5);
      return NextResponse.json({ reviews });
    }
  }
});

export const POST = withAuth(async (request, _user) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { action } = body;

  switch (action) {
    case "generate": {
      const review = generateWeeklyReview();
      return NextResponse.json({ review }, { status: 201 });
    }
    default:
      return NextResponse.json({ error: "unknown action" }, { status: 400 });
  }
});
