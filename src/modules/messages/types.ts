import type { messages } from "./schema";

export type Message = typeof messages.$inferSelect;

export type ModerationStatus = Message["status"];

export const MODERATION_STATUSES = ["pending", "approved", "rejected"] as const;

export type ModerationDecision = "approved" | "rejected";

export type PublicMessage = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type NewMessage = {
  guestId: string;
  authorName: string;
  body: string;
};

export type MessageListQuery = {
  limit: number;
  offset: number;
  status: ModerationStatus | undefined;
};

export type MessageListPage = {
  items: Message[];
  total: number;
};

export type MessageEdit = {
  authorName: string;
  body: string;
};
