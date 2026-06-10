import Link from "next/link";
import { requirePermission } from "@/lib/auth/require-permission";

export default async function CreatorDashboardPage() {
  const user = await requirePermission("canViewCreatorDashboard");

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase text-primary">Creator</p>
        <h1 className="mt-2 text-3xl font-semibold">Creator dashboard</h1>
        <p className="mt-3 text-sm text-muted">
          Signed in as {user.name ?? "creator"}.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Go live", "/creator/live"],
            ["Content", "/creator/content"],
            ["Schedule", "/creator/schedule"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg border border-border bg-surface p-5 text-lg font-semibold transition hover:border-primary"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
