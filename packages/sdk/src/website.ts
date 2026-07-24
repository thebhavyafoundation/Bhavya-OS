import { NavigationService, ContentService, AuditLogger, type NavItem } from "@bhavya/mission-runtime";

export interface PageData {
  title: string;
  description: string;
  slug: string;
  hero?: string;
  sections: { type: string; content: unknown }[];
}

export class WebsiteSDK {
  navigation: NavigationService;
  content: ContentService;
  audit: AuditLogger;

  constructor() {
    this.navigation = new NavigationService();
    this.content = new ContentService();
    this.audit = new AuditLogger();
  }

  getNavItems(): NavItem[] {
    return this.navigation.getPublic();
  }

  isNavActive(href: string, currentPath: string): boolean {
    return this.navigation.isActive(href, currentPath);
  }

  async getPage(slug: string): Promise<PageData | null> {
    const entry = await this.content.getBySlug("page", slug);
    if (!entry) return null;
    return entry.metadata as unknown as PageData;
  }

  logFormSubmission(formName: string, fields: Record<string, string>): void {
    this.audit.log("website:volunteer", "form.submit", `form:${formName}`, `Submitted ${formName} form`, fields);
  }

  getVersion(): string {
    return "0.6.0";
  }
}
