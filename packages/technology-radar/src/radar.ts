import type {
  RadarEntry,
  RadarQuadrant,
  RadarRing,
  RadarReport,
  LandscapeReport,
} from "./types.js";

export class TechnologyRadar {
  private entries = new Map<string, RadarEntry>();

  addEntry(entry: RadarEntry): void {
    this.entries.set(entry.id, entry);
  }
  getEntry(id: string): RadarEntry | undefined {
    return this.entries.get(id);
  }

  list(filters?: { quadrant?: RadarQuadrant; ring?: RadarRing }): RadarEntry[] {
    let results = Array.from(this.entries.values());
    if (filters?.quadrant)
      results = results.filter((e) => e.quadrant === filters.quadrant);
    if (filters?.ring) results = results.filter((e) => e.ring === filters.ring);
    return results;
  }

  moveEntry(id: string, newQuadrant: RadarQuadrant): void {
    const entry = this.entries.get(id);
    if (entry) {
      entry.changedFrom = entry.quadrant;
      entry.quadrant = newQuadrant;
      entry.movement = this.getMovement(entry.changedFrom, newQuadrant);
    }
  }

  generateReport(quarter: string, year: number): RadarReport {
    const entries = Array.from(this.entries.values());
    return {
      id: `radar-${year}-${quarter}`,
      quarter,
      year,
      entries,
      newEntries: entries.filter((e) => e.isNew),
      movedEntries: entries
        .filter((e) => e.changedFrom)
        .map((e) => ({ entry: e, from: e.changedFrom!, to: e.quadrant })),
      summary: `${entries.length} entries tracked`,
      generatedAt: new Date().toISOString(),
    };
  }

  generateLandscape(period: string): LandscapeReport {
    const categories = [
      "ai_frameworks",
      "mcp_servers",
      "developer_tools",
      "ui_systems",
      "education",
    ];
    return {
      id: `landscape-${period}`,
      period,
      categories: categories.map((name) => ({
        name,
        technologies: Array.from(this.entries.values())
          .filter((e) => e.category === name)
          .map((e) => ({
            name: e.name,
            status: this.qToStatus(e.quadrant),
            score: 0,
            change: e.movement === "up" ? 1 : e.movement === "down" ? -1 : 0,
          })),
      })),
      highlights: [],
      concerns: [],
      generatedAt: new Date().toISOString(),
    };
  }

  private getMovement(
    from: RadarQuadrant,
    to: RadarQuadrant,
  ): "up" | "down" | "stable" {
    const order = { adopt: 0, trial: 1, assess: 2, hold: 3 };
    return order[from] < order[to]
      ? "up"
      : order[from] > order[to]
        ? "down"
        : "stable";
  }

  private qToStatus(
    q: RadarQuadrant,
  ): "leader" | "challenger" | "contender" | "experimental" {
    if (q === "adopt") return "leader";
    if (q === "trial") return "challenger";
    if (q === "assess") return "contender";
    return "experimental";
  }
}
