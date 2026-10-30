import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { MessageNotFoundError } from "../errors";
import { sanitizeMessage } from "../lib/sanitize-message";
import type { MessageRepository } from "../repositories/message-repository";
import type { Message, MessageEdit } from "../types";

type Dependencies = { messageRepository: MessageRepository };

export function makeUpdateMessage({ messageRepository }: Dependencies) {
  return async function updateMessage(
    actor: SessionUser | null,
    input: MessageEdit & { messageId: string },
  ): Promise<Message> {
    requireRole(actor, ["admin", "couple"]);
    const cleanMessage = sanitizeMessage(input);
    const message = await messageRepository.updateContent(input.messageId, cleanMessage);
    if (!message) throw new MessageNotFoundError();
    return message;
  };
}
