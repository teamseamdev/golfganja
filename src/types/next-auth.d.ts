import type { DefaultSession } from "next-auth";
import type { Role } from "@/types/roles";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      discordId: string;
      roles: Role[];
      banned?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discordId?: string;
    roles?: Role[];
    banned?: boolean;
  }
}
