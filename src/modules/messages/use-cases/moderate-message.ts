import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { MessageNotFoundError } from "../errors";
import type { MessageRepository } from "../repositories/contracts/message-repository";
import type { Message, ModerationDecision } from "../types";

type Dependencies = { messageRepository: MessageRepository };

export function makeModerateMessage({ messageRepository }: Dependencies) {
  return async function moderateMessage(
    actor: SessionUser | null,
    input: { messageId: string; decision: ModerationDecision },
  ): Promise<Message> {
    requireRole(actor, ["admin", "couple"]);
    const message = await messageRepository.updateStatus(input.messageId, input.decision);
    if (!message) throw new MessageNotFoundError();
    return message;
  };
}
