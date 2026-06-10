import { requirePermission } from "@/lib/auth/require-permission";

export default async function CreatorContentPage() {
  await requirePermission("canManageContent");

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase text-primary">Studio</p>
        <h1 className="mt-2 text-3xl font-semibold">Media manager</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Creator uploads will be managed here: clips, podcasts, videos,
          thumbnails, featured slots, and livestream archives.
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {["Add clip", "Add podcast", "Add video"].map((label) => (
            <div
              key={label}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <h2 className="text-xl font-semibold">{label}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Upload form and publishing workflow coming soon.
              </p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
