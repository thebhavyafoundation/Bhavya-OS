import { NextRequest, NextResponse } from "next/server";
import { SearchEngine } from "../../../../../packages/bee/src/engines/search-engine.mjs";
import { KnowledgePackage } from "../../../../../packages/bee/src/knowledge-package.mjs";

const searchEngine = new SearchEngine();

// Index all packages on first request
let indexed = false;
function ensureIndexed() {
  if (indexed) return;
  const packages = KnowledgePackage.list();
  packages.forEach((pkg) => searchEngine.indexPackage(pkg));
  indexed = true;
}

export async function GET(request: NextRequest) {
  try {
    ensureIndexed();
    const q = request.nextUrl.searchParams.get("q") || "";
    const domain = request.nextUrl.searchParams.get("domain") || "";
    const capability = request.nextUrl.searchParams.get("capability") || "";

    let results;
    if (capability) {
      results = searchEngine.searchByCapability(capability);
    } else if (domain) {
      results = searchEngine.searchByDomain(domain);
    } else if (q) {
      results = searchEngine.search(q, { limit: 20 });
    } else {
      results = [];
    }

    return NextResponse.json({ results, query: q, total: results.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
