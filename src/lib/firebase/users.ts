import "server-only";

import type { AppUser } from "@/types/user";
import type { Role } from "@/types/roles";
import { getDb } from "@/lib/firebase/admin";

type DiscordUserInput = {
  discordId: string;
  displayName: string;
  email?: string | null;
  avatarUrl?: string | null;
};

function parseIdList(value?: string) {
  return new Set(
    value
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) ?? [],
  );
}

function getBootstrapRoles(discordId: string): Role[] {
  const ownerIds = parseIdList(process.env.INITIAL_OWNER_DISCORD_IDS);
  const creatorIds = parseIdList(process.env.INITIAL_CREATOR_DISCORD_IDS);

  if (ownerIds.has(discordId)) {
    return ["owner"];
  }

  if (creatorIds.has(discordId)) {
    return ["creator"];
  }

  return ["viewer"];
}

export async function upsertUserFromDiscord(
  input: DiscordUserInput,
): Promise<AppUser> {
  const now = new Date().toISOString();
  const fallbackRoles = getBootstrapRoles(input.discordId);
  const fallbackUser: AppUser = {
    id: `discord:${input.discordId}`,
    discordId: input.discordId,
    displayName: input.displayName,
    email: input.email,
    avatarUrl: input.avatarUrl,
    roles: fallbackRoles,
    banned: false,
    mutedUntil: null,
    createdAt: now,
    updatedAt: now,
    lastSeenAt: now,
  };

  const db = getDb();

  if (!db) {
    return fallbackUser;
  }

  try {
    const ref = db.collection("users").doc(fallbackUser.id);
    const snapshot = await ref.get();
    const existing = snapshot.exists ? snapshot.data() : null;
    const roles = (existing?.roles as Role[] | undefined) ?? fallbackRoles;

    const user: AppUser = {
      ...fallbackUser,
      roles,
      banned: Boolean(existing?.banned),
      mutedUntil: (existing?.mutedUntil as string | null | undefined) ?? null,
      createdAt: (existing?.createdAt as string | undefined) ?? now,
    };

    await ref.set(
      {
        ...user,
        updatedAt: now,
        lastSeenAt: now,
      },
      { merge: true },
    );

    return user;
  } catch (error) {
    console.warn(
      "Firestore user sync failed. Falling back to env-based auth roles.",
      error,
    );

    return fallbackUser;
  }
}

export async function getUserByDiscordId(discordId: string) {
  const db = getDb();

  if (!db) {
    return null;
  }

  const snapshot = await db.collection("users").doc(`discord:${discordId}`).get();

  if (!snapshot.exists) {
    return null;
  }

  return snapshot.data() as AppUser;
}
