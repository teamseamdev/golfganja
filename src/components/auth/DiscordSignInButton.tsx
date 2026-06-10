"use client";

import { signIn } from "next-auth/react";

export function DiscordSignInButton() {
  return (
    <button
      className="mt-6 w-full rounded-full bg-primary px-5 py-3 text-sm font-bold text-black transition hover:bg-gold"
      type="button"
      onClick={() => signIn("discord", { callbackUrl: "/live" })}
    >
      Continue with Discord
    </button>
  );
}
