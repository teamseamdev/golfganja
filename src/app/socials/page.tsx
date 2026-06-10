import { Camera, Disc3, Music2, Play, Radio, Video } from "lucide-react";

const socials = [
  {
    label: "Discord",
    href: "#",
    status: "Invite coming soon",
    icon: Disc3,
  },
  {
    label: "YouTube",
    href: "#",
    status: "Channel coming soon",
    icon: Video,
  },
  {
    label: "Instagram",
    href: "#",
    status: "Profile coming soon",
    icon: Camera,
  },
  {
    label: "TikTok",
    href: "#",
    status: "Profile coming soon",
    icon: Music2,
  },
  {
    label: "Podcast",
    href: "#",
    status: "Feed coming soon",
    icon: Radio,
  },
  {
    label: "Live clips",
    href: "/media",
    status: "Media hub",
    icon: Play,
  },
];

export default function SocialsPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase text-primary">Socials</p>
        <h1 className="mt-2 text-3xl font-semibold">Golf N Ganja socials</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          The official channels are still being set up. This page will become
          the public link hub for Discord, socials, podcasts, and community
          announcements.
        </p>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {socials.map((social) => {
            const Icon = social.icon;

            return (
              <a
                key={social.label}
                href={social.href}
                className="flex min-h-28 items-center gap-4 rounded-lg border border-border bg-surface p-5 transition hover:border-primary"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <Icon size={21} />
                </span>
                <span>
                  <span className="block text-lg font-semibold">{social.label}</span>
                  <span className="mt-1 block text-sm text-muted">{social.status}</span>
                </span>
              </a>
            );
          })}
        </section>

        <section className="mt-8 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-lg font-semibold">Integrated feed placeholder</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Once the channels are finalized, this area can embed a social feed,
            latest YouTube uploads, podcast drops, and Discord community CTA.
          </p>
        </section>
      </div>
    </main>
  );
}
