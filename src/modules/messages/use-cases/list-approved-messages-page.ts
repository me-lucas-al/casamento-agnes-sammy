import { requireRole } from "@/modules/auth/authorization";
import { isViewer } from "@/modules/auth/lib/is-viewer";
import { GUEST_AREA_READER_ROLES } from "@/modules/auth/role-groups";
import type { SessionUser } from "@/modules/auth/types";
import { approvedMessagesTag } from "@/shared/lib/cache/cache-tags";
import type { CachedReader } from "@/shared/lib/cache/cached-read";
import { buildPageResult, type PageParams, type PageResult } from "@/shared/lib/pagination/pagination";
import { maskPublicMessageForViewer } from "../lib/privacy/mask-message-for-viewer";
import type { MessageRepository } from "../repositories/contracts/message-repository";
import type { PublicMessage } from "../types";

type Dependencies = { messageRepository: MessageRepository; cachedReader: CachedReader };

export function makeListApprovedMessagesPage({ messageRepository, cachedReader }: Dependencies) {
  return async function listApprovedMessagesPage(
    actor: SessionUser | null,
    { page, perPage, offset }: PageParams,
  ): Promise<PageResult<PublicMessage>> {
    const user = requireRole(actor, GUEST_AREA_READER_ROLES);
    const cacheOptions = {
      keyParts: ["messages", "approved", String(page), String(perPage)],
      tags: [approvedMessagesTag()],
    };
    const cachedPage = await cachedReader.read(cacheOptions, async () => {
      const { items, total } = await messageRepository.listPage({ limit: perPage, offset, status: "approved" });
      const publicItems = items.map(({ id, authorName, body, createdAt }) => ({
        id,
        authorName,
        body,
        createdAt: createdAt.toISOString(),
      }));
      return buildPageResult({ items: publicItems, total, page, perPage });
    });
    if (!isViewer(user)) return cachedPage;
    return { ...cachedPage, items: cachedPage.items.map(maskPublicMessageForViewer) };
  };
}
