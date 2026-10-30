import { count, eq } from "drizzle-orm";
import { messages, photos } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";

type PendingModeration = { pendingMessages: number; pendingPhotos: number };

export async function readPendingModeration(database: Database): Promise<PendingModeration> {
  const [[messageRow], [photoRow]] = await Promise.all([
    database.select({ total: count() }).from(messages).where(eq(messages.status, "pending")),
    database.select({ total: count() }).from(photos).where(eq(photos.status, "pending")),
  ]);
  return { pendingMessages: messageRow?.total ?? 0, pendingPhotos: photoRow?.total ?? 0 };
}
