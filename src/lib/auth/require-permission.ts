import "server-only";

import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import type { Permission } from "@/types/roles";

export async function requirePermission(permission: Permission) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.banned || !hasPermission(user.roles, permission)) {
    redirect("/");
  }

  return user;
}
