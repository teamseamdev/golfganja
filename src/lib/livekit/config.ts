import "server-only";

export function getLiveKitConfig() {
  const url = process.env.LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!url || !apiKey || !apiSecret) {
    throw new Error("LiveKit environment variables are not configured.");
  }

  return {
    url,
    apiKey,
    apiSecret,
  };
}
