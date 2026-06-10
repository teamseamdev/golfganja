import Link from "next/link";
import { CalendarDays, Clapperboard, Mic2, Plus, Radio, Star, UserRound } from "lucide-react";
import { hasPermission } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";

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
    href: "/creators",
    label: "Creators",
    description: "Creator profiles and future multi-creator media hubs.",
    icon: UserRound,
  },
];

const featuredPlaceholders = [
  {
    label: "Featured clip",
    title: "Best shot of the week",
    meta: "Clip slot",
  },
  {
    label: "Latest podcast",
    title: "Guest interview drop",
    meta: "Podcast slot",
  },
  {
    label: "Upcoming stream",
    title: "Front nine live session",
    meta: "Schedule slot",
  },
];

export default async function MediaPage() {
  const user = await getCurrentUser();
  const roles = user?.roles ?? [];
  const canManageContent = hasPermission(roles, "canManageContent");

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Media</p>
            <h1 className="mt-2 text-3xl font-semibold">
              Clips, podcasts, and creators
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              The public hub for Golf N Ganja content. As uploads come online,
              this page will surface live clips, podcast episodes, VODs,
              schedules, and creator profiles.
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

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {featuredPlaceholders.map((item) => (
            <div
              key={item.label}
              className="min-h-52 rounded-lg border border-border bg-surface p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase text-gold">
                  {item.label}
                </p>
                <Star size={17} className="text-gold" />
              </div>
              <div className="mt-14">
                <h2 className="text-2xl font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-muted">{item.meta}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          {mediaSections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.href}
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

        <section className="mt-5 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg border border-border bg-surface p-5">
            <div className="flex items-center gap-3">
              <Radio size={19} className="text-primary" />
              <h2 className="text-lg font-semibold">Livestream archive</h2>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
              VODs and livestream archives will appear here after stream
              lifecycle tracking and storage are connected.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface p-5">
            <div className="flex items-center gap-3">
              <CalendarDays size={19} className="text-gold" />
              <h2 className="text-lg font-semibold">Schedule</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">
              Upcoming golf rounds, interviews, and community streams will be
              listed here.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
