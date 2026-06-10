import { LiveStreamAdminPanel } from "@/components/admin/LiveStreamAdminPanel";
import { requirePermission } from "@/lib/auth/require-permission";
import { defaultLiveRoomName } from "@/lib/livekit/rooms";
import { getStreamState, listRecentStreams } from "@/lib/streams/state";

export default async function AdminLivePage() {
  await requirePermission("canManageStreams");
  const stream = await getStreamState(defaultLiveRoomName);
  const recentStreams = await listRecentStreams(8);

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase text-gold">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold">Live stream control</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Monitor the current Golf N Ganja live room, send alerts, and mark a
          stuck stream ended.
        </p>

        <div className="mt-8">
          <LiveStreamAdminPanel stream={stream} />
        </div>

        <section className="mt-8 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-xl font-semibold">Recent stream records</h2>
          <div className="mt-5 grid gap-3">
            {recentStreams.length ? (
              recentStreams.map((item) => (
                <div
                  key={`${item.roomName}-${item.updatedAt}`}
                  className="rounded-md border border-border bg-background p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm text-muted">
                        {item.category} · {item.creatorName ?? "Unknown creator"}
                      </p>
                    </div>
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-black uppercase ${
                        item.status === "live"
                          ? "bg-live text-white"
                          : "bg-surface-soft text-muted"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No stream records yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
