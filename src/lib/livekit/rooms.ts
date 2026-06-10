const roomNamePattern = /^[a-z0-9][a-z0-9-]{2,63}$/;

export const defaultLiveRoomName = "golf-n-ganja-live";

export function normalizeRoomName(value?: string | null) {
  const roomName = value?.trim().toLowerCase() || defaultLiveRoomName;

  if (!roomNamePattern.test(roomName)) {
    throw new Error(
      "Room names must be 3-64 lowercase letters, numbers, or hyphens.",
    );
  }

  return roomName;
}
