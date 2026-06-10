import { AdminUsersPanel } from "@/components/admin/AdminUsersPanel";
import { requirePermission } from "@/lib/auth/require-permission";
import { listUsers } from "@/lib/firebase/users";

export default async function AdminUsersPage() {
  const currentUser = await requirePermission("canManageUsers");
  const users = await listUsers();

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase text-gold">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold">User management</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Manage access for owners, admins, creators, moderators, and viewers.
        </p>

        <AdminUsersPanel
          currentUserId={currentUser.id}
          currentUserRoles={currentUser.roles}
          initialUsers={users}
        />
      </div>
    </main>
  );
}
