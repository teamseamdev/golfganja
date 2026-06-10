import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import { createMediaItem, listMediaItems } from "@/lib/media/items";
import type { MediaType } from "@/types/media";

const mediaTypes = new Set(["clip", "podcast", "video", "vod"]);

function isMediaType(value: unknown): value is MediaType {
  return typeof value === "string" && mediaTypes.has(value);
}

export async function GET() {
  const items = await listMediaItems();

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || !hasPermission(user.roles, "canManageContent")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    type?: string;
    title?: string;
    description?: string;
    category?: string;
    thumbnailUrl?: string;
    mediaUrl?: string;
    published?: boolean;
    featured?: boolean;
  } | null;

  if (!isMediaType(body?.type)) {
    return NextResponse.json({ error: "Invalid media type" }, { status: 400 });
  }

  if (!body?.title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const item = await createMediaItem({
    type: body.type,
    title: body.title,
    description: body.description ?? "",
    category: body.category ?? "General",
    thumbnailUrl: body.thumbnailUrl,
    mediaUrl: body.mediaUrl,
    creatorId: user.id,
    creatorName: user.name,
    published: body.published,
    featured: body.featured,
  });

  return NextResponse.json({ item });
}
