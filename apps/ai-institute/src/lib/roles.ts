/**
 * Bhavya Digital Institution — Role & Capability Engine
 *
 * One account, many roles. The application computes:
 * - permissions
 * - navigation
 * - home modules
 * - notifications
 * - recommendations
 * - available actions
 */

export type Role = "student" | "volunteer" | "donor" | "researcher" | "mentor" | "educator";

export interface Permission {
  id: string;
  action: string;
  resource: string;
  conditions?: Record<string, any>;
}

export interface RoleConfig {
  role: Role;
  label: string;
  description: string;
  permissions: Permission[];
  navItems: NavItem[];
  homeModules: HomeModule[];
  notifications: NotificationPref[];
}

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  requiresRole?: Role[];
}

export interface HomeModule {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
  priority: number;
  roles: Role[];
}

export interface NotificationPref {
  type: string;
  enabled: boolean;
  roles: Role[];
}

// ── Role Definitions ────────────────────────────────────────

export const ROLES: Record<Role, RoleConfig> = {
  student: {
    role: "student",
    label: "Student",
    description: "Learning and skill development",
    permissions: [
      { id: "courses:read", action: "read", resource: "courses" },
      { id: "courses:enroll", action: "enroll", resource: "courses" },
      { id: "lessons:complete", action: "complete", resource: "lessons" },
      { id: "assessments:submit", action: "submit", resource: "assessments" },
      { id: "credentials:view", action: "view", resource: "credentials" },
      { id: "community:post", action: "post", resource: "community" },
      { id: "knowledge:read", action: "read", resource: "knowledge" },
    ],
    navItems: [
      { href: "/app/learn", label: "Learn", icon: "BookOpen" },
      { href: "/app/community", label: "Community", icon: "Users" },
      { href: "/app/knowledge", label: "Knowledge", icon: "Compass" },
      { href: "/app/credentials", label: "Credentials", icon: "Award" },
      { href: "/app/contributions", label: "Contributions", icon: "Heart" },
    ],
    homeModules: [
      { id: "continue-learning", title: "Continue Learning", description: "Pick up where you left off.", href: "/app/learn", icon: "BookOpen", priority: 1, roles: ["student"] },
      { id: "upcoming-class", title: "Upcoming Class", description: "Next scheduled learning session.", href: "/app/learn", icon: "Calendar", priority: 2, roles: ["student"] },
      { id: "community", title: "Community", description: "Connect with peers and mentors.", href: "/app/community", icon: "Users", priority: 3, roles: ["student", "volunteer", "researcher", "mentor", "educator"] },
      { id: "credentials", title: "My Credentials", description: "View achievements and certifications.", href: "/app/credentials", icon: "Award", priority: 4, roles: ["student", "volunteer", "researcher"] },
    ],
    notifications: [
      { type: "course_start", enabled: true, roles: ["student"] },
      { type: "assignment_due", enabled: true, roles: ["student"] },
      { type: "grade_posted", enabled: true, roles: ["student"] },
      { type: "discussion_reply", enabled: true, roles: ["student", "volunteer", "researcher", "mentor", "educator"] },
    ],
  },

  volunteer: {
    role: "volunteer",
    label: "Volunteer",
    description: "Contributing to missions and community",
    permissions: [
      { id: "missions:read", action: "read", resource: "missions" },
      { id: "missions:contribute", action: "contribute", resource: "missions" },
      { id: "events:rsvp", action: "rsvp", resource: "events" },
      { id: "community:post", action: "post", resource: "community" },
      { id: "contributions:view", action: "view", resource: "contributions" },
    ],
    navItems: [
      { href: "/app/missions", label: "Missions", icon: "TreePine" },
      { href: "/app/community", label: "Community", icon: "Users" },
      { href: "/app/contributions", label: "Contributions", icon: "Heart" },
      { href: "/app/credentials", label: "Credentials", icon: "Award" },
    ],
    homeModules: [
      { id: "current-opportunities", title: "Current Opportunities", description: "Volunteer activities needing your help.", href: "/app/missions", icon: "TreePine", priority: 1, roles: ["volunteer"] },
      { id: "upcoming-event", title: "Upcoming Event", description: "Next volunteer event.", href: "/app/community", icon: "Calendar", priority: 2, roles: ["volunteer"] },
      { id: "my-contributions", title: "My Contributions", description: "Track your volunteer impact.", href: "/app/contributions", icon: "Heart", priority: 3, roles: ["volunteer"] },
      { id: "mission-updates", title: "Mission Updates", description: "Latest from our forest and heritage missions.", href: "/app/missions", icon: "TreePine", priority: 4, roles: ["volunteer"] },
    ],
    notifications: [
      { type: "event_reminder", enabled: true, roles: ["volunteer"] },
      { type: "mission_update", enabled: true, roles: ["volunteer"] },
      { type: "volunteer_application", enabled: true, roles: ["volunteer"] },
    ],
  },

  donor: {
    role: "donor",
    label: "Donor",
    description: "Supporting Bhavya Foundation's mission",
    permissions: [
      { id: "donations:view", action: "view", resource: "donations" },
      { id: "impact:read", action: "read", resource: "impact" },
      { id: "reports:read", action: "read", resource: "reports" },
      { id: "receipts:download", action: "download", resource: "receipts" },
    ],
    navItems: [
      { href: "/app", label: "Giving Overview", icon: "Home" },
      { href: "/app/missions", label: "Impact", icon: "TreePine" },
      { href: "/app/credentials", label: "Receipts", icon: "Award" },
    ],
    homeModules: [
      { id: "giving-overview", title: "Giving Overview", description: "Your donations and their impact.", href: "/app", icon: "Heart", priority: 1, roles: ["donor"] },
      { id: "projects-supported", title: "Projects Supported", description: "See what your donations are funding.", href: "/app/missions", icon: "TreePine", priority: 2, roles: ["donor"] },
      { id: "impact-updates", title: "Impact Updates", description: "Latest reports from the field.", href: "/app/missions", icon: "Compass", priority: 3, roles: ["donor"] },
      { id: "tax-receipts", title: "Tax Receipts", description: "Download donation receipts.", href: "/app/credentials", icon: "Download", priority: 4, roles: ["donor"] },
    ],
    notifications: [
      { type: "donation_receipt", enabled: true, roles: ["donor"] },
      { type: "impact_report", enabled: true, roles: ["donor"] },
      { type: "project_update", enabled: true, roles: ["donor"] },
    ],
  },

  researcher: {
    role: "researcher",
    label: "Researcher",
    description: "Contributing to knowledge and discovery",
    permissions: [
      { id: "knowledge:create", action: "create", resource: "knowledge" },
      { id: "knowledge:edit", action: "edit", resource: "knowledge" },
      { id: "research:read", action: "read", resource: "research" },
      { id: "research:contribute", action: "contribute", resource: "research" },
      { id: "publications:view", action: "view", resource: "publications" },
      { id: "community:post", action: "post", resource: "community" },
    ],
    navItems: [
      { href: "/app/research", label: "Research", icon: "FlaskConical" },
      { href: "/app/knowledge", label: "Knowledge", icon: "Compass" },
      { href: "/app/community", label: "Community", icon: "Users" },
      { href: "/app/contributions", label: "Contributions", icon: "Heart" },
    ],
    homeModules: [
      { id: "active-research", title: "Active Research", description: "Projects you're contributing to.", href: "/app/research", icon: "FlaskConical", priority: 1, roles: ["researcher"] },
      { id: "knowledge-objects", title: "Knowledge Objects", description: "Objects you've created or contributed to.", href: "/app/knowledge", icon: "Compass", priority: 2, roles: ["researcher"] },
      { id: "collaborations", title: "Collaborations", description: "Research partnerships.", href: "/app/research", icon: "Users", priority: 3, roles: ["researcher"] },
      { id: "publications", title: "Publications", description: "Your published work.", href: "/app/contributions", icon: "BookOpen", priority: 4, roles: ["researcher"] },
    ],
    notifications: [
      { type: "research_cited", enabled: true, roles: ["researcher"] },
      { type: "collaboration_invite", enabled: true, roles: ["researcher"] },
      { type: "knowledge_review", enabled: true, roles: ["researcher"] },
    ],
  },

  mentor: {
    role: "mentor",
    label: "Mentor",
    description: "Guiding and supporting learners",
    permissions: [
      { id: "students:view", action: "view", resource: "students" },
      { id: "courses:read", action: "read", resource: "courses" },
      { id: "community:post", action: "post", resource: "community" },
      { id: "community:mentor", action: "mentor", resource: "community" },
      { id: "credentials:issue", action: "issue", resource: "credentials" },
    ],
    navItems: [
      { href: "/app/learn", label: "Mentoring", icon: "BookOpen" },
      { href: "/app/community", label: "Community", icon: "Users" },
      { href: "/app/credentials", label: "Credentials", icon: "Award" },
    ],
    homeModules: [
      { id: "my-mentees", title: "My Mentees", description: "Students you're currently mentoring.", href: "/app/learn", icon: "Users", priority: 1, roles: ["mentor"] },
      { id: "upcoming-sessions", title: "Upcoming Sessions", description: "Scheduled mentoring sessions.", href: "/app/learn", icon: "Calendar", priority: 2, roles: ["mentor"] },
      { id: "community", title: "Community", description: "Guide and support learners.", href: "/app/community", icon: "Users", priority: 3, roles: ["mentor"] },
    ],
    notifications: [
      { type: "mentee_request", enabled: true, roles: ["mentor"] },
      { type: "session_reminder", enabled: true, roles: ["mentor"] },
      { type: "mentee_progress", enabled: true, roles: ["mentor"] },
    ],
  },

  educator: {
    role: "educator",
    label: "Educator",
    description: "Creating courses and educational content",
    permissions: [
      { id: "courses:create", action: "create", resource: "courses" },
      { id: "courses:edit", action: "edit", resource: "courses" },
      { id: "lessons:create", action: "create", resource: "lessons" },
      { id: "assessments:create", action: "create", resource: "assessments" },
      { id: "credentials:issue", action: "issue", resource: "credentials" },
      { id: "community:post", action: "post", resource: "community" },
    ],
    navItems: [
      { href: "/app/learn", label: "Courses", icon: "BookOpen" },
      { href: "/app/community", label: "Community", icon: "Users" },
      { href: "/app/contributions", label: "Contributions", icon: "Heart" },
      { href: "/os/studio", label: "Studio", icon: "FlaskConical" },
    ],
    homeModules: [
      { id: "my-courses", title: "My Courses", description: "Courses you've created.", href: "/app/learn", icon: "BookOpen", priority: 1, roles: ["educator"] },
      { id: "student-progress", title: "Student Progress", description: "How your students are doing.", href: "/app/learn", icon: "Users", priority: 2, roles: ["educator"] },
      { id: "content-studio", title: "Content Studio", description: "Create and manage educational content.", href: "/os/studio", icon: "FlaskConical", priority: 3, roles: ["educator"] },
    ],
    notifications: [
      { type: "course_published", enabled: true, roles: ["educator"] },
      { type: "student_enrolled", enabled: true, roles: ["educator"] },
      { type: "assessment_submitted", enabled: true, roles: ["educator"] },
    ],
  },
};

