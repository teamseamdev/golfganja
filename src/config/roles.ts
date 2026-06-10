export const roles = [
  "viewer",
  "creator",
  "moderator",
  "admin",
  "owner",
] as const;

export const permissions = [
  "canGoLive",
  "canViewCreatorDashboard",
  "canViewAdmin",
  "canManageUsers",
  "canManageStreams",
  "canModerateChat",
  "canSendNotifications",
  "canManageContent",
] as const;
