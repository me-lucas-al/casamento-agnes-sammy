import { describe, expect, it } from "vitest";
import type { Message } from "../../types";
import { maskMessageForViewer, maskPublicMessageForViewer } from "../privacy/mask-message-for-viewer";

describe("maskMessageForViewer", () => {
  it("masks only the author name", () => {
    const message: Message = {
      id: "message-1",
      guestId: "guest-1",
      authorName: "Maria Souza Lima",
      body: "Parabéns!",
      status: "pending",
      contributionId: null,
      createdAt: new Date("2026-01-01T00:00:00Z"),
    };
    expect(maskMessageForViewer(message)).toEqual({ ...message, authorName: "Maria L." });
  });
});

describe("maskPublicMessageForViewer", () => {
  it("masks only the author name of an approved message", () => {
    const message = { id: "message-1", authorName: "Maria Souza Lima", body: "Parabéns!", createdAt: "2026-01-01T00:00:00.000Z" };
    expect(maskPublicMessageForViewer(message)).toEqual({ ...message, authorName: "Maria L." });
  });
});
