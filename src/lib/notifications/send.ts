import "server-only";

import { getMessaging } from "firebase-admin/messaging";
import { getDb } from "@/lib/firebase/admin";

type SendPushNotificationInput = {
  type: "broadcast" | "live";
  title: string;
  message: string;
  url?: string;
};

export async function sendPushNotification({
  type,
  title,
  message,
  url = "/live",
}: SendPushNotificationInput) {
  const db = getDb();

  if (!db) {
    return {
      error: "Firestore is not configured",
      status: 503,
    };
  }

  const snapshot = await db.collection("pushSubscriptions").get();
  const tokens = snapshot.docs.map((doc) => doc.id).filter(Boolean);

  if (!tokens.length) {
    return {
      error: "No subscriptions",
      status: 400,
    };
  }

  const response = await getMessaging().sendEachForMulticast({
    tokens,
    data: {
      title,
      body: message,
      url,
    },
    webpush: {
      headers: {
        Urgency: "high",
      },
    },
  });

  await Promise.all(
    response.responses.map(async (result, index) => {
      if (!result.success) {
        await db.collection("pushSubscriptions").doc(tokens[index]).delete();
      }
    }),
  );

  await db.collection("notifications").add({
    type,
    title,
    message,
    url,
    sent: response.successCount,
    failed: response.failureCount,
    createdAt: new Date().toISOString(),
  });

  return {
    success: true,
    sent: response.successCount,
    failed: response.failureCount,
    status: 200,
  };
}
