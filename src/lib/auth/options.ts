import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { upsertUserFromDiscord } from "@/lib/firebase/users";
import type { Role } from "@/types/roles";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile && "id" in profile) {
        const discordProfile = profile as {
          id: string;
          global_name?: string | null;
          username?: string | null;
        };
        const discordId = String(profile.id);
        const displayName =
          token.name ??
          discordProfile.global_name ??
          discordProfile.username ??
          "Golf N Ganja member";

        const appUser = await upsertUserFromDiscord({
          discordId,
          displayName,
          email: token.email,
          avatarUrl: token.picture,
        });

        token.sub = appUser.id;
        token.discordId = appUser.discordId;
        token.roles = appUser.roles;
        token.banned = appUser.banned;
      }

      token.roles = token.roles ?? (["viewer"] satisfies Role[]);
      token.banned = token.banned ?? false;

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.discordId = token.discordId ?? "";
        session.user.roles = token.roles ?? ["viewer"];
        session.user.banned = token.banned ?? false;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
