import "server-only";

import { AccessToken } from "livekit-server-sdk";
import type { LiveRole } from "@/types/live";
import { getLiveKitConfig } from "@/lib/livekit/config";

type CreateLiveTokenInput = {
  identity: string;
  name: string;
  roomName: string;
  role: LiveRole;
};

export async function createLiveKitToken({
  identity,
  name,
  roomName,
  role,
}: CreateLiveTokenInput) {
  const { apiKey, apiSecret } = getLiveKitConfig();
  const token = new AccessToken(apiKey, apiSecret, {
    identity,
    name,
    ttl: "6h",
  });

  token.addGrant({
    room: roomName,
    roomJoin: true,
    canSubscribe: true,
    canPublish: role === "creator",
    canPublishData: true,
  });

  return token.toJwt();
}
