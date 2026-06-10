"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

export function NotificationComposer() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("/live");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendNotification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    const response = await fetch("/api/notifications/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, message, url }),
    });
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
      sent?: number;
      failed?: number;
    } | null;

    if (!response.ok) {
      setResult(payload?.error ?? "Notification send failed.");
      setLoading(false);
      return;
    }

    setResult(`Sent to ${payload?.sent ?? 0} users. Failed: ${payload?.failed ?? 0}.`);
    setTitle("");
    setMessage("");
    setLoading(false);
  }

  return (
    <form
      className="mt-8 max-w-2xl rounded-lg border border-border bg-surface p-5"
      onSubmit={sendNotification}
    >
      <h2 className="text-xl font-semibold">Send notification</h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Sends a push notification to saved device subscriptions.
      </p>

      <div className="mt-5 grid gap-3">
        <input
          className="min-h-12 rounded-md border border-border bg-background px-4 text-base text-foreground outline-none focus:border-primary"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          className="min-h-32 rounded-md border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus:border-primary"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Message"
          required
        />
        <input
          className="min-h-12 rounded-md border border-border bg-background px-4 text-base text-foreground outline-none focus:border-primary"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="/live"
        />
      </div>

      {result ? <p className="mt-4 text-sm text-muted">{result}</p> : null}

      <button
        className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-black transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        <Send size={16} />
        {loading ? "Sending..." : "Send notification"}
      </button>
    </form>
  );
}
