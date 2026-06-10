"use client";

import { ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import type { MediaItem, MediaType } from "@/types/media";

type FilterType = "all" | MediaType;

const filters: FilterType[] = ["all", "clip", "podcast", "video", "vod"];

export function AdminContentPanel({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<FilterType>("all");
  const [message, setMessage] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const visibleItems = useMemo(
    () => items.filter((item) => filter === "all" || item.type === filter),
    [filter, items],
  );

  async function updateItem(
    item: MediaItem,
    updates: Pick<Partial<MediaItem>, "featured" | "published">,
  ) {
    setLoadingId(item.id);
    setMessage(null);

    const response = await fetch("/api/media", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: item.id, ...updates }),
    });
    const payload = (await response.json().catch(() => null)) as {
      item?: MediaItem;
      error?: string;
    } | null;

    if (!response.ok || !payload?.item) {
      setMessage(payload?.error ?? "Could not update media item.");
      setLoadingId(null);
      return;
    }

    setItems((current) =>
      current.map((currentItem) =>
        currentItem.id === payload.item!.id ? payload.item! : currentItem,
      ),
    );
    setMessage("Media item updated.");
    setLoadingId(null);
  }

  return (
    <section className="mt-8 rounded-lg border border-border bg-surface p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">All media records</h2>
          <p className="mt-2 text-sm text-muted">
            Review records and control what appears on the public media pages.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              className={`rounded-full px-4 py-2 text-xs font-black uppercase transition ${
                filter === item
                  ? "bg-primary text-black"
                  : "bg-surface-soft text-muted hover:text-foreground"
              }`}
              type="button"
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {message ? <p className="mt-4 text-sm text-muted">{message}</p> : null}

      <div className="mt-5 grid gap-3">
        {visibleItems.length ? (
          visibleItems.map((item) => (
            <div
              key={item.id}
              className="rounded-md border border-border bg-background p-4"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-xs font-black uppercase text-primary">
                    {item.type} · {item.category}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {item.description || "No description."}
                  </p>
                  <p className="mt-3 text-xs text-muted">
                    Added by {item.creatorName ?? "Unknown"} ·{" "}
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                  {item.mediaUrl ? (
                    <a
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-bold transition hover:border-primary hover:text-primary"
                      href={item.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={15} />
                      Open
                    </a>
                  ) : null}
                  <button
                    className={`min-h-10 rounded-full px-4 text-sm font-black transition disabled:opacity-60 ${
                      item.published
                        ? "bg-primary text-black"
                        : "bg-surface-soft text-muted hover:text-foreground"
                    }`}
                    type="button"
                    disabled={loadingId === item.id}
                    onClick={() =>
                      updateItem(item, { published: !item.published })
                    }
                  >
                    {item.published ? "Published" : "Draft"}
                  </button>
                  <button
                    className={`min-h-10 rounded-full px-4 text-sm font-black transition disabled:opacity-60 ${
                      item.featured
                        ? "bg-gold text-black"
                        : "bg-surface-soft text-muted hover:text-foreground"
                    }`}
                    type="button"
                    disabled={loadingId === item.id}
                    onClick={() => updateItem(item, { featured: !item.featured })}
                  >
                    {item.featured ? "Featured" : "Feature"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted">No media records match this filter.</p>
        )}
      </div>
    </section>
  );
}
