import type {
  Source,
  SourceProvider,
  RawItem,
  FetchOpts,
} from "@bhavya/intelligence";

// ─── Base Crawler ──────────────────────────────────────────────────────────
// Every crawler follows this pattern. Adding a new source = implementing a
// provider, not modifying core logic.

export abstract class BaseCrawler implements SourceProvider {
  abstract readonly kind: Source["kind"];

  abstract fetch(opts: FetchOpts): Promise<RawItem[]>;
  abstract normalize(item: RawItem): RawItem;

  canFetch(source: Source): boolean {
    return source.enabled && source.kind === this.kind;
  }

  protected async fetchJson<T>(
    url: string,
    headers?: Record<string, string>,
  ): Promise<T> {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "BhavyaOS-OSIP/1.0",
        Accept: "application/json",
        ...headers,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${url}`);
    }
    return response.json() as Promise<T>;
  }

  protected paginate<T>(items: T[], limit: number, offset: number): T[] {
    return items.slice(offset, offset + limit);
  }
}

// ─── Crawler Registry ──────────────────────────────────────────────────────

const crawlers = new Map<string, SourceProvider>();

export function registerCrawler(crawler: SourceProvider): void {
  crawlers.set(crawler.kind, crawler);
}

export function getCrawler(kind: string): SourceProvider | undefined {
  return crawlers.get(kind);
}

export function getAllCrawlers(): SourceProvider[] {
  return Array.from(crawlers.values());
}
