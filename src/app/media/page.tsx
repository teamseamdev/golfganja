import Link from "next/link";

const mediaSections = [
  {
    href: "/clips",
    label: "Clips",
    description: "Short highlights, stream moments, and golf shots.",
  },
  {
    href: "/podcasts",
    label: "Podcasts",
    description: "Interviews, conversations, and long-form sessions.",
  },
  {
    href: "/creators",
    label: "Creators",
    description: "Creator profiles and future multi-creator media hubs.",
  },
];

export default function MediaPage() {
  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase text-primary">Media</p>
        <h1 className="mt-2 text-3xl font-semibold">Clips, podcasts, and creators</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          This will become the public media hub for Golf N Ganja content. For
          now, it gives viewers one clean place to discover clips, podcast
          episodes, VODs, and creator profiles as those systems come online.
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {mediaSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-lg border border-border bg-surface p-5 transition hover:border-primary"
            >
              <h2 className="text-xl font-semibold">{section.label}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                {section.description}
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-8 rounded-lg border border-border bg-surface p-5">
          <h2 className="text-lg font-semibold">Creator uploads coming soon</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Admins and approved creators will eventually be able to add clips,
            podcasts, videos, thumbnails, and livestream archives from protected
            studio tools.
          </p>
        </section>
      </div>
    </main>
  );
}
