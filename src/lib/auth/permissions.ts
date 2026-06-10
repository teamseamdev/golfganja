import type { Permission, Role } from "@/types/roles";

const rolePermissions: Record<Role, Permission[]> = {
  viewer: [],
  creator: ["canGoLive", "canViewCreatorDashboard", "canManageContent"],
  moderator: ["canModerateChat"],
  admin: [
    "canViewAdmin",
    "canManageUsers",
    "canManageStreams",
    "canModerateChat",
    "canSendNotifications",
    "canManageContent",
  ],
  owner: [
    "canGoLive",
    "canViewCreatorDashboard",
    "canViewAdmin",
    "canManageUsers",
    "canManageStreams",
    "canModerateChat",
    "canSendNotifications",
    "canManageContent",
  ],
};

export function getPermissionsForRoles(userRoles: Role[]): Permission[] {
  return Array.from(
    new Set(userRoles.flatMap((role) => rolePermissions[role] ?? [])),
  );
}

export function hasPermission(
  userRoles: Role[],
  permission: Permission,
): boolean {
  return getPermissionsForRoles(userRoles).includes(permission);
}
