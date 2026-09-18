import { NextResponse } from "next/server";
import {
  sourceBPacks,
  SOURCE_B_PROVIDER,
  SOURCE_B_LICENSE,
} from "@/data/source-b-registry.generated";

/**
 * GET /api/library/items
 *
 * Serves catalog metadata ONLY. Source B entries are references
 * (slug/title/strand/counts + attribution) — no lesson bodies.
 */
export async function GET() {
  const items = sourceBPacks.map((pack) => ({
    id: `source-b:${pack.slug}`,
    title: pack.title,
    type: "external-resource",
    description: `${pack.files} files · ${pack.words.toLocaleString("en-US")} words · ${pack.strand}`,
    source: "external" as const,
    provider: SOURCE_B_PROVIDER,
    license: SOURCE_B_LICENSE,
    packSlug: pack.slug,
    strand: pack.strand,
    ageBand: pack.ageBand ?? null,
  }));
  return NextResponse.json(items);
}
