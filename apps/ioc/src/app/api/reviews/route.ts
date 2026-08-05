import { NextRequest, NextResponse } from 'next/server';
import { generateWeeklyReview, getWeeklyReviews, getLatestReview } from '@/reviews/weekly';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  switch (action) {
    case 'latest': {
      const review = getLatestReview();
      return NextResponse.json({ review });
    }
    case 'list': {
      const limit = parseInt(searchParams.get('limit') || '10');
      const reviews = getWeeklyReviews(limit);
      return NextResponse.json({ reviews });
    }
    default: {
      const reviews = getWeeklyReviews(5);
      return NextResponse.json({ reviews });
    }
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  switch (action) {
    case 'generate': {
      const review = generateWeeklyReview();
      return NextResponse.json({ review }, { status: 201 });
    }
    default:
      return NextResponse.json({ error: 'unknown action' }, { status: 400 });
  }
}
