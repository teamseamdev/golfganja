export type MediaType = "clip" | "podcast" | "video" | "vod";

export type MediaItem = {
  id: string;
  type: MediaType;
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string | null;
  mediaUrl?: string | null;
  creatorId: string;
  creatorName?: string | null;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};
