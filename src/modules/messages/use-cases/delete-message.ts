import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { MessageNotFoundError } from "../errors";
import type { MessageRepository } from "../repositories/contracts/message-repository";

type Dependencies = { messageRepository: MessageRepository };

export function makeDeleteMessage({ messageRepository }: Dependencies) {
  return async function deleteMessage(actor: SessionUser | null, messageId: string): Promise<void> {
    requireRole(actor, ["admin", "couple"]);
    const message = await messageRepository.remove(messageId);
    if (!message) throw new MessageNotFoundError();
  };
}
