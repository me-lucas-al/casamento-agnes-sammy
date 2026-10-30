import { and, count, desc, eq } from "drizzle-orm";
import { messages } from "@/shared/db/schema";
import type { Database } from "@/shared/db/types";
import type { MessageRepository } from "./message-repository";

export function createDrizzleMessageRepository(database: Database): MessageRepository {
  return {
    async create(newMessage) {
      const [message] = await database.insert(messages).values(newMessage).returning();
      return message;
    },
    async countPendingByGuest(guestId) {
      const [row] = await database
        .select({ total: count() })
        .from(messages)
        .where(and(eq(messages.guestId, guestId), eq(messages.status, "pending")));
      return row?.total ?? 0;
    },
    async updateStatus(messageId, status) {
      const [message] = await database
        .update(messages)
        .set({ status })
        .where(eq(messages.id, messageId))
        .returning();
      return message ?? null;
    },
    async updateContent(messageId, edit) {
      const [message] = await database
        .update(messages)
        .set(edit)
        .where(eq(messages.id, messageId))
        .returning();
      return message ?? null;
    },
    async remove(messageId) {
      const [message] = await database.delete(messages).where(eq(messages.id, messageId)).returning();
      return message ?? null;
    },
    async listPage({ limit, offset, status }) {
      const filter = status ? eq(messages.status, status) : undefined;
      const [items, [totalRow]] = await Promise.all([
        database.select().from(messages).where(filter).orderBy(desc(messages.createdAt)).limit(limit).offset(offset),
        database.select({ total: count() }).from(messages).where(filter),
      ]);
      return { items, total: totalRow?.total ?? 0 };
    },
  };
}
