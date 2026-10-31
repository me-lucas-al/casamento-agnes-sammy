import { describe, expect, it } from "vitest";
import { GiftUnavailableError, InvalidAmountError, InvalidQuotasError } from "@/modules/contributions/errors";
import type { GiftCommitment, ReservableGift } from "@/modules/contributions/types";
import { calculateAvailability } from "@/modules/contributions/lib/availability/gift-availability";
import { resolveReservation } from "../resolve-reservation";

const baseGift: ReservableGift = {
  id: "gift-1",
  name: "Presente",
  description: "",
  imageUrl: null, productUrl: null, storeName: null,
  priceCents: 30000,
  mode: "single",
  totalQuotas: null,
  minAmountCents: null,
  isVisible: true,
};

const nothingCommitted: GiftCommitment = {
  committedQuotas: 0,
  committedAmountCents: 0,
  committedCount: 0,
};

const quotaGift: ReservableGift = { ...baseGift, mode: "fixed_quotas", totalQuotas: 3 };
const freeGift: ReservableGift = { ...baseGift, mode: "free_amount", minAmountCents: 5000 };

describe("calculateAvailability", () => {
  it("marks a single gift complete once anything is committed", () => {
    const commitment = { ...nothingCommitted, committedCount: 1, committedAmountCents: 30000 };

    expect(calculateAvailability(baseGift, commitment).isComplete).toBe(true);
    expect(calculateAvailability(baseGift, nothingCommitted).isComplete).toBe(false);
  });

  it("counts remaining quotas", () => {
    const commitment = { committedQuotas: 2, committedAmountCents: 20000, committedCount: 1 };

    expect(calculateAvailability(quotaGift, commitment)).toMatchObject({
      remainingQuotas: 1,
      isComplete: false,
    });
  });

  it("counts remaining amount for free amount gifts", () => {
    const commitment = { committedQuotas: 0, committedAmountCents: 30000, committedCount: 2 };

    expect(calculateAvailability(freeGift, commitment)).toMatchObject({
      remainingAmountCents: 0,
      isComplete: true,
    });
  });
});

describe("resolveReservation", () => {
  it("charges the full price for single gifts", () => {
    expect(resolveReservation(baseGift, nothingCommitted, {})).toEqual({
      quotas: null,
      amountCents: 30000,
    });
  });

  it("rejects a complete gift", () => {
    const commitment = { ...nothingCommitted, committedCount: 1 };

    expect(() => resolveReservation(baseGift, commitment, {})).toThrow(GiftUnavailableError);
  });

  it("defaults to one quota and sums quota prices exactly", () => {
    const gift = { ...quotaGift, priceCents: 10000 };

    expect(resolveReservation(gift, nothingCommitted, {})).toEqual({ quotas: 1, amountCents: 3334 });
    expect(resolveReservation(gift, nothingCommitted, { quotas: 3 })).toEqual({
      quotas: 3,
      amountCents: 10000,
    });
  });

  it("keeps the sum of all quotas equal to the price", () => {
    const gift = { ...quotaGift, priceCents: 10000 };
    const commitment = { committedQuotas: 2, committedAmountCents: 6667, committedCount: 2 };

    expect(resolveReservation(gift, commitment, { quotas: 1 })).toEqual({
      quotas: 1,
      amountCents: 3333,
    });
  });

  it.each([0, -1, 1.5, 4])("rejects %s quotas", (quotas) => {
    expect(() => resolveReservation(quotaGift, nothingCommitted, { quotas })).toThrow(
      InvalidQuotasError,
    );
  });

  it("accepts a free amount between minimum and remaining", () => {
    expect(resolveReservation(freeGift, nothingCommitted, { amountCents: 5000 })).toEqual({
      quotas: null,
      amountCents: 5000,
    });
  });

  it.each([undefined, 0, 4999, 30001, 50.5])("rejects free amount %s", (amountCents) => {
    expect(() => resolveReservation(freeGift, nothingCommitted, { amountCents })).toThrow(
      InvalidAmountError,
    );
  });

  it("allows a final amount below the minimum when that is all that remains", () => {
    const commitment = { committedQuotas: 0, committedAmountCents: 27000, committedCount: 2 };

    expect(resolveReservation(freeGift, commitment, { amountCents: 3000 })).toEqual({
      quotas: null,
      amountCents: 3000,
    });
  });
});
