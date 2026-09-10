import { financials } from "../data/financials";
import { governance } from "../data/governance";
import { policies } from "../data/policies";
import { projects } from "../data/projects";
import { releases } from "../data/releases";

export interface ContentItem {
  id: string;
  title: string;
  [key: string]: unknown;
}

export interface ContentEnvelope<T = ContentItem> {
  data: T;
  lastUpdated: string;
  source: string;
}

const dataMap: Record<string, readonly ContentItem[]> = {
  financials: financials as unknown as readonly ContentItem[],
  governance: governance as unknown as readonly ContentItem[],
  policies: policies as unknown as readonly ContentItem[],
  projects: projects as unknown as readonly ContentItem[],
  releases: releases as unknown as readonly ContentItem[],
};

export function readContent<T = ContentItem>(domain: string, id: string): ContentEnvelope<T> | null {
  const items = dataMap[domain];
  if (!items) return null;
  const item = items.find(i => i.id === id);
  if (!item) return null;
  return { data: item as T, lastUpdated: "2026-09-01", source: `${domain}/${id}.json` };
}

export function readContentDir<T = ContentItem>(domain: string): (ContentEnvelope<T> & { data: T })[] {
  const items = dataMap[domain] ?? [];
  return items.map(item => ({
    data: item as T,
    lastUpdated: "2026-09-01",
    source: `${domain}/${item.id}.json`,
  }));
}
