export interface PermissionCheck {
  action: string;
  resource: string;
  context?: Record<string, unknown>;
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  permissions: string[];
  parent?: string;
}

export class PermissionEngine {
  private roles: Map<string, RoleDefinition> = new Map();

  registerRole(role: RoleDefinition): void {
    this.roles.set(role.id, role);
  }

  can(check: PermissionCheck, userRoles: string[]): PermissionResult {
    for (const roleId of userRoles) {
      const role = this.roles.get(roleId);
      if (role && (role.permissions.includes(check.action) || role.permissions.includes("*"))) {
        return { allowed: true };
      }
      // Check parent chain
      let parent = role?.parent;
      while (parent) {
        const parentRole = this.roles.get(parent);
        if (parentRole?.permissions.includes(check.action)) {
          return { allowed: true };
        }
        parent = parentRole?.parent;
      }
    }
    return { allowed: false, reason: `Action '${check.action}' on '${check.resource}' not permitted` };
  }

  hasRole(roleId: string, userRoles: string[]): boolean {
    return userRoles.includes(roleId);
  }
}
