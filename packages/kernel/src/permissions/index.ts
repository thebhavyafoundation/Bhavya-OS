// Bhavya Kernel — Permissions Module
// Access control.

import type { Permission } from '../types/index.js';

export class Permissions {
  private permissions = new Map<string, Permission[]>();

  async initialize(): Promise<void> {
    // Default permissions
  }

  async grant(agentId: string, permission: Permission): Promise<void> {
    const existing = this.permissions.get(agentId) ?? [];
    existing.push(permission);
    this.permissions.set(agentId, existing);
  }

  async revoke(agentId: string, resource: string, action: string): Promise<void> {
    const existing = this.permissions.get(agentId) ?? [];
    const filtered = existing.filter(
      (p) => !(p.resource === resource && p.actions.includes(action)),
    );
    this.permissions.set(agentId, filtered);
  }

  async check(agentId: string, resource: string, action: string): Promise<boolean> {
    const perms = this.permissions.get(agentId) ?? [];
    return perms.some(
      (p) =>
        (p.resource === '*' || p.resource === resource) &&
        (p.actions.includes('*') || p.actions.includes(action)),
    );
  }

  async getPermissions(agentId: string): Promise<Permission[]> {
    return this.permissions.get(agentId) ?? [];
  }

  async shutdown(): Promise<void> {
    this.permissions.clear();
  }
}
