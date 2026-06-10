"use client";

import { useEffect, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import type { StreamState } from "@/types/stream";

type StreamerControlsProps = {
  canStream: boolean;
  roomName: string;
  stream: StreamState;
  onStreamChange: (stream: StreamState) => void;
};

export function StreamerControls({
  canStream,
  roomName,
  stream,
  onStreamChange,
}: StreamerControlsProps) {
  const room = useRoomContext();
  const [loading, setLoading] = useState(false);
  const [live, setLive] = useState(false);
  const [title, setTitle] = useState(stream.title);
  const [category, setCategory] = useState(stream.category);
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [usingFrontCamera, setUsingFrontCamera] = useState(true);
  const [participantCount, setParticipantCount] = useState(1);
  const [liveNotificationSent, setLiveNotificationSent] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      setParticipantCount(Math.max(room.numParticipants, 1));
    };

    updateCount();
    room.on("participantConnected", updateCount);
    room.on("participantDisconnected", updateCount);

    return () => {
      room.off("participantConnected", updateCount);
      room.off("participantDisconnected", updateCount);
    };
  }, [room]);

  async function startStream() {
    if (!canStream) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some((device) => device.kind === "videoinput");
      const hasMic = devices.some((device) => device.kind === "audioinput");

      if (hasMic) {
        await room.localParticipant.setMicrophoneEnabled(true);
        setMicEnabled(true);
      }

      if (hasCamera) {
        await room.localParticipant.setCameraEnabled(true);
        setCameraEnabled(true);
      }

      const streamResponse = await fetch("/api/streams/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomName, title, category }),
      });

      if (streamResponse.ok) {
        const payload = (await streamResponse.json()) as { stream: StreamState };
        onStreamChange(payload.stream);
      }

      setLive(true);

      if (!liveNotificationSent) {
        fetch("/api/notifications/live", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, roomName }),
        }).catch((error) => {
          console.error("Live notification failed", error);
        });
        setLiveNotificationSent(true);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start stream";
      window.alert(message);
    } finally {
      setLoading(false);
    }
  }

  async function endStream() {
    await room.localParticipant.setMicrophoneEnabled(false);
    await room.localParticipant.setCameraEnabled(false);
    const response = await fetch("/api/streams/end", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomName }),
    });

    if (response.ok) {
      const payload = (await response.json()) as { stream: StreamState };
      onStreamChange(payload.stream);
    }

    setMicEnabled(false);
    setCameraEnabled(false);
    setLive(false);
    setLiveNotificationSent(false);
  }

  async function toggleMic() {
    const newState = !micEnabled;
    await room.localParticipant.setMicrophoneEnabled(newState);
    setMicEnabled(newState);
  }

  async function toggleCamera() {
    const newState = !cameraEnabled;
    await room.localParticipant.setCameraEnabled(newState);
    setCameraEnabled(newState);
  }

  async function flipCamera() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((device) => device.kind === "videoinput");

    if (videoDevices.length < 2) {
      window.alert("No second camera found");
      return;
    }

    const targetDevice = usingFrontCamera ? videoDevices[1] : videoDevices[0];

    await room.localParticipant.setCameraEnabled(false);
    await room.localParticipant.setCameraEnabled(true, {
      deviceId: targetDevice.deviceId,
    });

    setUsingFrontCamera(!usingFrontCamera);
  }

  if (!canStream) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">
            Stream controls
          </p>
          <p className="mt-1 text-sm text-muted">{participantCount} watching</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
            live ? "bg-live text-white" : "bg-surface-soft text-muted"
          }`}
        >
          {live ? "Live" : "Offline"}
        </span>
      </div>

      {!live ? (
        <div className="grid gap-3">
          <input
            className="min-h-11 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Stream title"
          />
          <select
            className="min-h-11 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>Golf</option>
            <option>Podcast</option>
            <option>Interview</option>
            <option>Community</option>
            <option>Behind the scenes</option>
          </select>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
        <ControlButton disabled={!live} label="End" tone="neutral" onClick={endStream} />
        <ControlButton
          disabled={!live}
          label={micEnabled ? "Mic on" : "Mic off"}
          tone={micEnabled ? "on" : "off"}
          onClick={toggleMic}
        />
        <ControlButton
          disabled={!live}
          label={cameraEnabled ? "Camera on" : "Camera off"}
          tone={cameraEnabled ? "on" : "off"}
          onClick={toggleCamera}
        />
        <ControlButton
          disabled={!live || !cameraEnabled}
          label="Flip"
          tone="action"
          onClick={flipCamera}
        />
      </div>

      {!live ? (
        <button
          className="rounded-md bg-live px-5 py-4 text-sm font-black uppercase text-white transition hover:bg-gold hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          disabled={loading}
          onClick={startStream}
        >
          {loading ? "Starting..." : "Go live"}
        </button>
      ) : null}
    </div>
  );
}

function ControlButton({
  disabled,
  label,
  tone,
  onClick,
}: {
  disabled: boolean;
  label: string;
  tone: "neutral" | "on" | "off" | "action";
  onClick: () => void;
}) {
  const toneClass = {
    neutral: "bg-surface-soft text-foreground",
    on: "bg-primary text-black",
    off: "bg-live text-white",
    action: "bg-gold text-black",
  }[tone];

  return (
    <button
      className={`min-h-12 rounded-md px-3 py-3 text-sm font-extrabold uppercase transition disabled:cursor-not-allowed disabled:opacity-45 ${toneClass}`}
      type="button"
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
