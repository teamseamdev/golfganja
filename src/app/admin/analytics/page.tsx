import { requirePermission } from "@/lib/auth/require-permission";
import { getAnalyticsSummary } from "@/lib/analytics/summary";

const statLabels = [
  ["totalUsers", "Users"],
  ["totalMedia", "Media records"],
  ["publishedMedia", "Published media"],
  ["featuredMedia", "Featured media"],
  ["pushSubscribers", "Push subscribers"],
  ["totalNotifications", "Notifications sent"],
  ["totalStreams", "Stream records"],
] as const;

export default async function AdminAnalyticsPage() {
  await requirePermission("canViewAdmin");
  const summary = await getAnalyticsSummary();

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase text-gold">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold">Analytics</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Early operational metrics for users, media, live streams, and
          notifications.
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statLabels.map(([key, label]) => (
            <div
              key={key}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <p className="text-sm text-muted">{label}</p>
              <p className="mt-3 text-4xl font-black">{summary[key]}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-xl font-semibold">Live status</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                summary.currentStreamStatus === "live"
                  ? "bg-live text-white"
                  : "bg-surface-soft text-muted"
              }`}
            >
              {summary.currentStreamStatus}
            </span>
            {summary.liveStartedAt ? (
              <span className="rounded-full bg-surface-soft px-3 py-1 text-xs text-muted">
                Started {new Date(summary.liveStartedAt).toLocaleString()}
              </span>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
