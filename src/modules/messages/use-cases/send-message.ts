import { requireRole } from "@/modules/auth/authorization";
import { ForbiddenError } from "@/modules/auth/errors";
import type { SessionUser } from "@/modules/auth/types";
import { MAX_PENDING_MESSAGES_PER_GUEST, TooManyPendingMessagesError } from "../errors";
import { sanitizeMessage } from "../lib/sanitize-message";
import type { MessageRepository } from "../repositories/contracts/message-repository";
import type { Message, MessageEdit } from "../types";

type Dependencies = { messageRepository: MessageRepository };

export function makeSendMessage({ messageRepository }: Dependencies) {
  return async function sendMessage(actor: SessionUser | null, input: MessageEdit): Promise<Message> {
    const user = requireRole(actor, ["guest"]);
    if (!user.guestId) throw new ForbiddenError();
    const cleanMessage = sanitizeMessage(input);
    const pendingCount = await messageRepository.countPendingByGuest(user.guestId);
    if (pendingCount >= MAX_PENDING_MESSAGES_PER_GUEST) throw new TooManyPendingMessagesError();
    return messageRepository.create({ guestId: user.guestId, ...cleanMessage });
  };
}
