import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { requireAdminAuth } from "@/lib/auth";

const ROOT = process.env.PROJECT_ROOT || join(process.cwd(), "..", "..");

function readJson(path: string): unknown {
  try {
    return JSON.parse(readFileSync(join(ROOT, path), "utf-8"));
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (auth.error) return auth.error;

  const type = req.nextUrl.searchParams.get("type");

  if (!type) {
    return NextResponse.json({ error: "type parameter required" }, { status: 400 });
  }

  let data: unknown = null;

  switch (type) {
    case "apps":
      data = readJson("registry/apps.json");
      break;
    case "packages":
      data = readJson("registry/packages.json");
      break;
    case "content": {
      const domains = ["governance", "financials", "projects", "releases", "policies", "pages"];
      const items: { id: string; title: string; domain: string }[] = [];
      for (const domain of domains) {
        try {
          const content = readJson(`content/${domain}/index.json`) as { items?: { id: string; title: string }[] };
          if (content?.items) {
            items.push(...content.items.map((item) => ({ ...item, domain })));
          }
        } catch {
          // skip
        }
      }
      data = items;
      break;
    }
    case "standards":
      data = readJson("registry/standards.json");
      break;
    case "knowledge-graph":
      data = readJson("registry/knowledge-graph.json");
      break;
    default:
      return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 });
  }

  return NextResponse.json({ type, data });
}
