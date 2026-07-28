import { NextResponse } from "next/server";
import { getCollections, getCollection } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const collection = getCollection(id);
    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }
    return NextResponse.json(collection);
  }

  const collections = getCollections();
  return NextResponse.json({
    total: collections.length,
    collections: collections.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      category: c.category,
      documentCount: c.documentIds.length,
    })),
  });
}
