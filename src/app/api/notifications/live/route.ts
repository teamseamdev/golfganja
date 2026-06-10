import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import { sendPushNotification } from "@/lib/notifications/send";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user || !hasPermission(user.roles, "canGoLive")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    title?: string;
  } | null;
  const creatorName = user.name ?? "Golf N Ganja";
  const streamTitle = body?.title?.trim();
  const result = await sendPushNotification({
    type: "live",
    title: streamTitle ? `${creatorName} is live: ${streamTitle}` : `${creatorName} is live`,
    message: "Tap to watch the Golf N Ganja livestream.",
    url: "/live",
  });

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({
    success: true,
    sent: result.sent,
    failed: result.failed,
  });
}
