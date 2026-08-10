import { NextResponse } from "next/server";
import { getDocuments } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const category = searchParams.get("category");

  let documents = getDocuments();

  if (category) {
    documents = documents.filter((d) => d.category === category);
  }

  if (query) {
    const q = query.toLowerCase();
    documents = documents.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  return NextResponse.json({
    total: documents.length,
    documents: documents.map((d) => ({
      id: d.id,
      title: d.title,
      category: d.category,
      summary: d.summary,
      tags: d.tags,
      status: d.status,
      links: d.links,
    })),
  });
}
