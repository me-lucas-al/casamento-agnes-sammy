import type { photos } from "./schema";

export type Photo = typeof photos.$inferSelect;

export type PhotoStatus = Photo["status"];

export const PHOTO_SORTS = ["newest", "oldest"] as const;

export type PhotoSort = (typeof PHOTO_SORTS)[number];

export const PHOTO_STATUSES = ["pending", "approved", "rejected"] as const;

export type NewPhoto = {
  cloudinaryPublicId: string;
  url: string;
  caption?: string | null;
  uploadedByUserId?: string | null;
  uploadedByGuestId?: string | null;
  status: PhotoStatus;
};

export type PublicPhoto = {
  id: string;
  url: string;
  caption: string | null;
};

export type ApprovedPhotosQuery = {
  limit: number;
  offset: number;
  sort: PhotoSort;
};

export type PanelPhotosQuery = {
  limit: number;
  offset: number;
  status?: PhotoStatus;
};

export type PhotoListPage<Item> = {
  items: Item[];
  total: number;
};
