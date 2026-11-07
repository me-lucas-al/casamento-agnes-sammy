import { requireRole } from "@/modules/auth/authorization";
import { isViewer } from "@/modules/auth/lib/is-viewer";
import { PANEL_READER_ROLES } from "@/modules/auth/role-groups";
import type { SessionUser } from "@/modules/auth/types";
import { buildPageResult, type PageParams, type PageResult } from "@/shared/lib/pagination/pagination";
import { maskPaymentForViewer } from "@/modules/contributions/lib/privacy/mask-payment-for-viewer";
import type { ContributionRepository } from "@/modules/contributions/repositories/contracts/contribution-repository";
import type { PaymentSort, PaymentStatusFilter, PendingPaymentRow } from "@/modules/contributions/types";

type Dependencies = { contributionRepository: ContributionRepository };

type Input = PageParams & { status: PaymentStatusFilter; search: string; sort: PaymentSort };

export function makeListPendingPayments({ contributionRepository }: Dependencies) {
  return async function listPendingPayments(
    actor: SessionUser | null,
    { page, perPage, offset, status, search, sort }: Input,
  ): Promise<PageResult<PendingPaymentRow>> {
    const user = requireRole(actor, PANEL_READER_ROLES);
    const { items, total } = await contributionRepository.listPendingPage({
      limit: perPage,
      offset,
      status,
      search,
      sort,
    });
    const visibleItems = isViewer(user) ? items.map(maskPaymentForViewer) : items;
    return buildPageResult({ items: visibleItems, total, page, perPage });
  };
}
