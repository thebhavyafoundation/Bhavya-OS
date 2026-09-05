import { Users as UsersIcon } from "lucide-react";
import { UserRoles } from "../components/UserRoles";

export const metadata = {
  title: "User Management | Bhavya Foundation",
  description: "Manage platform users and roles",
};

export default function UsersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          User Management
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          Manage platform users and roles
        </p>
      </div>
      <UserRoles />
    </div>
  );
}
