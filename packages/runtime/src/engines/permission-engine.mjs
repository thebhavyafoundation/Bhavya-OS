/**
 * Permission Engine — registry-driven permission system.
 * Permissions are defined in BAR and enforced through this engine.
 */
export class PermissionEngine {
  #registry;
  #userPermissions = new Map(); // userId -> Set<permissionId>

  /** @param {import('../registry-loader.mjs').RegistryLoader} registry */
  constructor(registry) {
    this.#registry = registry;
  }

  /**
   * Assign permissions to a user.
   * @param {string} userId
   * @param {string[]} permissionIds - e.g., ['PM-KNOW-READ', 'PM-KNOW-CREATE']
   */
  assign(userId, permissionIds) {
    if (!this.#userPermissions.has(userId)) {
      this.#userPermissions.set(userId, new Set());
    }
    const perms = this.#userPermissions.get(userId);
    for (const p of permissionIds) perms.add(p);
    return this;
  }

  /**
   * Remove permissions from a user.
   * @param {string} userId
   * @param {string[]} permissionIds
   */
  revoke(userId, permissionIds) {
    const perms = this.#userPermissions.get(userId);
    if (perms) {
      for (const p of permissionIds) perms.delete(p);
    }
    return this;
  }

  /**
   * Get all permissions for a user.
   * @param {string} userId
   */
  getUserPermissions(userId) {
    return [...(this.#userPermissions.get(userId) || [])];
  }

  /**
   * Check if a user has a specific permission.
   * @param {string} userId
   * @param {string} permissionId
   * @returns {boolean}
   */
  has(userId, permissionId) {
    const perms = this.#userPermissions.get(userId);
    if (!perms) return false;
    // system.admin grants everything
    if (perms.has('PM-SYST-ADMIN')) return true;
    return perms.has(permissionId);
  }

  /**
   * Require a permission — throws if not granted.
   * @param {string} userId
   * @param {string} permissionId
   * @throws {PermissionError}
   */
  require(userId, permissionId) {
    if (!this.has(userId, permissionId)) {
      throw new PermissionError(userId, permissionId);
    }
  }

  /**
   * Check multiple permissions (all must be granted).
   * @param {string} userId
   * @param {string[]} permissionIds
   * @returns {{ granted: boolean, missing: string[] }}
   */
  checkAll(userId, permissionIds) {
    const missing = permissionIds.filter(p => !this.has(userId, p));
    return { granted: missing.length === 0, missing };
  }

  /**
   * Check if a user can perform an action on a capability.
   * @param {string} userId
   * @param {string} capabilityId
   * @param {'read'|'create'|'update'|'delete'|'publish'|'approve'} action
   */
  canCapability(userId, capabilityId, action) {
    const entity = this.#registry.get(capabilityId);
    if (!entity) return false;

    // Map action to permission pattern
    const permMap = {
      read: 'READ', create: 'CREATE', update: 'UPDATE',
      delete: 'DELETE', publish: 'PUBLISH', approve: 'APPROVE',
    };

    const permSuffix = permMap[action];
    if (!permSuffix) return false;

    // Try domain-specific permission
    const domainPrefix = entity.domain.replace('D', 'D');
    const permId = `PM-${domainPrefix}-${permSuffix}`;
    if (this.has(userId, permId)) return true;

    // Try kind-specific permission
    const kindPerms = {
      capability: `PM-KNOW-${permSuffix}`,
      workflow: `PM-LESS-${permSuffix}`,
      knowledgeObject: `PM-KNOW-${permSuffix}`,
    };

    const kindPerm = kindPerms[entity.kind];
    if (kindPerm && this.has(userId, kindPerm)) return true;

    return false;
  }

  /**
   * Check if a user can access a domain.
   * @param {string} userId
   * @param {string} domainId
   */
  canDomain(userId, domainId) {
    const perms = this.#userPermissions.get(userId) || new Set();
    if (perms.has('PM-SYST-ADMIN')) return true;
    // Check if user has any permission in this domain
    for (const permId of perms) {
      const perm = this.#registry.get(permId);
      if (perm && perm.domain === domainId) return true;
    }
    return false;
  }

  /**
   * Get all permissions for a domain.
   * @param {string} domainId
   */
  getDomainPermissions(domainId) {
    return this.#registry.getByKind('permission')
      .filter(p => p.domain === domainId);
  }

  /**
   * Get all permission groups.
   */
  getGroups() {
    const groups = {};
    for (const perm of this.#registry.getByKind('permission')) {
      const group = perm.metadata?.group || 'unknown';
      if (!groups[group]) groups[group] = [];
      groups[group].push({ id: perm.id, name: perm.name, action: perm.metadata?.action });
    }
    return groups;
  }

  /**
   * Generate a permission policy for a role.
   * @param {string} role - e.g., 'admin', 'teacher', 'student'
   * @returns {string[]} Permission IDs
   */
  getPolicyForRole(role) {
    const policies = {
      admin: this.#registry.getByKind('permission').map(p => p.id),
      teacher: [
        'PM-KNOW-READ', 'PM-KNOW-CREATE', 'PM-KNOW-UPDATE',
        'PM-LESS-READ', 'PM-LESS-CREATE', 'PM-LESS-UPDATE', 'PM-LESS-PUBLISH',
        'PM-ASSE-READ', 'PM-ASSE-CREATE', 'PM-ASSE-GRADE',
        'PM-CURR-READ',
        'PM-STUD-READ',
      ],
      student: [
        'PM-KNOW-READ', 'PM-LESS-READ', 'PM-ASSE-READ', 'PM-ASSE-SUBMIT',
      ],
      volunteer: [
        'PM-KNOW-READ', 'PM-COMM-READ', 'PM-COMM-CREATE',
        'PM-VOLU-LOG-HOUR', 'PM-VOLU-READ',
      ],
    };
    return policies[role] || policies.student;
  }
}

/**
 * Thrown when a permission is denied.
 */
export class PermissionError extends Error {
  constructor(userId, permissionId) {
    super(`Permission denied: user ${userId} lacks ${permissionId}`);
    this.name = 'PermissionError';
    this.userId = userId;
    this.permissionId = permissionId;
  }
}
