import Link from "next/link";
import { LiveRoomClient } from "@/components/live/LiveRoomClient";
import { defaultLiveRoomName } from "@/lib/livekit/rooms";
import { getStreamState } from "@/lib/streams/state";

export default async function LivePage() {
  const stream = await getStreamState(defaultLiveRoomName);

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Live</p>
            <h1 className="mt-2 text-3xl font-semibold">{stream.title}</h1>
            <p className="mt-2 text-sm text-muted">
              {stream.status === "live"
                ? `${stream.category} stream is live now`
                : "The stream is currently offline"}
            </p>
          </div>
          <Link
            href="/creator/live"
            className="rounded-full border border-border px-5 py-3 text-center text-sm font-bold transition hover:border-primary hover:text-primary"
          >
            Creator studio
          </Link>
        </div>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px]">
          <LiveRoomClient
            roomName={defaultLiveRoomName}
            role="viewer"
            initialStream={stream}
          />
        </section>
      </div>
    </main>
  );
}
