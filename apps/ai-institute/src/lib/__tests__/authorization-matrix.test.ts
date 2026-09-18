/**
 * Authorization matrix tests — server-side access rules.
 *
 * These tests assert the SAME policy objects the pages enforce
 * (ROUTE_POLICIES via canAccess) and the SAME role engine API routes
 * use (roleIsAllowed, hasPermission, roleHome). A page and its test
 * can only drift if someone edits one without the other — these tests
 * pin the intended matrix:
 *
 * - PUBLIC (no role) reaches no privileged workspace
 * - STUDENT cannot reach trustee/admin workspaces
 * - VOLUNTEER cannot reach trustee workspace
 * - DONOR cannot reach administrative operations
 * - TRUSTEE cannot become ADMIN (distinct roles, distinct permissions)
 * - ADMIN reaches administrative operations
 */

import { describe, it, expect } from "vitest";
import { canAccess, policyFor, ROUTE_POLICIES } from "@/lib/route-policy";
import {
  roleIsAllowed,
  hasPermission,
  roleHome,
  ONBOARDING_ROLES,
  OS_TOOL_ROLES,
  type Role,
} from "@/lib/roles";
import { safeRedirect } from "@/lib/participation-intents";

const NO_ROLE: Role[] = [];
const student: Role[] = ["student"];
const volunteer: Role[] = ["volunteer"];
const donor: Role[] = ["donor"];
const trustee: Role[] = ["trustee"];
const admin: Role[] = ["admin"];
const staff: Role[] = ["staff"];

describe("privileged workspaces deny the public", () => {
  const privileged = [
    "/os/admin",
    "/os/admin/users",
    "/os/admin/audit",
    "/os/trustee",
    "/os/student",
    "/os/volunteer",
    "/os/donor",
    "/os/runtime",
    "/os/github",
    "/os/mission",
    "/os/mission/approvals",
  ];
  for (const path of privileged) {
    it(`${path} denies a visitor with no role`, () => {
      expect(policyFor(path)).toBeDefined();
      expect(canAccess(path, NO_ROLE)).toBe(false);
    });
  }
});

describe("student boundaries", () => {
  it("STUDENT reaches the student workspace", () => {
    expect(canAccess("/os/student", student)).toBe(true);
  });
  it("STUDENT cannot access trustee workspace", () => {
    expect(canAccess("/os/trustee", student)).toBe(false);
  });
  it("STUDENT cannot access admin workspace", () => {
    expect(canAccess("/os/admin", student)).toBe(false);
    expect(canAccess("/os/admin/users", student)).toBe(false);
    expect(canAccess("/os/admin/audit", student)).toBe(false);
  });
  it("STUDENT cannot use operational tools", () => {
    expect(canAccess("/os/runtime", student)).toBe(false);
  });
});

describe("volunteer boundaries", () => {
  it("VOLUNTEER reaches the volunteer workspace", () => {
    expect(canAccess("/os/volunteer", volunteer)).toBe(true);
  });
  it("VOLUNTEER cannot access trustee workspace unless explicitly granted", () => {
    expect(canAccess("/os/trustee", volunteer)).toBe(false);
    expect(canAccess("/os/trustee", [...volunteer, "trustee"])).toBe(true);
  });
  it("VOLUNTEER cannot access admin workspace", () => {
    expect(canAccess("/os/admin", volunteer)).toBe(false);
  });
});

describe("donor boundaries", () => {
  it("DONOR reaches the donor workspace", () => {
    expect(canAccess("/os/donor", donor)).toBe(true);
  });
  it("DONOR cannot access administrative operations", () => {
    expect(canAccess("/os/admin", donor)).toBe(false);
    expect(canAccess("/os/runtime", donor)).toBe(false);
  });
});

describe("trustee is not admin", () => {
  it("TRUSTEE reaches the trustee workspace", () => {
    expect(canAccess("/os/trustee", trustee)).toBe(true);
  });
  it("TRUSTEE cannot automatically become ADMIN", () => {
    expect(canAccess("/os/admin", trustee)).toBe(false);
    expect(canAccess("/os/admin/users", trustee)).toBe(false);
    expect(hasPermission(trustee, "users:read")).toBe(false);
    expect(hasPermission(trustee, "os:admin")).toBe(false);
  });
  it("TRUSTEE holds governance permissions", () => {
    expect(hasPermission(trustee, "governance:read")).toBe(true);
    expect(hasPermission(trustee, "governance:approve")).toBe(true);
  });
});

