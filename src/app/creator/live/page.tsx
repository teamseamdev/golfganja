import { requirePermission } from "@/lib/auth/require-permission";
import { LiveRoomClient } from "@/components/live/LiveRoomClient";
import { defaultLiveRoomName } from "@/lib/livekit/rooms";
import { getStreamState } from "@/lib/streams/state";

export default async function CreatorLivePage() {
  await requirePermission("canGoLive");
  const stream = await getStreamState(defaultLiveRoomName);

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase text-primary">
          Creator studio
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Go live</h1>
        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px]">
          <LiveRoomClient
            roomName={defaultLiveRoomName}
            role="creator"
            initialStream={stream}
          />
        </section>
      </div>
    </main>
  );
}
