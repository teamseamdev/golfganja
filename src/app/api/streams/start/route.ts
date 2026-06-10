import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import { normalizeRoomName } from "@/lib/livekit/rooms";
import { startStreamState } from "@/lib/streams/state";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || !hasPermission(user.roles, "canGoLive")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    roomName?: string;
    title?: string;
    category?: string;
  } | null;
  const roomName = normalizeRoomName(body?.roomName);
  const title = body?.title?.trim() || "Golf N Ganja Live";
  const category = body?.category?.trim() || "Golf";

  const stream = await startStreamState({
    roomName,
    title,
    category,
    creatorId: user.id,
    creatorName: user.name,
  });

  return NextResponse.json({ stream });
}
