import { requireRole } from "@/modules/auth/authorization";
import { isViewer } from "@/modules/auth/lib/is-viewer";
import { PANEL_READER_ROLES } from "@/modules/auth/role-groups";
import type { SessionUser } from "@/modules/auth/types";
import { buildPageResult, type PageParams, type PageResult } from "@/shared/lib/pagination/pagination";
import { maskRsvpItemForViewer } from "../lib/privacy/mask-rsvp-item-for-viewer";
import type { RsvpRepository } from "../repositories/contracts/rsvp-repository";
import type { RsvpListItem, RsvpStatus } from "../types";

type Dependencies = { rsvpRepository: RsvpRepository };

type Input = PageParams & { status: RsvpStatus | undefined; search: string };

export function makeListRsvpsPage({ rsvpRepository }: Dependencies) {
  return async function listRsvpsPage(
    actor: SessionUser | null,
    { page, perPage, offset, status, search }: Input,
  ): Promise<PageResult<RsvpListItem>> {
    const user = requireRole(actor, PANEL_READER_ROLES);
    const effectiveSearch = isViewer(user) ? "" : search;
    const { items, total } = await rsvpRepository.listPage({ limit: perPage, offset, status, search: effectiveSearch });
    const visibleItems = isViewer(user) ? items.map(maskRsvpItemForViewer) : items;
    return buildPageResult({ items: visibleItems, total, page, perPage });
  };
}
