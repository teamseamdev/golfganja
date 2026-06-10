export type StreamStatus = "offline" | "live" | "ended";

export type StreamState = {
  roomName: string;
  title: string;
  category: string;
  status: StreamStatus;
  creatorId?: string;
  creatorName?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
  viewerCount?: number;
  updatedAt: string;
};
