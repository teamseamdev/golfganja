import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import { listUsers, updateUserAdminFields } from "@/lib/firebase/users";
import { roles as allowedRoles } from "@/config/roles";
import type { Role } from "@/types/roles";

function normalizeRoles(value: unknown): Role[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const normalized = value.filter((role): role is Role =>
    (allowedRoles as readonly string[]).includes(String(role)),
  );

  return normalized.length ? normalized : ["viewer"];
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user || !hasPermission(user.roles, "canManageUsers")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await listUsers();

  return NextResponse.json({ users });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();

  if (!user || !hasPermission(user.roles, "canManageUsers")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    banned?: boolean;
    roles?: unknown;
    userId?: string;
  } | null;
  const userId = body?.userId?.trim();

  if (!userId) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  const updatedUser = await updateUserAdminFields({
    userId,
    banned: body?.banned,
    roles: normalizeRoles(body?.roles),
  });

  return NextResponse.json({ user: updatedUser });
}
