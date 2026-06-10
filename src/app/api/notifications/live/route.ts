import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/auth/permissions";
import { getCurrentUser } from "@/lib/auth/session";
import { sendPushNotification } from "@/lib/notifications/send";

export async function POST() {
  const user = await getCurrentUser();

  if (!user || !hasPermission(user.roles, "canGoLive")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await sendPushNotification({
    type: "live",
    title: "Golf N Ganja is live",
    message: `${user.name ?? "The creator"} just went live.`,
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
