import { NextRequest, NextResponse } from "next/server";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { requireAuth } from "@/lib/api-auth";
import { roleIsAllowed, type Role } from "@/lib/roles";

const ROOT =
  process.env.PROJECT_ROOT || join(process.cwd(), "..", "..", "..", "..");

function readJson(path: string): unknown {
  try {
    return JSON.parse(readFileSync(join(ROOT, path), "utf-8"));
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }
  if (!roleIsAllowed(user.role as Role, ["admin"])) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 },
    );
  }

  const type = req.nextUrl.searchParams.get("type");

  if (!type) {
    return NextResponse.json(
      { error: "type parameter required" },
      { status: 400 },
    );
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
      const domains = [
        "governance",
        "financials",
        "projects",
        "releases",
        "policies",
        "pages",
      ];
      const items: { id: string; title: string; domain: string }[] = [];
      for (const domain of domains) {
        try {
          const content = readJson(`content/${domain}/index.json`) as {
            items?: { id: string; title: string }[];
          };
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
    case "releases": {
      // Real release history: docs/releases/*.md (tag from filename,
      // title from first heading). No dates are fabricated: filenames
      // carry no date, so none is reported.
      let files: string[] = [];
      try {
        files = readdirSync(join(ROOT, "docs/releases")).filter((f) =>
          f.endsWith(".md"),
        );
      } catch {
        files = [];
      }
      data = files
        .sort()
        .reverse()
        .map((file) => {
          const tag = file.replace(/\.md$/, "");
          let title = tag;
          try {
            const first = readFileSync(
              join(ROOT, "docs/releases", file),
              "utf-8",
            )
              .split("\n")
              .find((line) => line.startsWith("# "));
            if (first) title = first.replace(/^#\s+/, "").trim();
          } catch {
            // keep filename-derived title
          }
          const channel = /alpha/i.test(tag)
            ? "alpha"
            : /beta/i.test(tag)
              ? "beta"
              : /rc/i.test(tag)
                ? "rc"
                : "stable";
          return { id: tag, tag, title, channel };
        });
      break;
    }
    default:
      return NextResponse.json(
        { error: `Unknown type: ${type}` },
        { status: 400 },
      );
  }

  return NextResponse.json({ type, data });
}
