import { DiscordSignInButton } from "@/components/auth/DiscordSignInButton";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getCurrentSession();
  const { error } = await searchParams;

  if (session?.user && !error) {
    redirect("/live");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 text-foreground">
      <section className="w-full max-w-md rounded-lg border border-border bg-surface p-6">
        <p className="text-sm font-semibold uppercase text-primary">Sign in</p>
        <h1 className="mt-2 text-3xl font-semibold">Join Golf N Ganja</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Discord authentication will be connected in the auth milestone.
        </p>
        {error ? (
          <div className="mt-5 rounded-md border border-live/40 bg-live/10 p-3 text-sm text-foreground">
            Discord sign-in failed: {error}
          </div>
        ) : null}
        <DiscordSignInButton />
      </section>
    </main>
  );
}
