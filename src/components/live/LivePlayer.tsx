"use client";

import {
  RoomAudioRenderer,
  useTracks,
  VideoTrack,
} from "@livekit/components-react";
import type { TrackReference } from "@livekit/components-core";
import { Track } from "livekit-client";

export function LivePlayer() {
  const tracks = useTracks([
    {
      source: Track.Source.Camera,
      withPlaceholder: false,
    },
  ]);
  const streamerTrack = tracks.find(
    (track): track is TrackReference =>
      Boolean(track.publication) &&
      track.participant.identity.startsWith("streamer-"),
  );

  if (!streamerTrack) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-lg border border-border bg-black text-lg font-bold text-foreground lg:min-h-[700px]">
        Stream is offline
      </div>
    );
  }

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-border bg-black lg:min-h-[700px]">
      <VideoTrack trackRef={streamerTrack} className="h-full w-full object-contain" />
      <RoomAudioRenderer />
    </div>
  );
}
