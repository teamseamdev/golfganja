import { ExternalLink } from "lucide-react";
import type { MediaItem } from "@/types/media";

export function PublicMediaGrid({
  emptyTitle,
  items,
}: {
  emptyTitle: string;
  items: MediaItem[];
}) {
  if (!items.length) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 text-center">
        <h2 className="text-xl font-semibold">{emptyTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          Published media will appear here once the team adds content in Studio.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function MediaCard({ item }: { item: MediaItem }) {
  const card = (
    <article className="h-full overflow-hidden rounded-lg border border-border bg-surface transition hover:border-primary">
      <div className="flex aspect-video items-center justify-center bg-[linear-gradient(135deg,#101711,#050706_60%,#18120a)]">
        {item.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs font-black uppercase text-gold">
            {item.type}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-black uppercase text-primary">
            {item.type}
          </span>
          {item.featured ? (
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-black uppercase text-black">
              Featured
            </span>
          ) : null}
        </div>
        <h2 className="mt-4 text-xl font-semibold">{item.title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          {item.description || item.category}
        </p>
        <p className="mt-4 text-xs font-semibold uppercase text-muted">
          {item.category}
        </p>
      </div>
    </article>
  );

  if (!item.mediaUrl) {
    return card;
  }

  return (
    <a href={item.mediaUrl} target="_blank" rel="noopener noreferrer">
      <span className="sr-only">Open {item.title}</span>
      <div className="relative">
        {card}
        <ExternalLink className="absolute right-4 top-4 text-foreground" size={18} />
      </div>
    </a>
  );
}
