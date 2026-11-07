import { requireRole } from "@/modules/auth/authorization";
import { isViewer } from "@/modules/auth/lib/is-viewer";
import { PANEL_READER_ROLES } from "@/modules/auth/role-groups";
import type { SessionUser } from "@/modules/auth/types";
import { buildPageResult, type PageParams, type PageResult } from "@/shared/lib/pagination/pagination";
import { maskMessageForViewer } from "../lib/privacy/mask-message-for-viewer";
import type { MessageRepository } from "../repositories/contracts/message-repository";
import type { Message, ModerationStatus } from "../types";

type Dependencies = { messageRepository: MessageRepository };

type Input = PageParams & { status: ModerationStatus | undefined };

export function makeListMessagesPage({ messageRepository }: Dependencies) {
  return async function listMessagesPage(
    actor: SessionUser | null,
    { page, perPage, offset, status }: Input,
  ): Promise<PageResult<Message>> {
    const user = requireRole(actor, PANEL_READER_ROLES);
    const { items, total } = await messageRepository.listPage({ limit: perPage, offset, status });
    const visibleItems = isViewer(user) ? items.map(maskMessageForViewer) : items;
    return buildPageResult({ items: visibleItems, total, page, perPage });
  };
}
