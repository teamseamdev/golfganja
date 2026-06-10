import "server-only";

import { getDb } from "@/lib/firebase/admin";
import { defaultLiveRoomName } from "@/lib/livekit/rooms";
import { getStreamState } from "@/lib/streams/state";

export type AnalyticsSummary = {
  currentStreamStatus: string;
  featuredMedia: number;
  liveStartedAt?: string | null;
  publishedMedia: number;
  pushSubscribers: number;
  totalMedia: number;
  totalNotifications: number;
  totalStreams: number;
  totalUsers: number;
};

async function collectionCount(collectionName: string) {
  const db = getDb();

  if (!db) {
    return 0;
  }

  const snapshot = await db.collection(collectionName).count().get();

  return snapshot.data().count;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const db = getDb();
  const stream = await getStreamState(defaultLiveRoomName);

  if (!db) {
    return {
      currentStreamStatus: stream.status,
      featuredMedia: 0,
      liveStartedAt: stream.startedAt,
      publishedMedia: 0,
      pushSubscribers: 0,
      totalMedia: 0,
      totalNotifications: 0,
      totalStreams: 0,
      totalUsers: 0,
    };
  }

  const [totalUsers, totalMedia, totalStreams, totalNotifications, pushSubscribers] =
    await Promise.all([
      collectionCount("users"),
      collectionCount("media"),
      collectionCount("streams"),
      collectionCount("notifications"),
      collectionCount("pushSubscriptions"),
    ]);
  const mediaSnapshot = await db.collection("media").limit(200).get();
  const media = mediaSnapshot.docs.map((doc) => doc.data());

  return {
    currentStreamStatus: stream.status,
    featuredMedia: media.filter((item) => item.featured).length,
    liveStartedAt: stream.startedAt,
    publishedMedia: media.filter((item) => item.published).length,
    pushSubscribers,
    totalMedia,
    totalNotifications,
    totalStreams,
    totalUsers,
  };
}
