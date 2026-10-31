import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { buildPageResult, type PageParams, type PageResult } from "@/shared/lib/pagination/pagination";
import type { ContributionRepository } from "@/modules/contributions/repositories/contracts/contribution-repository";
import type { PaymentSort, PaymentStatusFilter, PendingPaymentRow } from "@/modules/contributions/types";

type Dependencies = { contributionRepository: ContributionRepository };

type Input = PageParams & { status: PaymentStatusFilter; search: string; sort: PaymentSort };

export function makeListPendingPayments({ contributionRepository }: Dependencies) {
  return async function listPendingPayments(
    actor: SessionUser | null,
    { page, perPage, offset, status, search, sort }: Input,
  ): Promise<PageResult<PendingPaymentRow>> {
    requireRole(actor, ["admin", "couple"]);
    const { items, total } = await contributionRepository.listPendingPage({
      limit: perPage,
      offset,
      status,
      search,
      sort,
    });
    return buildPageResult({ items, total, page, perPage });
  };
}
