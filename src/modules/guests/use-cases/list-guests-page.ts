import { requireRole } from "@/modules/auth/authorization";
import { isViewer } from "@/modules/auth/lib/is-viewer";
import { PANEL_READER_ROLES } from "@/modules/auth/role-groups";
import type { SessionUser } from "@/modules/auth/types";
import { buildPageResult, type PageParams, type PageResult } from "@/shared/lib/pagination/pagination";
import { maskGuestForViewer } from "../lib/privacy/mask-guest-for-viewer";
import type { GuestRepository } from "../repositories/contracts/guest-repository";
import type { GuestListItem, GuestSort } from "../types";

type Dependencies = { guestRepository: GuestRepository };

type Input = PageParams & { search: string; sort: GuestSort };

export function makeListGuestsPage({ guestRepository }: Dependencies) {
  return async function listGuestsPage(
    actor: SessionUser | null,
    { page, perPage, offset, search, sort }: Input,
  ): Promise<PageResult<GuestListItem>> {
    const user = requireRole(actor, PANEL_READER_ROLES);
    const isReadOnlyVisitor = isViewer(user);
    const effectiveSearch = isReadOnlyVisitor ? "" : search;
    const { items, total } = await guestRepository.listPage({ limit: perPage, offset, search: effectiveSearch, sort });
    const visibleItems = isReadOnlyVisitor ? items.map(maskGuestForViewer) : items;
    return buildPageResult({ items: visibleItems, total, page, perPage });
  };
}
