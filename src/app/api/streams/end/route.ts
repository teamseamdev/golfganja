import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import { normalizeRoomName } from "@/lib/livekit/rooms";
import { endStreamState } from "@/lib/streams/state";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || !hasPermission(user.roles, "canGoLive")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    roomName?: string;
  } | null;
  const roomName = normalizeRoomName(body?.roomName);
  const stream = await endStreamState(roomName);

  return NextResponse.json({ stream });
}
