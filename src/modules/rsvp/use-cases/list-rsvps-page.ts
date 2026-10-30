import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { buildPageResult, type PageParams, type PageResult } from "@/shared/lib/pagination";
import type { RsvpRepository } from "../repositories/rsvp-repository";
import type { RsvpListItem, RsvpStatus } from "../types";

type Dependencies = { rsvpRepository: RsvpRepository };

type Input = PageParams & { status: RsvpStatus | undefined; search: string };

export function makeListRsvpsPage({ rsvpRepository }: Dependencies) {
  return async function listRsvpsPage(
    actor: SessionUser | null,
    { page, perPage, offset, status, search }: Input,
  ): Promise<PageResult<RsvpListItem>> {
    requireRole(actor, ["admin", "couple"]);
    const { items, total } = await rsvpRepository.listPage({ limit: perPage, offset, status, search });
    return buildPageResult({ items, total, page, perPage });
  };
}
