import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col px-5 sm:px-8 lg:px-10">
        <div className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.08fr_0.92fr] lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary-soft/50 px-3 py-1 text-xs font-semibold uppercase text-primary">
              <span className="h-2 w-2 rounded-full bg-live" />
              Creator media platform
            </div>
            <h1 className="text-5xl font-semibold leading-[1.02] text-foreground sm:text-6xl lg:text-7xl">
              Premium golf streams, podcasts, and community.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              A mobile-first livestream home for Golf N Ganja: creator-led golf
              rounds, live guest interviews, chat, clips, VODs, and community
              features with a legal cannabis lifestyle edge.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/live"
                className="rounded-full bg-primary px-6 py-3 text-center text-sm font-bold text-black transition hover:bg-gold"
              >
                Enter live room
              </Link>
              <Link
                href="/media"
                className="rounded-full border border-border px-6 py-3 text-center text-sm font-bold text-foreground transition hover:border-gold hover:text-gold"
              >
                Explore media
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 shadow-2xl shadow-black/40">
            <div className="aspect-video rounded-md border border-border bg-[radial-gradient(circle_at_25%_20%,rgba(56,214,107,0.22),transparent_28%),linear-gradient(135deg,#101711,#050706_55%,#18120a)] p-4">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-live px-3 py-1 text-xs font-bold uppercase text-white">
                    Live
                  </span>
                  <span className="rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-foreground">
                    1.2K watching
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-gold">
                    Featured stream
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    Front nine with special guests
                  </h2>
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {["Live chat", "Media hub", "Social links"].map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-border bg-surface-soft px-4 py-3 text-sm font-medium text-muted"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
