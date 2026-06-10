import { MediaManager } from "@/components/media/MediaManager";
import { requirePermission } from "@/lib/auth/require-permission";
import { listMediaItems } from "@/lib/media/items";

export default async function CreatorContentPage() {
  await requirePermission("canManageContent");
  const items = await listMediaItems();

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase text-primary">Studio</p>
        <h1 className="mt-2 text-3xl font-semibold">Media manager</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Create and organize clips, podcasts, videos, thumbnails, featured
          slots, and livestream archives.
        </p>

        <MediaManager initialItems={items} />
      </div>
    </main>
  );
}
