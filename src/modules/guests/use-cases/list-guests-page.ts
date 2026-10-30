import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { buildPageResult, type PageParams, type PageResult } from "@/shared/lib/pagination";
import type { GuestRepository } from "../repositories/guest-repository";
import type { GuestListItem, GuestSort } from "../types";

type Dependencies = { guestRepository: GuestRepository };

type Input = PageParams & { search: string; sort: GuestSort };

export function makeListGuestsPage({ guestRepository }: Dependencies) {
  return async function listGuestsPage(
    actor: SessionUser | null,
    { page, perPage, offset, search, sort }: Input,
  ): Promise<PageResult<GuestListItem>> {
    requireRole(actor, ["admin", "couple"]);
    const { items, total } = await guestRepository.listPage({ limit: perPage, offset, search, sort });
    return buildPageResult({ items, total, page, perPage });
  };
}
