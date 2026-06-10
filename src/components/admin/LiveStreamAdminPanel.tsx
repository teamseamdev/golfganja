"use client";

import { Bell, ExternalLink, Square } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { StreamState } from "@/types/stream";

export function LiveStreamAdminPanel({ stream }: { stream: StreamState }) {
  const [current, setCurrent] = useState(stream);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function endStream() {
    setLoading("end");
    setMessage(null);

    const response = await fetch("/api/streams/end", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomName: current.roomName }),
    });
    const payload = (await response.json().catch(() => null)) as {
      stream?: StreamState;
      error?: string;
    } | null;

    if (!response.ok) {
      setMessage(payload?.error ?? "Could not end stream.");
      setLoading(null);
      return;
    }

    if (payload?.stream) {
      setCurrent(payload.stream);
    }

    setMessage("Stream marked ended.");
    setLoading(null);
  }

  async function sendLiveAlert() {
    setLoading("alert");
    setMessage(null);

    const response = await fetch("/api/notifications/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: current.creatorName
          ? `${current.creatorName} is live: ${current.title}`
          : `Golf N Ganja is live: ${current.title}`,
        message: "Tap to watch the livestream.",
        url: "/live",
      }),
    });
    const payload = (await response.json().catch(() => null)) as {
      sent?: number;
      failed?: number;
      error?: string;
    } | null;

    if (!response.ok) {
      setMessage(payload?.error ?? "Could not send live alert.");
      setLoading(null);
      return;
    }

    setMessage(`Alert sent to ${payload?.sent ?? 0} devices.`);
    setLoading(null);
  }

  return (
    <section className="rounded-lg border border-border bg-surface p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase text-gold">
            Current stream
          </p>
          <h2 className="mt-2 text-2xl font-semibold">{current.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            {current.category} · {current.creatorName ?? "No active creator"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                current.status === "live"
                  ? "bg-live text-white"
                  : "bg-surface-soft text-muted"
              }`}
            >
              {current.status}
            </span>
            {current.startedAt ? (
              <span className="rounded-full bg-surface-soft px-3 py-1 text-xs text-muted">
                Started {new Date(current.startedAt).toLocaleString()}
              </span>
            ) : null}
            {current.endedAt ? (
              <span className="rounded-full bg-surface-soft px-3 py-1 text-xs text-muted">
                Ended {new Date(current.endedAt).toLocaleString()}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
          <Link
            href="/live"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-bold transition hover:border-primary hover:text-primary"
          >
            <ExternalLink size={16} />
            View live
          </Link>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-black transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            disabled={loading !== null}
            onClick={sendLiveAlert}
          >
            <Bell size={16} />
            {loading === "alert" ? "Sending..." : "Send alert"}
          </button>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-live/60 px-5 text-sm font-black text-live transition hover:bg-live hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
            disabled={loading !== null || current.status !== "live"}
            onClick={endStream}
          >
            <Square size={16} />
            {loading === "end" ? "Ending..." : "Mark ended"}
          </button>
        </div>
      </div>

      {message ? <p className="mt-4 text-sm text-muted">{message}</p> : null}
    </section>
  );
}
