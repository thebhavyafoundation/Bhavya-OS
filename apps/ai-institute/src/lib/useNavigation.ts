/**
 * Bhavya Foundation — Canonical Navigation Hook
 *
 * Single source of truth for all navigation rendering.
 * Reads from navigation-registry.json and computes:
 * - filtered items by role
 * - active state (prefix matching)
 * - breadcrumbs
 * - dropdown groups for public navigation
 */

"use client";

import { useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import type { Role } from "./roles";
import registry from "./navigation-registry.json";

export type NavLayer = "public" | "app" | "os";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  roles?: Role[];
  pillar?: string;
  description?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export interface OsSection {
  id: string;
  label: string;
  items: NavItem[];
}

export interface Breadcrumb {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

/**
 * Get navigation items for a given layer, filtered by user roles.
 * For public layer, returns flat items from the groups (for mobile/simple nav).
 */
export function getNavItems(layer: NavLayer, userRoles?: Role[]): NavItem[] {
  const layerConfig = registry.layers[layer];
  if (!layerConfig) return [];

  if (layer === "os") {
    // OS uses sections, flatten them
    const sections = (layerConfig as { sections?: OsSection[] }).sections || [];
    const allItems = sections.flatMap((s) => s.items);
    return filterByRoles(allItems, userRoles);
  }

  if (layer === "public") {
    // Public uses groups, flatten all items
    const groups = (layerConfig as { groups?: NavGroup[] }).groups || [];
    const allItems = groups.flatMap((g) => g.items);
    // Always include home
    const homeItem = (layerConfig as { items?: NavItem[] }).items || [];
    return [...homeItem, ...filterByRoles(allItems, userRoles)];
  }

  const items = (layerConfig as { items?: NavItem[] }).items || [];
  return filterByRoles(items, userRoles);
}

/**
 * Get navigation groups for public dropdown menus.
 */
export function getPublicNavGroups(): NavGroup[] {
  const layerConfig = registry.layers.public;
  if (!layerConfig) return [];
  return (layerConfig as { groups?: NavGroup[] }).groups || [];
}

/**
 * Get OS navigation sections, filtered by user roles.
 */
export function getOsSections(userRoles?: Role[]): OsSection[] {
  const osConfig = registry.layers.os as { sections?: OsSection[] };
  const sections = osConfig.sections || [];
  return sections.map((section) => ({
    ...section,
    items: filterByRoles(section.items, userRoles),
  }));
}

/**
 * Get footer columns from the registry.
 */
export function getFooterColumns(): FooterColumn[] {
  return registry.footer.columns;
}

/**
 * Filter items by user roles. Items without roles are shown to everyone.
 * Items with roles are shown only if the user has at least one matching role.
 */
function filterByRoles(items: NavItem[], userRoles?: Role[]): NavItem[] {
  if (!userRoles || userRoles.length === 0) {
    // No roles specified — show items that have no role restriction
    return items.filter((item) => !item.roles || item.roles.length === 0);
  }
  return items.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.some((role) => userRoles.includes(role));
  });
}

/**
 * Compute breadcrumbs from the current pathname.
 */
export function computeBreadcrumbs(pathname: string): Breadcrumb[] {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Breadcrumb[] = [];
  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    crumbs.push({ label, href: currentPath });
  }

  return crumbs;
}

/**
 * React hook for navigation in a given layer.
 */
export function useNavigation(layer: NavLayer, userRoles?: Role[]) {
  const pathname = usePathname();

  const items = useMemo(
    () => getNavItems(layer, userRoles),
    [layer, userRoles],
  );

  const groups = useMemo(
    () => (layer === "public" ? getPublicNavGroups() : []),
    [layer],
  );

  const osSections = useMemo(
    () => (layer === "os" ? getOsSections(userRoles) : []),
    [layer, userRoles],
  );

  const breadcrumbs = useMemo(() => computeBreadcrumbs(pathname), [pathname]);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname === href || pathname.startsWith(href + "/");
    },
    [pathname],
  );

  return { items, groups, osSections, breadcrumbs, isActive, pathname };
}
