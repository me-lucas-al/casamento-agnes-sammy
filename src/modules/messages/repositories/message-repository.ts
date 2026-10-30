import type {
  Message,
  MessageEdit,
  MessageListPage,
  MessageListQuery,
  ModerationStatus,
  NewMessage,
} from "../types";

export interface MessageRepository {
  create(newMessage: NewMessage): Promise<Message>;
  countPendingByGuest(guestId: string): Promise<number>;
  updateStatus(messageId: string, status: ModerationStatus): Promise<Message | null>;
  updateContent(messageId: string, edit: MessageEdit): Promise<Message | null>;
  remove(messageId: string): Promise<Message | null>;
  listPage(query: MessageListQuery): Promise<MessageListPage>;
}
