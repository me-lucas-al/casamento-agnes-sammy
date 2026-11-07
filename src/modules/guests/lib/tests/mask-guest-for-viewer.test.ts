import { describe, expect, it } from "vitest";
import type { GuestListItem } from "../../types";
import { maskGuestForViewer } from "../privacy/mask-guest-for-viewer";

const guest: GuestListItem = {
  id: "guest-1",
  code: "K7M2QX9P",
  name: "Maria Souza Lima",
  phone: "11987654321",
  email: "maria@example.com",
  profileCompletedAt: null,
  seats: 2,
  createdBy: "user-1",
  lastAccessAt: null,
  createdAt: new Date("2026-01-01T00:00:00Z"),
  rsvpStatus: "going",
};

describe("maskGuestForViewer", () => {
  it("masks name, code, phone and email and keeps the rest", () => {
    expect(maskGuestForViewer(guest)).toEqual({
      ...guest,
      name: "Maria L.",
      code: "K7••••9P",
      phone: "•••••••••21",
      email: "m••••@example.com",
    });
  });

  it("keeps empty contacts empty", () => {
    expect(maskGuestForViewer({ ...guest, phone: null, email: null })).toMatchObject({ phone: null, email: null });
  });
});
