"use client";

import { Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import type { MediaItem, MediaType } from "@/types/media";

export function MediaManager({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [type, setType] = useState<MediaType>("clip");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Golf");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function createItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/media", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        title,
        description,
        category,
        thumbnailUrl,
        mediaUrl,
        published,
        featured,
      }),
    });
    const payload = (await response.json().catch(() => null)) as {
      item?: MediaItem;
      error?: string;
    } | null;

    if (!response.ok || !payload?.item) {
      setMessage(payload?.error ?? "Could not create media item.");
      setLoading(false);
      return;
    }

    setItems((current) => [payload.item!, ...current]);
    setTitle("");
    setDescription("");
    setThumbnailUrl("");
    setMediaUrl("");
    setPublished(false);
    setFeatured(false);
    setMessage("Media item created.");
    setLoading(false);
  }

  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-[420px_1fr]">
      <form
        className="rounded-lg border border-border bg-surface p-5"
        onSubmit={createItem}
      >
        <h2 className="text-xl font-semibold">Add media</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Creates metadata records now. File upload/storage can plug into this
          same model later.
        </p>

        <div className="mt-5 grid gap-3">
          <select
            className="min-h-12 rounded-md border border-border bg-background px-4 text-base text-foreground outline-none focus:border-primary"
            value={type}
            onChange={(event) => setType(event.target.value as MediaType)}
          >
            <option value="clip">Clip</option>
            <option value="podcast">Podcast</option>
            <option value="video">Video</option>
            <option value="vod">VOD</option>
          </select>
          <input
            className="min-h-12 rounded-md border border-border bg-background px-4 text-base text-foreground outline-none focus:border-primary"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
            required
          />
          <textarea
            className="min-h-28 rounded-md border border-border bg-background px-4 py-3 text-base text-foreground outline-none focus:border-primary"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
          />
          <input
            className="min-h-12 rounded-md border border-border bg-background px-4 text-base text-foreground outline-none focus:border-primary"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Category"
          />
          <input
            className="min-h-12 rounded-md border border-border bg-background px-4 text-base text-foreground outline-none focus:border-primary"
            value={thumbnailUrl}
            onChange={(event) => setThumbnailUrl(event.target.value)}
            placeholder="Thumbnail URL"
          />
          <input
            className="min-h-12 rounded-md border border-border bg-background px-4 text-base text-foreground outline-none focus:border-primary"
            value={mediaUrl}
            onChange={(event) => setMediaUrl(event.target.value)}
            placeholder="Media URL"
          />
          <label className="flex items-center gap-3 text-sm text-muted">
            <input
              checked={published}
              type="checkbox"
              onChange={(event) => setPublished(event.target.checked)}
            />
            Published
          </label>
          <label className="flex items-center gap-3 text-sm text-muted">
            <input
              checked={featured}
              type="checkbox"
              onChange={(event) => setFeatured(event.target.checked)}
            />
            Featured
          </label>
        </div>

        {message ? <p className="mt-4 text-sm text-muted">{message}</p> : null}

        <button
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-black transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          <Plus size={16} />
          {loading ? "Creating..." : "Create media"}
        </button>
      </form>

      <section className="rounded-lg border border-border bg-surface p-5">
        <h2 className="text-xl font-semibold">Media records</h2>
        <div className="mt-5 grid gap-3">
          {items.length ? (
            items.map((item) => (
              <div
                key={item.id}
                className="rounded-md border border-border bg-background p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase text-primary">
                      {item.type} · {item.category}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {item.description || "No description yet."}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <StatusBadge active={item.published} label="Published" />
                    <StatusBadge active={item.featured} label="Featured" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">No media records yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
        active ? "bg-primary text-black" : "bg-surface-soft text-muted"
      }`}
    >
      {label}
    </span>
  );
}
