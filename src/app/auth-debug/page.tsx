import { getCurrentSession } from "@/lib/auth/session";

export default async function AuthDebugPage() {
  const session = await getCurrentSession();

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-3xl rounded-lg border border-border bg-surface p-6">
        <p className="text-sm font-semibold uppercase text-primary">
          Auth debug
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Session status</h1>
        <pre className="mt-6 overflow-auto rounded-md border border-border bg-black/40 p-4 text-sm text-muted">
          {JSON.stringify(
            {
              authenticated: Boolean(session?.user),
              user: session?.user
                ? {
                    id: session.user.id,
                    discordId: session.user.discordId,
                    name: session.user.name,
                    email: session.user.email,
                    roles: session.user.roles,
                    banned: session.user.banned,
                  }
                : null,
            },
            null,
            2,
          )}
        </pre>
      </div>
    </main>
  );
}
