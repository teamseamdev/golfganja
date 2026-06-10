"use client";

import { useState } from "react";
import { roles as allRoles } from "@/config/roles";
import type { Role } from "@/types/roles";
import type { AppUser } from "@/types/user";

export function AdminUsersPanel({
  currentUserId,
  currentUserRoles,
  initialUsers,
}: {
  currentUserId: string;
  currentUserRoles: Role[];
  initialUsers: AppUser[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [message, setMessage] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const isOwner = currentUserRoles.includes("owner");

  async function updateUser(
    appUser: AppUser,
    updates: { banned?: boolean; roles?: Role[] },
  ) {
    setLoadingId(appUser.id);
    setMessage(null);

    const response = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: appUser.id, ...updates }),
    });
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
      user?: AppUser;
    } | null;

    if (!response.ok || !payload?.user) {
      setMessage(payload?.error ?? "Could not update user.");
      setLoadingId(null);
      return;
    }

    setUsers((current) =>
      current.map((user) => (user.id === payload.user!.id ? payload.user! : user)),
    );
    setMessage("User updated.");
    setLoadingId(null);
  }

  return (
    <section className="mt-8 rounded-lg border border-border bg-surface p-5">
      <h2 className="text-xl font-semibold">Users</h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        Manage app roles for the small internal team and ban access when needed.
        Only owners can grant or remove admin access.
      </p>

      {message ? <p className="mt-4 text-sm text-muted">{message}</p> : null}

      <div className="mt-5 grid gap-3">
        {users.length ? (
          users.map((appUser) => (
            <div
              key={appUser.id}
              className="rounded-md border border-border bg-background p-4"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <h3 className="text-lg font-semibold">{appUser.displayName}</h3>
                  <p className="mt-1 text-sm text-muted">{appUser.discordId}</p>
                  <p className="mt-2 text-xs text-muted">
                    Last seen {new Date(appUser.lastSeenAt).toLocaleString()}
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {allRoles.map((role) => {
                      const active = appUser.roles.includes(role);
                      const isProtectedRole = role === "admin" || role === "owner";
                      const isSelfOwnerRole =
                        appUser.id === currentUserId && role === "owner" && active;
                      const canChangeRole =
                        (!isProtectedRole || isOwner) && !isSelfOwnerRole;
                      const requestedRoles = active
                        ? appUser.roles.filter((item) => item !== role)
                        : [...appUser.roles, role];
                      const nextRoles = requestedRoles.length
                        ? requestedRoles
                        : (["viewer"] as Role[]);

                      return (
                        <button
                          key={role}
                          className={`min-h-9 rounded-full px-3 text-xs font-black uppercase transition disabled:opacity-60 ${
                            active
                              ? "bg-primary text-black"
                              : "bg-surface-soft text-muted hover:text-foreground"
                          }`}
                          type="button"
                          disabled={loadingId === appUser.id || !canChangeRole}
                          title={
                            !canChangeRole
                              ? isSelfOwnerRole
                                ? "You cannot remove your own owner role."
                                : "Only owners can change this role."
                              : undefined
                          }
                          onClick={() => updateUser(appUser, { roles: nextRoles })}
                        >
                          {role}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    className={`min-h-10 rounded-full px-4 text-sm font-black transition disabled:opacity-60 lg:justify-self-end ${
                      appUser.banned
                        ? "bg-live text-white"
                        : "border border-live/60 text-live hover:bg-live hover:text-white"
                    }`}
                    type="button"
                    disabled={loadingId === appUser.id || appUser.id === currentUserId}
                    title={
                      appUser.id === currentUserId
                        ? "You cannot ban your own account."
                        : undefined
                    }
                    onClick={() => updateUser(appUser, { banned: !appUser.banned })}
                  >
                    {appUser.banned ? "Banned" : "Ban user"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted">No users found yet.</p>
        )}
      </div>
    </section>
  );
}
