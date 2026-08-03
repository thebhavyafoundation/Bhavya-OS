export type BrowserEngine =
  "playwright" | "browser-use" | "puppeteer" | "selenium";

export interface BrowserConfig {
  engine: BrowserEngine;
  headless: boolean;
  timeout: number;
  userAgent?: string;
  proxy?: string;
  viewport?: { width: number; height: number };
}

export interface ScrapeResult {
  url: string;
  title: string;
  content: string;
  html: string;
  links: Array<{ text: string; href: string }>;
  images: Array<{ src: string; alt: string }>;
  metadata: Record<string, string>;
  scrapedAt: string;
  duration: number;
}

export interface AutomationStep {
  action:
    | "navigate"
    | "click"
    | "type"
    | "wait"
    | "screenshot"
    | "extract"
    | "scroll";
  selector?: string;
  value?: string;
  timeout?: number;
}

export interface AutomationResult {
  steps: Array<{
    step: AutomationStep;
    success: boolean;
    result?: unknown;
    error?: string;
  }>;
  screenshots: string[];
  extractedData: Record<string, unknown>;
  duration: number;
}

export interface WebsiteCapability {
  url: string;
  canAutomate: boolean;
  loginSupport: boolean;
  humanApprovalRequired: boolean;
  captchaHandling: "none" | "manual" | "service";
  downloads: boolean;
  uploads: boolean;
  publishing: boolean;
  screenshots: boolean;
  extraction: boolean;
  notes: string;
}
