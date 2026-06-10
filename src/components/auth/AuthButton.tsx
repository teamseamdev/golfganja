"use client";

import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton({ onAction }: { onAction?: () => void }) {
  const { data: session, status } = useSession();
  const signedIn = Boolean(session?.user);

  if (status === "loading") {
    return (
      <button
        className="inline-flex min-h-10 items-center justify-center rounded-full border border-border px-4 text-sm font-bold text-muted"
        type="button"
        disabled
      >
        Loading
      </button>
    );
  }

  return (
    <button
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-bold text-foreground transition hover:border-primary hover:text-primary"
      type="button"
      onClick={() => {
        onAction?.();

        if (signedIn) {
          signOut({ callbackUrl: "/" });
          return;
        }

        signIn("discord", { callbackUrl: "/live" });
      }}
    >
      {signedIn ? <LogOut size={16} /> : <LogIn size={16} />}
      {signedIn ? "Sign out" : "Sign in"}
    </button>
  );
}
