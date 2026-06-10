import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import { createLiveKitToken } from "@/lib/livekit/tokens";
import { normalizeRoomName } from "@/lib/livekit/rooms";
import type { LiveRole, LiveTokenRequest } from "@/types/live";

function isLiveRole(value: unknown): value is LiveRole {
  return value === "viewer" || value === "creator";
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.banned) {
    return NextResponse.json({ error: "User is banned" }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as LiveTokenRequest | null;
  const role = isLiveRole(body?.role) ? body.role : "viewer";
  const roomName = normalizeRoomName(body?.roomName);

  if (role === "creator" && !hasPermission(user.roles, "canGoLive")) {
    return NextResponse.json(
      { error: "Creator permission required" },
      { status: 403 },
    );
  }

  const token = await createLiveKitToken({
    identity: user.id,
    name: user.name ?? "Golf N Ganja member",
    roomName,
    role,
  });

  return NextResponse.json({
    token,
    url: process.env.LIVEKIT_URL,
    roomName,
    role,
  });
}
