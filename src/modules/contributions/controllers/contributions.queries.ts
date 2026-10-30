import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { getPaymentModule } from "@/modules/payments/factory";
import { parsePageParams } from "@/shared/lib/pagination";
import type { SearchParams } from "@/shared/lib/url-params";
import { getContributionModule } from "../factory";
import { parsePaymentsFilters } from "../schemas/payments-filters.schema";
import { guardedQuery } from "@/shared/lib/guarded-query";

export async function getGiftAvailabilityQuery(giftId: string) {
  return guardedQuery("getGiftAvailabilityQuery", async () => {
    const actor = await getSessionUser();
    return getContributionModule().getGiftAvailability(actor, giftId);
  });
}

export async function listMyContributionsQuery() {
  return guardedQuery("listMyContributionsQuery", async () => {
    const actor = await getSessionUser();
    return getContributionModule().listMyContributions(actor);
  });
}

export async function listPendingPaymentsQuery(searchParams: SearchParams) {
  return guardedQuery("listPendingPaymentsQuery", async () => {
    const actor = await getSessionUser();
    const pageParams = parsePageParams(searchParams);
    const filters = parsePaymentsFilters(searchParams);
    return getContributionModule().listPendingPayments(actor, { ...pageParams, ...filters });
  });
}

export async function getPaymentScreenQuery(contributionId: string) {
  return guardedQuery("getPaymentScreenQuery", async () => {
    const actor = await getSessionUser();
    const contribution = await getContributionModule().getReservationForPayment(
      actor,
      contributionId,
    );
    const payment = await getPaymentModule().getPixPaymentDetails(actor, contribution.amountCents);
    return { contribution, payment };
  });
}
