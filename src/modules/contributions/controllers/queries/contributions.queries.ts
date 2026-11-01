import { getSessionUser } from "@/modules/auth/controllers/session/get-session-user";
import type { SessionUser } from "@/modules/auth/types";
import { describePaymentError } from "@/modules/payments/errors";
import { getPaymentModule } from "@/modules/payments/factory";
import { parsePageParams } from "@/shared/lib/pagination/pagination";
import type { SearchParams } from "@/shared/lib/url/url-params";
import { getContributionModule } from "@/modules/contributions/factory";
import { parsePaymentsFilters } from "@/modules/contributions/schemas/payments-filters.schema";
import { guardedQuery } from "@/shared/lib/resilience/guarded-query";

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

export async function isPixConfiguredQuery(): Promise<boolean> {
  return guardedQuery("isPixConfiguredQuery", () => getContributionModule().isPixConfigured());
}

async function loadPixPayment(actor: SessionUser | null, amountCents: number) {
  try {
    const payment = await getPaymentModule().getPixPaymentDetails(actor, amountCents);
    return { payment, paymentErrorMessage: null };
  } catch (error) {
    return { payment: null, paymentErrorMessage: describePaymentError(error) };
  }
}

export async function getPaymentScreenQuery(contributionId: string) {
  return guardedQuery("getPaymentScreenQuery", async () => {
    const actor = await getSessionUser();
    const contribution = await getContributionModule().getReservationForPayment(
      actor,
      contributionId,
    );
    const payment = await loadPixPayment(actor, contribution.amountCents);
    return { contribution, ...payment };
  });
}
