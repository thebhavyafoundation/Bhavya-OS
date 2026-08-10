/**
 * @bhavya/platform-ui — Barrel Export
 *
 * Re-exports all shared UI components for convenient single-import usage.
 */

// === Design Tokens ===
import "./styles/tokens.css";

// === Components ===
export { StatusBadge } from "./components/StatusBadge";
export type { BadgeVariant } from "./components/StatusBadge";

export { StatCard } from "./components/StatCard";

export { EmptyState } from "./components/EmptyState";

export { LoadingSpinner, LoadingSkeleton } from "./components/LoadingState";

export { ErrorState } from "./components/ErrorState";

export { Modal } from "./components/Modal";

export { SearchBar } from "./components/SearchBar";

export { Sidebar } from "./components/Sidebar";

export { PageLayout } from "./components/PageLayout";

export { Tabs } from "./components/Tabs";

export { DataTable } from "./components/DataTable";

export { Button } from "./components/Button";

export { Card } from "./components/Card";

export { Badge } from "./components/Badge";

export { Avatar } from "./components/Avatar";

export { Breadcrumb } from "./components/Breadcrumb";

export { Skeleton, CardSkeleton, ListSkeleton, TableSkeleton, TabSkeleton } from "./components/Skeleton";

export { Toast } from "./components/Toast";

export { AppLayout } from "./components/AppLayout";

export { AppSidebar } from "./components/AppSidebar";
export type { SidebarItem } from "./components/AppSidebar";

export { AppFooter } from "./components/AppFooter";
export type { FooterLink, FooterColumn } from "./components/AppFooter";

export { BhavyaNav } from "./components/BhavyaNav";
export type { NavItem, BhavyaNavUser, BhavyaNavProps } from "./components/BhavyaNav";
