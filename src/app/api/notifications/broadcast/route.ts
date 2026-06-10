import { NextResponse } from "next/server";
import { getMessaging } from "firebase-admin/messaging";
import { hasPermission } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import { getDb } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || !hasPermission(user.roles, "canSendNotifications")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    title?: string;
    message?: string;
    url?: string;
  } | null;
  const title = body?.title?.trim();
  const message = body?.message?.trim();
  const url = body?.url?.trim() || "/live";

  if (!title || !message) {
    return NextResponse.json(
      { error: "Missing title or message" },
      { status: 400 },
    );
  }

  const db = getDb();

  if (!db) {
    return NextResponse.json(
      { error: "Firestore is not configured" },
      { status: 503 },
    );
  }

  const snapshot = await db.collection("pushSubscriptions").get();
  const tokens = snapshot.docs.map((doc) => doc.id).filter(Boolean);

  if (!tokens.length) {
    return NextResponse.json({ error: "No subscriptions" }, { status: 400 });
  }

  const response = await getMessaging().sendEachForMulticast({
    tokens,
    notification: {
      title,
      body: message,
    },
    data: {
      url,
    },
    webpush: {
      headers: {
        Urgency: "high",
      },
      notification: {
        icon: "/favicon.ico",
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
    type: "broadcast",
    title,
    message,
    url,
    sent: response.successCount,
    failed: response.failureCount,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    sent: response.successCount,
    failed: response.failureCount,
  });
}
