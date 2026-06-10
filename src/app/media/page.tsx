import Link from "next/link";
import { Clapperboard, Mic2, Plus, Radio, Video } from "lucide-react";
import { PublicMediaGrid } from "@/components/media/PublicMediaGrid";
import { hasPermission } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import { listPublishedMediaItems } from "@/lib/media/items";

const mediaSections = [
  {
    href: "/clips",
    label: "Clips",
    description: "Short highlights, stream moments, and golf shots.",
    icon: Clapperboard,
  },
  {
    href: "/podcasts",
    label: "Podcasts",
    description: "Interviews, conversations, and long-form sessions.",
    icon: Mic2,
  },
  {
    href: "#vods",
    label: "VODs",
    description: "Livestream archives and full video sessions.",
    icon: Video,
  },
];

export default async function MediaPage() {
  const user = await getCurrentUser();
  const roles = user?.roles ?? [];
  const canManageContent = hasPermission(roles, "canManageContent");
  const items = await listPublishedMediaItems();
  const featured = items.filter((item) => item.featured).slice(0, 3);
  const recent = items.slice(0, 9);

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Media</p>
            <h1 className="mt-2 text-3xl font-semibold">
              Clips, podcasts, and videos
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              The public hub for Golf N Ganja content: live clips, podcast
              episodes, videos, and future livestream archives.
            </p>
          </div>

          {canManageContent ? (
            <Link
              href="/creator/content"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-black transition hover:bg-gold"
            >
              <Plus size={17} />
              Add media
            </Link>
          ) : null}
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {mediaSections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.label}
                href={section.href}
                className="rounded-lg border border-border bg-surface p-5 transition hover:border-primary"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <Icon size={21} />
                </span>
                <h2 className="mt-5 text-xl font-semibold">{section.label}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  {section.description}
                </p>
              </Link>
            );
          })}
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-3">
            <Radio size={19} className="text-gold" />
            <h2 className="text-xl font-semibold">Featured media</h2>
          </div>
          <PublicMediaGrid emptyTitle="No featured media yet" items={featured} />
        </section>

        <section id="vods" className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">Latest media</h2>
          <PublicMediaGrid emptyTitle="No published media yet" items={recent} />
        </section>
      </div>
    </main>
  );
}
