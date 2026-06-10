import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import { getUserById, listUsers, updateUserAdminFields } from "@/lib/firebase/users";
import { roles as allowedRoles } from "@/config/roles";
import type { Role } from "@/types/roles";

const protectedRoles = ["admin", "owner"] satisfies Role[];

function normalizeRoles(value: unknown): Role[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const normalized = value.filter((role): role is Role =>
    (allowedRoles as readonly string[]).includes(String(role)),
  );

  return normalized.length ? normalized : ["viewer"];
}

function hasProtectedRoleChange(currentRoles: Role[], nextRoles: Role[]) {
  return protectedRoles.some(
    (role) => currentRoles.includes(role) !== nextRoles.includes(role),
  );
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

  const targetUser = await getUserById(userId);
  const normalizedRoles = normalizeRoles(body?.roles);

  if (normalizedRoles && targetUser) {
    const actorIsOwner = user.roles.includes("owner");

    if (hasProtectedRoleChange(targetUser.roles, normalizedRoles) && !actorIsOwner) {
      return NextResponse.json(
        { error: "Only owners can change admin or owner roles." },
        { status: 403 },
      );
    }

    if (
      user.id === userId &&
      targetUser.roles.includes("owner") &&
      !normalizedRoles.includes("owner")
    ) {
      return NextResponse.json(
        { error: "You cannot remove your own owner role." },
        { status: 400 },
      );
    }
  }

  if (user.id === userId && typeof body?.banned === "boolean" && body.banned) {
    return NextResponse.json(
      { error: "You cannot ban your own account." },
      { status: 400 },
    );
  }

  const updatedUser = await updateUserAdminFields({
    userId,
    banned: body?.banned,
    roles: normalizedRoles,
  });

  return NextResponse.json({ user: updatedUser });
}
