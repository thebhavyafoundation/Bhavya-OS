"use client";

import { useState, useEffect } from "react";
import { ROLES, type Role } from "@/lib/roles";

/**
 * Real role model: the canonical RBAC definitions from lib/roles
 * (the same model API routes enforce server-side) joined with live
 * user counts from the admin-gated /os/admin/api/users endpoint.
 * Roles are assigned through approved paths only — never self-selected.
 */
export function UserRoles() {
  const [byRole, setByRole] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/os/admin/api/users");
        const body = await res.json();
        setByRole(body.byRole ?? {});
      } catch {
        setByRole({});
      }
    };
    load();
  }, []);

  const roles = Object.keys(ROLES) as Role[];

  return (
    <div className="space-y-6">
      <div className="bg-bg-secondary border border-border-primary rounded-xl overflow-hidden">
        <div className="px-4 py-3.5 border-b border-border-primary">
          <span className="text-sm font-semibold text-text-primary">
            Role Model
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-bg-tertiary">
                <th className="text-left px-4 py-2 font-medium text-text-secondary">
                  Role
                </th>
                <th className="text-left px-4 py-2 font-medium text-text-secondary">
                  Users
                </th>
                <th className="text-left px-4 py-2 font-medium text-text-secondary">
                  Permissions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary">
              {roles.map((role) => (
                <tr
                  key={role}
                  className="hover:bg-bg-tertiary transition-colors"
                >
                  <td className="px-4 py-2">
                    <div className="font-medium text-text-primary">
                      {ROLES[role].label}
                    </div>
                    <div className="text-xs text-text-muted">
                      {ROLES[role].description}
                    </div>
                  </td>
                  <td className="px-4 py-2 font-mono text-text-primary">
                    {byRole === null ? "…" : (byRole[role] ?? 0)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-1 flex-wrap">
                      {ROLES[role].permissions.map((p) => (
                        <span
                          key={p.id}
                          className="text-[10px] px-2 py-0.5 rounded bg-bg-tertiary text-text-tertiary border border-border-primary"
                        >
                          {p.id}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-text-muted">
        Trustee and admin roles are assigned through an approved path only.
        Registration and self-service support the onboarding roles.
      </p>
    </div>
  );
}
