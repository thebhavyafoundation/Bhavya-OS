// ═══════════════════════════════════════════════════
// BAR Generated Navigation Map
// Generated: 2026-08-03T01:01:46.227Z
// ═══════════════════════════════════════════════════

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavItem[];
}

export const NAVIGATION: NavItem[] = [
  {
    id: "knowledge",
    label: "Knowledge",
    path: "/knowledge",
    children: [
      {
        id: "UI-KP-001",
        label: "Knowledge Explorer",
        path: "/knowledge/knowledge-explorer",
      },
      {
        id: "UI-KP-002",
        label: "Search Results",
        path: "/knowledge/search-results",
      },
      {
        id: "UI-KP-003",
        label: "KO Detail View",
        path: "/knowledge/ko-detail-view",
      },
      {
        id: "UI-KP-004",
        label: "Knowledge Collections",
        path: "/knowledge/knowledge-collections",
      },
      {
        id: "UI-LAB-001",
        label: "Knowledge Browser",
        path: "/knowledge/knowledge-browser",
      },
      { id: "UI-LAB-002", label: "KO Editor", path: "/knowledge/ko-editor" },
      {
        id: "UI-LAB-007",
        label: "Provenance Timeline",
        path: "/knowledge/provenance-timeline",
      },
    ],
  },
  {
    id: "education",
    label: "Education",
    path: "/education",
    children: [
      {
        id: "UI-LAB-003",
        label: "Lesson Builder",
        path: "/education/lesson-builder",
      },
      {
        id: "UI-LAB-004",
        label: "Assessment Builder",
        path: "/education/assessment-builder",
      },
      {
        id: "UI-LS-001",
        label: "Lesson Editor",
        path: "/education/lesson-editor",
      },
      {
        id: "UI-LS-002",
        label: "Assessment Editor",
        path: "/education/assessment-editor",
      },
      {
        id: "UI-LS-003",
        label: "Teacher Guide View",
        path: "/education/teacher-guide-view",
      },
      {
        id: "UI-LS-004",
        label: "Workbook View",
        path: "/education/workbook-view",
      },
      {
        id: "UI-LS-005",
        label: "Preview Pane",
        path: "/education/preview-pane",
      },
      {
        id: "UI-LS-006",
        label: "Publish Workflow",
        path: "/education/publish-workflow",
      },
    ],
  },
  {
    id: "media",
    label: "Media",
    path: "/media",
    children: [
      {
        id: "UI-LAB-008",
        label: "Video Preview",
        path: "/media/video-preview",
      },
      {
        id: "UI-LAB-009",
        label: "Website Preview",
        path: "/media/website-preview",
      },
      {
        id: "UI-LAB-010",
        label: "Visual Spec Editor",
        path: "/media/visual-spec-editor",
      },
    ],
  },
  {
    id: "admin",
    label: "Administration",
    path: "/admin",
    children: [
      {
        id: "UI-ADM-001",
        label: "Student Management",
        path: "/admin/student-management",
      },
      {
        id: "UI-ADM-002",
        label: "Staff Management",
        path: "/admin/staff-management",
      },
      {
        id: "UI-ADM-003",
        label: "Attendance Dashboard",
        path: "/admin/attendance-dashboard",
      },
      {
        id: "UI-ADM-004",
        label: "Event Calendar",
        path: "/admin/event-calendar",
      },
      {
        id: "UI-ADM-005",
        label: "Document Manager",
        path: "/admin/document-manager",
      },
      {
        id: "UI-ADM-006",
        label: "Report Generator",
        path: "/admin/report-generator",
      },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    path: "/finance",
    children: [
      {
        id: "UI-FIN-001",
        label: "Budget Overview",
        path: "/finance/budget-overview",
      },
      {
        id: "UI-FIN-002",
        label: "Expense Tracker",
        path: "/finance/expense-tracker",
      },
      {
        id: "UI-FIN-003",
        label: "Invoice Manager",
        path: "/finance/invoice-manager",
      },
      {
        id: "UI-FIN-004",
        label: "Payroll View",
        path: "/finance/payroll-view",
      },
      {
        id: "UI-FIN-005",
        label: "Financial Reports",
        path: "/finance/financial-reports",
      },
      {
        id: "UI-FIN-006",
        label: "Grant Tracker",
        path: "/finance/grant-tracker",
      },
      {
        id: "UI-TRN-003",
        label: "Financial Disclosure",
        path: "/finance/financial-disclosure",
      },
    ],
  },
  {
    id: "community",
    label: "Community",
    path: "/community",
    children: [
      {
        id: "UI-CMT-001",
        label: "Community Feed",
        path: "/community/community-feed",
      },
      {
        id: "UI-CMT-002",
        label: "Events Board",
        path: "/community/events-board",
      },
      {
        id: "UI-CMT-003",
        label: "Mentorship Hub",
        path: "/community/mentorship-hub",
      },
      {
        id: "UI-CMT-004",
        label: "Showcase Gallery",
        path: "/community/showcase-gallery",
      },
      {
        id: "UI-CMT-005",
        label: "Feedback Portal",
        path: "/community/feedback-portal",
      },
    ],
  },
  {
    id: "engineering",
    label: "Engineering",
    path: "/engineering",
    children: [
      {
        id: "UI-API-001",
        label: "API Explorer",
        path: "/engineering/api-explorer",
      },
      {
        id: "UI-API-002",
        label: "Schema Viewer",
        path: "/engineering/schema-viewer",
      },
      {
        id: "UI-DASH-004",
        label: "Deployment Status",
        path: "/engineering/deployment-status",
      },
      {
        id: "UI-DOC-001",
        label: "API Reference",
        path: "/engineering/api-reference",
      },
      {
        id: "UI-DOC-002",
        label: "Architecture Docs",
        path: "/engineering/architecture-docs",
      },
      {
        id: "UI-DOC-003",
        label: "User Guides",
        path: "/engineering/user-guides",
      },
      {
        id: "UI-LAB-005",
        label: "Pipeline Monitor",
        path: "/engineering/pipeline-monitor",
      },
      {
        id: "UI-LAB-006",
        label: "Quality Gates View",
        path: "/engineering/quality-gates-view",
      },
    ],
  },
  {
    id: "compliance",
    label: "Compliance",
    path: "/compliance",
    children: [
      {
        id: "UI-CMP-001",
        label: "Compliance Overview",
        path: "/compliance/compliance-overview",
      },
      {
        id: "UI-CMP-002",
        label: "Audit Trail Viewer",
        path: "/compliance/audit-trail-viewer",
      },
      {
        id: "UI-CMP-003",
        label: "Violation Tracker",
        path: "/compliance/violation-tracker",
      },
      {
        id: "UI-CMP-004",
        label: "Policy Manager",
        path: "/compliance/policy-manager",
      },
      {
        id: "UI-TRN-001",
        label: "Public Reports",
        path: "/compliance/public-reports",
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    path: "/analytics",
    children: [
      {
        id: "UI-DASH-001",
        label: "Analytics Dashboard",
        path: "/analytics/analytics-dashboard",
      },
      {
        id: "UI-DASH-002",
        label: "Real-time Metrics",
        path: "/analytics/real-time-metrics",
      },
    ],
  },
  {
    id: "design",
    label: "Design System",
    path: "/design",
    children: [
      {
        id: "UI-DS-001",
        label: "Component Library",
        path: "/design/component-library",
      },
      {
        id: "UI-DS-002",
        label: "Token Reference",
        path: "/design/token-reference",
      },
      {
        id: "UI-DS-003",
        label: "Pattern Gallery",
        path: "/design/pattern-gallery",
      },
    ],
  },
];

export function findNavItem(items: NavItem[], id: string): NavItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findNavItem(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function getBreadcrumb(id: string): string[] {
  const parts: string[] = [];
  function search(items: NavItem[], path: string[]): boolean {
    for (const item of items) {
      const currentPath = [...path, item.label];
      if (item.id === id) {
        parts.push(...currentPath);
        return true;
      }
      if (item.children && search(item.children, currentPath)) return true;
    }
    return false;
  }
  search(NAVIGATION, []);
  return parts;
}
