import { PublicMediaGrid } from "@/components/media/PublicMediaGrid";
import { listPublishedMediaItemsByType } from "@/lib/media/items";

export default async function ClipsPage() {
  const items = await listPublishedMediaItemsByType("clip");

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase text-primary">Clips</p>
        <h1 className="mt-2 text-3xl font-semibold">Golf N Ganja clips</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Highlights, stream moments, golf shots, and short-form drops.
        </p>

        <section className="mt-8">
          <PublicMediaGrid emptyTitle="No clips published yet" items={items} />
        </section>
      </div>
    </main>
  );
}
