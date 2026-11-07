import { describe, expect, it } from "vitest";
import type { GuestRsvp } from "../../types";
import { maskGuestRsvpForViewer } from "../privacy/mask-guest-rsvp-for-viewer";

describe("maskGuestRsvpForViewer", () => {
  it("masks the guest name and hides companions' names and every dietary note", () => {
    const guestRsvp: GuestRsvp = {
      guestId: "guest-1",
      guestName: "Maria Souza Lima",
      seats: 3,
      status: "going",
      dietaryNote: "Alergia a amendoim",
      respondedAt: null,
      companions: [{ name: "João Souza", dietaryNote: "Vegano" }],
    };
    expect(maskGuestRsvpForViewer(guestRsvp)).toEqual({
      ...guestRsvp,
      guestName: "Maria L.",
      dietaryNote: null,
      companions: [{ name: "Acompanhante", dietaryNote: null }],
    });
  });
});