describe("admin reach", () => {
  it("ADMIN can access administrative operations", () => {
    expect(canAccess("/os/admin", admin)).toBe(true);
    expect(canAccess("/os/admin/users", admin)).toBe(true);
    expect(canAccess("/os/admin/audit", admin)).toBe(true);
    expect(hasPermission(admin, "users:read")).toBe(true);
    expect(hasPermission(admin, "users:update")).toBe(true);
    expect(hasPermission(admin, "roles:assign")).toBe(true);
    expect(hasPermission(admin, "os:admin")).toBe(true);
  });
});

describe("staff operations", () => {
  it("STAFF reaches operational tools but not admin", () => {
    expect(canAccess("/os/runtime", staff)).toBe(true);
    expect(canAccess("/os/admin", staff)).toBe(false);
    expect(hasPermission(staff, "missions:manage")).toBe(true);
    expect(hasPermission(staff, "users:read")).toBe(false);
  });
  it("STAFF and ADMIN reach Mission Control", () => {
    expect(canAccess("/os/mission", staff)).toBe(true);
    expect(canAccess("/os/mission/approvals", staff)).toBe(true);
    expect(canAccess("/os/mission", admin)).toBe(true);
    expect(canAccess("/os/mission/approvals", admin)).toBe(true);
  });
  it("STUDENT cannot reach Mission Control", () => {
    expect(canAccess("/os/mission", student)).toBe(false);
    expect(canAccess("/os/mission/approvals", student)).toBe(false);
  });
});

describe("no self-promotion", () => {
  it("ONBOARDING_ROLES excludes every privileged role", () => {
    for (const privileged of [
      "admin",
      "trustee",
      "staff",
      "instructor",
      "volunteer",
      "donor",
    ] as Role[]) {
      expect(ONBOARDING_ROLES).not.toContain(privileged);
    }
  });
  it("role checks reject unknown roles", () => {
    expect(roleIsAllowed("ghost" as Role, ["admin"])).toBe(false);
    expect(hasPermission(["ghost" as Role], "os:admin")).toBe(false);
  });
});

describe("post-login routing lands on permitted ground", () => {
  const cases: [Role, string][] = [
    ["admin", "/os"],
    ["trustee", "/os/trustee"],
    ["staff", "/os"],
    ["educator", "/studio"],
    ["volunteer", "/app/missions"],
    ["donor", "/os/donor"],
    ["student", "/dashboard"],
  ];
  for (const [role, home] of cases) {
    it(`${role} homes to ${home}, which the role can access or which is session-gated`, () => {
      const dest = roleHome(role);
      expect(dest).toBe(home);
      if (policyFor(dest)) {
        expect(canAccess(dest, [role])).toBe(true);
      }
    });
  }
});

describe("redirect parameter hardening", () => {
  it("accepts safe in-app paths", () => {
    expect(safeRedirect("/courses")).toBe("/courses");
    expect(safeRedirect("/app/learn?x=1")).toBe("/app/learn?x=1");
  });
  it("rejects hostile and external destinations", () => {
    expect(safeRedirect("https://evil.example")).toBeNull();
    expect(safeRedirect("//evil.example/courses")).toBeNull();
    expect(safeRedirect("/\\evil.example")).toBeNull();
    expect(safeRedirect("javascript:alert(1)")).toBeNull();
    expect(safeRedirect("")).toBeNull();
    expect(safeRedirect(null)).toBeNull();
  });
});

describe("policy registry integrity", () => {
  it("every policy entry names real roles with real permissions", () => {
    for (const [path, policy] of Object.entries(ROUTE_POLICIES)) {
      expect(
        path.startsWith("/os/") || path.startsWith("/studio") || path === "/os",
      ).toBe(true);
      expect(policy.roles.length).toBeGreaterThan(0);
    }
  });
  it("operational tools share one role set (no scattered checks)", () => {
    for (const path of [
      "/os/runtime",
      "/os/observability",
      "/os/memory",
      "/os/github",
      "/os/ioc",
      "/os/social",
    ]) {
      expect(policyFor(path)?.roles).toEqual(OS_TOOL_ROLES);
    }
  });
});
