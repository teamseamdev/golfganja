"use client";

import "@livekit/components-styles";

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useState } from "react";
import type { LiveRole, LiveTokenResponse } from "@/types/live";

type LiveRoomClientProps = {
  roomName: string;
  role: LiveRole;
};

export function LiveRoomClient({ roomName, role }: LiveRoomClientProps) {
  const [connection, setConnection] = useState<LiveTokenResponse | null>(null);
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
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-border bg-surface p-6 text-center">
        <p className="text-sm font-semibold uppercase text-primary">
          {role === "creator" ? "Creator access" : "Viewer access"}
        </p>
        <h2 className="mt-2 text-2xl font-semibold">
          {role === "creator" ? "Start broadcast session" : "Join live room"}
        </h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-muted">
          {role === "creator"
            ? "You will join with camera, microphone, and data permissions."
            : "You will join as a viewer with video playback and chat data permissions only."}
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
          {loading ? "Connecting..." : role === "creator" ? "Go live" : "Watch live"}
        </button>
      </div>
    );
  }

  return (
    <LiveKitRoom
      audio={role === "creator"}
      video={role === "creator"}
      token={connection.token}
      serverUrl={connection.url}
      connect
      className="min-h-[420px] overflow-hidden rounded-lg border border-border bg-black"
    >
      <LiveStage role={role} />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

function LiveStage({ role }: { role: LiveRole }) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <div className="flex min-h-[420px] flex-col">
      <div className="flex-1 p-3">
        <GridLayout tracks={tracks} className="h-full">
          <ParticipantTile />
        </GridLayout>
      </div>
      {role === "creator" ? (
        <div className="border-t border-border bg-surface/95 p-2">
          <ControlBar controls={{ chat: false, screenShare: true }} />
        </div>
      ) : null}
    </div>
  );
}
