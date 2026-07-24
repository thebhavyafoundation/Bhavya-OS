import { UserRoles } from "../../components/UserRoles";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--admin-text)" }}>
          Users & Roles
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--admin-text-secondary)" }}>
          Role model, permission matrix, authentication integration
        </p>
      </div>
      <UserRoles />
    </div>
  );
}
