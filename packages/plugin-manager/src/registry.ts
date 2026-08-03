import type { Plugin, PluginRecommendation, PluginPlatform } from "./types.js";

export class PluginRegistry {
  private plugins = new Map<string, Plugin>();

  add(plugin: Plugin): void {
    this.plugins.set(plugin.id, plugin);
  }

  get(id: string): Plugin | undefined {
    return this.plugins.get(id);
  }

  list(filters?: { platform?: PluginPlatform; minScore?: number }): Plugin[] {
    let results = Array.from(this.plugins.values());
    if (filters?.platform)
      results = results.filter((p) => p.platform === filters.platform);
    if (filters?.minScore !== undefined)
      results = results.filter((p) => p.bhavyaScore >= filters.minScore!);
    return results.sort((a, b) => b.bhavyaScore - a.bhavyaScore);
  }

  recommend(plugin: Plugin): PluginRecommendation {
    let level: PluginRecommendation["level"] = "monitor";
    if (plugin.bhavyaScore >= 80) level = "install";
    else if (plugin.bhavyaScore >= 60) level = "pilot";
    else if (plugin.bhavyaScore >= 40) level = "study";

    return {
      plugin,
      level,
      reasoning: `Score: ${plugin.bhavyaScore}/100. Installs: ${plugin.installs.toLocaleString()}. Rating: ${plugin.rating}/5.`,
      useCases: plugin.categories,
    };
  }
}
