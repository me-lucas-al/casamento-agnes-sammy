import { describe, expect, it } from "vitest";
import { maskRsvpItemForViewer } from "../privacy/mask-rsvp-item-for-viewer";

describe("maskRsvpItemForViewer", () => {
  it("masks only the guest name", () => {
    const item = {
      guestId: "guest-1",
      guestName: "Maria Souza Lima",
      seats: 2,
      status: "going" as const,
      companionsCount: 1,
      respondedAt: null,
    };
    expect(maskRsvpItemForViewer(item)).toEqual({ ...item, guestName: "Maria L." });
  });
});
