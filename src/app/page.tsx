import Link from "next/link";
import { ArrowRight, Clapperboard, Radio, ShoppingBag, Users } from "lucide-react";
import { defaultLiveRoomName } from "@/lib/livekit/rooms";
import { listPublishedMediaItems } from "@/lib/media/items";
import { getStreamState } from "@/lib/streams/state";

const quickLinks = [
  {
    href: "/live",
    label: "Live room",
    description: "Watch the stream and join chat.",
    icon: Radio,
  },
  {
    href: "/media",
    label: "Media",
    description: "Browse clips, podcasts, videos, and VODs.",
    icon: Clapperboard,
  },
  {
    href: "/socials",
    label: "Socials",
    description: "Find the official Golf N Ganja channels.",
    icon: Users,
  },
  {
    href: "/shop",
    label: "Shop",
    description: "Merch will live here when it drops.",
    icon: ShoppingBag,
  },
];

export default async function Home() {
  const [stream, media] = await Promise.all([
    getStreamState(defaultLiveRoomName),
    listPublishedMediaItems(3),
  ]);
  const isLive = stream.status === "live";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_0.82fr] lg:items-center lg:px-10 lg:py-14">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-surface px-3 py-1 text-xs font-black uppercase text-primary">
            <span
              className={`h-2 w-2 rounded-full ${
                isLive ? "bg-live" : "bg-muted"
              }`}
            />
            {isLive ? "Live now" : "Golf N Ganja"}
          </div>

          <h1 className="text-5xl font-semibold leading-[1.02] text-foreground sm:text-6xl lg:text-7xl">
            Golf, live conversations, and community.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            A home base for Golf N Ganja streams, clips, podcast sessions, and
            the people who pull up for the round.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/live"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-black text-black transition hover:bg-gold"
            >
              Watch live
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/media"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-border px-6 text-sm font-black text-foreground transition hover:border-gold hover:text-gold"
            >
              Browse media
            </Link>
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-surface p-4 shadow-2xl shadow-black/30">
          <div className="aspect-video rounded-md border border-border bg-[linear-gradient(145deg,#18221b,#050706_52%,#20190d)] p-5">
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                    isLive ? "bg-live text-white" : "bg-surface-soft text-muted"
                  }`}
                >
                  {isLive ? "Live" : "Offline"}
                </span>
                <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-muted">
                  {stream.category}
                </span>
              </div>

              <div>
                <p className="text-xs font-black uppercase text-gold">
                  Current stream
                </p>
                <h2 className="mt-2 text-2xl font-semibold leading-tight">
                  {stream.title}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-muted">
                  {isLive
                    ? "The room is open now. Jump in, watch, and chat live."
                    : "The stream is offline. Check the media hub for recent drops."}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section className="border-t border-border bg-surface/45 px-5 py-8 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-border bg-background p-5 transition hover:border-primary"
              >
                <Icon className="text-primary" size={22} />
                <h2 className="mt-4 text-lg font-semibold">{item.label}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {media.length ? (
        <section className="px-5 py-10 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase text-primary">
                  Latest
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Recent media</h2>
              </div>
              <Link
                href="/media"
                className="text-sm font-black text-gold transition hover:text-primary"
              >
                View all
              </Link>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {media.map((item) => (
                <Link
                  key={item.id}
                  href="/media"
                  className="rounded-lg border border-border bg-surface p-5 transition hover:border-gold"
                >
                  <p className="text-xs font-black uppercase text-gold">
                    {item.type} / {item.category}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
