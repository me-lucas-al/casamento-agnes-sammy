import { describe, expect, it } from "vitest";
import type { Message } from "../../types";
import { maskMessageForViewer } from "../privacy/mask-message-for-viewer";

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
