"use client";

import { Bell } from "lucide-react";
import { getToken, onMessage } from "firebase/messaging";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { getFirebaseMessagingClient } from "@/lib/firebase/client";

export function PushNotificationButton() {
  const { data: session, status } = useSession();
  const initialized = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupForegroundListener() {
      const messaging = await getFirebaseMessagingClient();

      if (!messaging) {
        return;
      }

      onMessage(messaging, (payload) => {
        console.log("Foreground notification", payload);
      });

      if (
        Notification.permission === "granted" ||
        localStorage.getItem("notifications-enabled") === "true"
      ) {
        setEnabled(true);
        setHidden(true);
      }
    }

    setupForegroundListener();
  }, []);

  async function enablePush() {
    try {
      setError(null);

      if (initialized.current) {
        setEnabled(true);
        setHidden(true);
        return;
      }

      const messaging = await getFirebaseMessagingClient();
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

      if (!messaging || !vapidKey) {
        setError("Push notifications are not configured yet.");
        return;
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setError("Notification permission was not granted.");
        return;
      }

      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
        ),
      });

      if (!token) {
        setError("Could not create a notification token.");
        return;
      }

      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        setError("Could not save notification subscription.");
        return;
      }

      localStorage.setItem("notifications-enabled", "true");
      initialized.current = true;
      setEnabled(true);
      setTimeout(() => setHidden(true), 800);
    } catch (err) {
      console.error(err);
      setError("Push notifications failed to initialize.");
    }
  }

  if (status !== "authenticated" || !session?.user || hidden) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-lg border border-border bg-surface p-3 shadow-2xl shadow-black/50">
      <button
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-black text-black transition hover:bg-gold"
        type="button"
        onClick={enablePush}
      >
        <Bell size={17} />
        {enabled ? "Notifications enabled" : "Enable notifications"}
      </button>
      {error ? <p className="mt-2 text-center text-xs text-muted">{error}</p> : null}
    </div>
  );
}