// ── Engine Functions ────────────────────────────────────────

export function getUserRoles(userId: string): Role[] {
  // TODO: Fetch from database
  return ["student"];
}

export function hasPermission(roles: Role[], permissionId: string): boolean {
  return roles.some((role) => {
    const config = ROLES[role];
    return config?.permissions.some((p) => p.id === permissionId);
  });
}

export function getNavItems(roles: Role[]): NavItem[] {
  const allNav = new Map<string, NavItem>();

  for (const role of roles) {
    const config = ROLES[role];
    if (!config) continue;

    for (const item of config.navItems) {
      if (!allNav.has(item.href)) {
        allNav.set(item.href, item);
      }
    }
  }

  return Array.from(allNav.values());
}

export function getHomeModules(roles: Role[]): HomeModule[] {
  const modules = new Map<string, HomeModule>();

  for (const role of roles) {
    const config = ROLES[role];
    if (!config) continue;

    for (const mod of config.homeModules) {
      if (mod.roles.some((r) => roles.includes(r))) {
        if (!modules.has(mod.id)) {
          modules.set(mod.id, mod);
        }
      }
    }
  }

  return Array.from(modules.values()).sort((a, b) => a.priority - b.priority);
}

export function getNotifications(roles: Role[]): NotificationPref[] {
  const notifs = new Map<string, NotificationPref>();

  for (const role of roles) {
    const config = ROLES[role];
    if (!config) continue;

    for (const notif of config.notifications) {
      if (!notifs.has(notif.type)) {
        notifs.set(notif.type, { ...notif, roles: [role] });
      } else {
        const existing = notifs.get(notif.type)!;
        existing.roles.push(role);
      }
    }
  }

  return Array.from(notifs.values());
}

export function getRoleLabel(roles: Role[]): string {
  if (roles.length === 1) return ROLES[roles[0]]?.label ?? roles[0];
  if (roles.length <= 3) return roles.map((r) => ROLES[r]?.label ?? r).join(", ");
  return `${roles.length} roles`;
}

export function isMultiRole(roles: Role[]): boolean {
  return roles.length > 1;
}
