import { splitCentsIntoQuotas } from "@/shared/lib/money";
import { GiftUnavailableError, InvalidAmountError, InvalidQuotasError } from "@/modules/contributions/errors";
import type {
  GiftCommitment,
  ReservableGift,
  ReservationAmounts,
  ReservationRequest,
} from "@/modules/contributions/types";
import { calculateAvailability } from "../availability/gift-availability";

type AmountRequest = Pick<ReservationRequest, "quotas" | "amountCents">;

function resolveQuotas(
  gift: ReservableGift,
  commitment: GiftCommitment,
  request: AmountRequest,
): ReservationAmounts {
  const { remainingQuotas } = calculateAvailability(gift, commitment);
  const quotas = request.quotas ?? 1;
  if (!Number.isInteger(quotas) || quotas < 1 || quotas > (remainingQuotas ?? 0)) {
    throw new InvalidQuotasError(remainingQuotas ?? 0);
  }
  const quotaPrices = splitCentsIntoQuotas(gift.priceCents, gift.totalQuotas ?? 0);
  const start = commitment.committedQuotas;
  const amountCents = quotaPrices.slice(start, start + quotas).reduce((sum, cents) => sum + cents, 0);
  return { quotas, amountCents };
}

function resolveFreeAmount(
  gift: ReservableGift,
  commitment: GiftCommitment,
  request: AmountRequest,
): ReservationAmounts {
  const { remainingAmountCents } = calculateAvailability(gift, commitment);
  const minimumCents = Math.min(gift.minAmountCents ?? 1, remainingAmountCents);
  const { amountCents } = request;
  const isValid =
    amountCents !== undefined &&
    Number.isInteger(amountCents) &&
    amountCents >= minimumCents &&
    amountCents <= remainingAmountCents;
  if (!isValid) throw new InvalidAmountError(minimumCents, remainingAmountCents);
  return { quotas: null, amountCents };
}

export function resolveReservation(
  gift: ReservableGift,
  commitment: GiftCommitment,
  request: AmountRequest,
): ReservationAmounts {
  if (calculateAvailability(gift, commitment).isComplete) throw new GiftUnavailableError();
  if (gift.mode === "single") return { quotas: null, amountCents: gift.priceCents };
  if (gift.mode === "fixed_quotas") return resolveQuotas(gift, commitment, request);
  return resolveFreeAmount(gift, commitment, request);
}
