import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { buildPageResult, type PageParams, type PageResult } from "@/shared/lib/pagination";
import type { MessageRepository } from "../repositories/message-repository";
import type { Message, ModerationStatus } from "../types";

type Dependencies = { messageRepository: MessageRepository };

type Input = PageParams & { status: ModerationStatus | undefined };

export function makeListMessagesPage({ messageRepository }: Dependencies) {
  return async function listMessagesPage(
    actor: SessionUser | null,
    { page, perPage, offset, status }: Input,
  ): Promise<PageResult<Message>> {
    requireRole(actor, ["admin", "couple"]);
    const { items, total } = await messageRepository.listPage({ limit: perPage, offset, status });
    return buildPageResult({ items, total, page, perPage });
  };
}
