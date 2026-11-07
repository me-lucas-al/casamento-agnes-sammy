import { describe, expect, it } from "vitest";
import { maskPaymentForViewer } from "../privacy/mask-payment-for-viewer";
import type { PendingPaymentRow } from "../../types";

describe("maskPaymentForViewer", () => {
  it("masks only the guest name", () => {
    const payment = { id: "contribution-1", giftName: "Air fryer", guestName: "Maria Souza Lima" } as PendingPaymentRow;
    expect(maskPaymentForViewer(payment)).toEqual({ ...payment, guestName: "Maria L." });
  });
});
