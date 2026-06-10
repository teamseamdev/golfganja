"use client";

import "@livekit/components-styles";

import { LiveKitRoom } from "@livekit/components-react";
import { useState } from "react";
import { LiveChat } from "@/components/live/LiveChat";
import { LivePlayer } from "@/components/live/LivePlayer";
import { StreamerControls } from "@/components/live/StreamerControls";
import type { LiveRole, LiveTokenResponse } from "@/types/live";
import type { StreamState } from "@/types/stream";

type LiveRoomClientProps = {
  roomName: string;
  role: LiveRole;
  initialStream: StreamState;
};

export function LiveRoomClient({
  roomName,
  role,
  initialStream,
}: LiveRoomClientProps) {
  const [connection, setConnection] = useState<LiveTokenResponse | null>(null);
  const [stream, setStream] = useState(initialStream);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function connect() {
    setLoading(true);
    setError(null);

    const response = await fetch("/api/livekit/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomName, role }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(payload?.error ?? "Could not connect to the live room.");
      setLoading(false);
      return;
    }

    const payload = (await response.json()) as LiveTokenResponse;
    setConnection(payload);
    setLoading(false);
  }

  if (!connection) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-border bg-surface p-6 text-center lg:min-h-[700px]">
        <p className="text-sm font-semibold uppercase text-primary">
          {role === "creator" ? "Creator access" : "Viewer access"}
        </p>
        <h2 className="mt-2 text-2xl font-semibold">
          {role === "creator" ? "Enter creator studio" : "Join live room"}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted">
          {role === "creator"
            ? "Join the room first, then use your custom controls to go live."
            : "Viewers can watch the broadcast and send chat without publishing camera or mic."}
        </p>
        {error ? (
          <div className="mt-5 rounded-md border border-live/40 bg-live/10 p-3 text-sm">
            {error}
          </div>
        ) : null}
        <button
          className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-bold text-black transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={loading}
          onClick={connect}
        >
          {loading
            ? "Connecting..."
            : role === "creator"
              ? "Enter studio"
              : "Watch live"}
        </button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      audio={false}
      video={false}
      token={connection.token}
      serverUrl={connection.url}
      connect
      className="contents"
    >
      <LivePlayer />
      <div className="flex flex-col gap-5">
        <StreamInfo stream={stream} />
        {role === "creator" ? (
          <StreamerControls
            canStream
            roomName={roomName}
            stream={stream}
            onStreamChange={setStream}
          />
        ) : null}
        <LiveChat />
      </div>
    </LiveKitRoom>
  );
}

function StreamInfo({ stream }: { stream: StreamState }) {
  const isLive = stream.status === "live";

  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase text-gold">
            {stream.category}
          </p>
          <h2 className="mt-2 text-xl font-semibold">{stream.title}</h2>
          <p className="mt-2 text-sm text-muted">
            {stream.creatorName
              ? `Hosted by ${stream.creatorName}`
              : "Golf N Ganja creator stream"}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-black uppercase ${
            isLive ? "bg-live text-white" : "bg-surface-soft text-muted"
          }`}
        >
          {isLive ? "Live" : "Offline"}
        </span>
      </div>
    </section>
  );
}
