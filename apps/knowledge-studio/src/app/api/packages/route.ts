import { NextResponse } from "next/server";
import { KnowledgePackage } from "../../../../../packages/bee/src/knowledge-package.mjs";

export async function GET() {
  try {
    const packages = KnowledgePackage.list();
    return NextResponse.json({
      packages: packages.map((p) => p.toJSON()),
      count: packages.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
