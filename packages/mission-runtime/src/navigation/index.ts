import fs from "fs";
import path from "path";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  children?: NavItem[];
  icon?: string;
  visibility?: "public" | "internal";
}

export interface NavigationStructure {
  id: string;
  items: NavItem[];
}

export class NavigationService {
  private navs: Map<string, NavigationStructure> = new Map();

  constructor(navigationDir?: string) {
    const navDir = navigationDir ?? path.resolve(process.cwd(), "../../navigation");
    if (fs.existsSync(navDir)) {
      const files = fs.readdirSync(navDir).filter(f => f.endsWith(".json"));
      for (const file of files) {
        try {
          const data = JSON.parse(fs.readFileSync(path.join(navDir, file), "utf8"));
          this.navs.set(file.replace(".json", ""), { id: file.replace(".json", ""), items: data.items || [] });
        } catch (e) {
          console.error(`NavigationService: failed to load ${file}`, e);
        }
      }
    }
  }

  register(id: string, structure: NavigationStructure): void {
    this.navs.set(id, structure);
  }

  get(id: string): NavigationStructure | null {
    return this.navs.get(id) ?? null;
  }

  getPublic(): NavItem[] {
    const items: NavItem[] = [];
    for (const nav of this.navs.values()) {
      items.push(...nav.items.filter(i => i.visibility !== "internal"));
    }
    return items;
  }

  isActive(href: string, currentPath: string): boolean {
    return currentPath === href;
  }
}
