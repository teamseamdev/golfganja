import type { Role } from "@/types/roles";

export type AppUser = {
  id: string;
  discordId: string;
  displayName: string;
  email?: string | null;
  avatarUrl?: string | null;
  roles: Role[];
  banned: boolean;
  mutedUntil?: string | null;
  createdAt: string;
  updatedAt: string;
  lastSeenAt: string;
};
