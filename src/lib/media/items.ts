import "server-only";

import type { MediaItem, MediaType } from "@/types/media";
import { getDb } from "@/lib/firebase/admin";

type CreateMediaItemInput = {
  type: MediaType;
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string | null;
  mediaUrl?: string | null;
  creatorId: string;
  creatorName?: string | null;
  published?: boolean;
  featured?: boolean;
};

export async function listMediaItems(limit = 24) {
  const db = getDb();

  if (!db) {
    return [];
  }

  const snapshot = await db
    .collection("media")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => doc.data() as MediaItem);
}

export async function createMediaItem(input: CreateMediaItemInput) {
  const db = getDb();

  if (!db) {
    throw new Error("Firestore is not configured");
  }

  const now = new Date().toISOString();
  const ref = db.collection("media").doc();
  const item: MediaItem = {
    id: ref.id,
    type: input.type,
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category.trim() || "General",
    thumbnailUrl: input.thumbnailUrl?.trim() || null,
    mediaUrl: input.mediaUrl?.trim() || null,
    creatorId: input.creatorId,
    creatorName: input.creatorName,
    published: Boolean(input.published),
    featured: Boolean(input.featured),
    createdAt: now,
    updatedAt: now,
  };

  await ref.set(item);

  return item;
}
