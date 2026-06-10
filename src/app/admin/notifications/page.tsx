import { NotificationComposer } from "@/components/admin/NotificationComposer";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function AdminNotificationsPage() {
  await requirePermission("canSendNotifications");

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase text-gold">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold">Notifications</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Manage push alerts for livestreams, uploads, announcements, and
          community updates.
        </p>

        <NotificationComposer />
      </div>
    </main>
  );
}
