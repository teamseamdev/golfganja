import { NextResponse } from "next/server";
import { normalizeRoomName } from "@/lib/livekit/rooms";
import { getStreamState } from "@/lib/streams/state";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const roomName = normalizeRoomName(url.searchParams.get("roomName"));
  const stream = await getStreamState(roomName);

  return NextResponse.json({ stream });
}
