import { describe, expect, it } from "vitest";
import type { GiftReservationView, ReservableGift } from "../types";
import { describeAvailability } from "./describe-availability";

const gift: ReservableGift = {
  id: "g",
  name: "Presente",
  description: "",
  imageUrl: null,
  priceCents: 10000,
  mode: "single",
  totalQuotas: null,
  minAmountCents: null,
  isVisible: true,
};

function view(overrides: Partial<ReservableGift>, remainingQuotas: number | null, isComplete = false) {
  const result: GiftReservationView = {
    gift: { ...gift, ...overrides },
    availability: { isComplete, remainingQuotas, remainingAmountCents: 4000, committedQuotas: 0 },
  };
  return result;
}

describe("describeAvailability", () => {
  it("describes each mode without donor information", () => {
    expect(describeAvailability(view({}, null))).toBe("Disponível");
    expect(describeAvailability(view({ mode: "fixed_quotas", totalQuotas: 4 }, 3))).toBe(
      "3 de 4 cotas disponíveis",
    );
    expect(describeAvailability(view({ mode: "free_amount" }, null))).toContain("Faltam");
    expect(describeAvailability(view({}, null, true))).toBe("Presente completo");
  });
});
