import Link from "next/link";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function AdminPage() {
  const user = await requirePermission("canViewAdmin");

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase text-gold">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold">Control panel</h1>
        <p className="mt-3 text-sm text-muted">
          Signed in as {user.name ?? "admin"}.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Users", "/admin/users"],
            ["Live streams", "/admin/live"],
            ["Notifications", "/admin/notifications"],
            ["Content", "/admin/content"],
            ["Analytics", "/admin/analytics"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg border border-border bg-surface p-5 text-lg font-semibold transition hover:border-gold"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
