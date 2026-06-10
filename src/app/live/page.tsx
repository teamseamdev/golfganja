import Link from "next/link";
import { LiveRoomClient } from "@/components/live/LiveRoomClient";
import { defaultLiveRoomName } from "@/lib/livekit/rooms";

export default function LivePage() {
  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Live</p>
            <h1 className="mt-2 text-3xl font-semibold">Golf N Ganja Live</h1>
          </div>
          <Link
            href="/creator/live"
            className="rounded-full border border-border px-5 py-3 text-center text-sm font-bold transition hover:border-primary hover:text-primary"
          >
            Creator studio
          </Link>
        </div>

        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px]">
          <LiveRoomClient roomName={defaultLiveRoomName} role="viewer" />
          <aside className="min-h-[420px] rounded-lg border border-border bg-surface p-4">
            <h2 className="text-lg font-semibold">Live chat</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              LiveKit data chat will mount here after auth and room tokens are
              wired.
            </p>
          </aside>
        </section>
      </div>
    </main>
  );
}
