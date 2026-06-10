import Link from "next/link";
import { AdminContentPanel } from "@/components/admin/AdminContentPanel";
import { requirePermission } from "@/lib/auth/require-permission";
import { listMediaItems } from "@/lib/media/items";

export default async function AdminContentPage() {
  await requirePermission("canManageContent");
  const items = await listMediaItems(100);

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-gold">Admin</p>
            <h1 className="mt-2 text-3xl font-semibold">Content control</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Review media records, publish drafts, and choose featured items
              for the public Media page.
            </p>
          </div>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-black text-black transition hover:bg-gold"
            href="/creator/content"
          >
            Add media
          </Link>
        </div>

        <AdminContentPanel initialItems={items} />
      </div>
    </main>
  );
}
