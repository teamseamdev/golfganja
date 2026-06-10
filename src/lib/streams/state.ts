import "server-only";

import type { StreamState } from "@/types/stream";
import { getDb } from "@/lib/firebase/admin";

const defaultStreamTitle = "Golf N Ganja Live";
const defaultStreamCategory = "Golf";

export function getFallbackStreamState(roomName: string): StreamState {
  return {
    roomName,
    title: defaultStreamTitle,
    category: defaultStreamCategory,
    status: "offline",
    creatorName: null,
    startedAt: null,
    endedAt: null,
    viewerCount: 0,
    updatedAt: new Date().toISOString(),
  };
}

export async function getStreamState(roomName: string) {
  const db = getDb();

  if (!db) {
    return getFallbackStreamState(roomName);
  }

  const snapshot = await db.collection("streams").doc(roomName).get();

  if (!snapshot.exists) {
    return getFallbackStreamState(roomName);
  }

  return {
    ...getFallbackStreamState(roomName),
    ...(snapshot.data() as Partial<StreamState>),
    roomName,
  };
}

export async function listRecentStreams(limit = 10) {
  const db = getDb();

  if (!db) {
    return [];
  }

  const snapshot = await db
    .collection("streams")
    .orderBy("updatedAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({
    ...getFallbackStreamState(doc.id),
    ...(doc.data() as Partial<StreamState>),
    roomName: doc.id,
  }));
}

export async function startStreamState({
  roomName,
  title,
  category,
  creatorId,
  creatorName,
}: {
  roomName: string;
  title: string;
  category: string;
  creatorId: string;
  creatorName?: string | null;
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Firestore is not configured");
  }

  const now = new Date().toISOString();
  const state: StreamState = {
    roomName,
    title: title.trim() || defaultStreamTitle,
    category: category.trim() || defaultStreamCategory,
    status: "live",
    creatorId,
    creatorName,
    startedAt: now,
    endedAt: null,
    viewerCount: 1,
    updatedAt: now,
  };

  await db.collection("streams").doc(roomName).set(state, { merge: true });

  return state;
}

export async function endStreamState(roomName: string) {
  const db = getDb();

  if (!db) {
    throw new Error("Firestore is not configured");
  }

  const now = new Date().toISOString();

  await db.collection("streams").doc(roomName).set(
    {
      status: "ended",
      endedAt: now,
      updatedAt: now,
    },
    { merge: true },
  );

  return getStreamState(roomName);
}
