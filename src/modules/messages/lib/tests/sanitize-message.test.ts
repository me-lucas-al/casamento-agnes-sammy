import { describe, expect, it } from "vitest";
import { InvalidMessageError } from "@/modules/messages/errors";
import { MAX_BODY_LENGTH, sanitizeMessage } from "../sanitize-message";

describe("sanitizeMessage", () => {
  it("trims body and collapses author name whitespace", () => {
    expect(sanitizeMessage({ authorName: "  Ana   Maria ", body: "  Parabéns!  " })).toEqual({
      authorName: "Ana Maria",
      body: "Parabéns!",
    });
  });

  it("normalizes line breaks and limits blank lines", () => {
    const result = sanitizeMessage({ authorName: "Ana", body: "a\r\n\r\n\r\n\r\nb" });

    expect(result.body).toBe("a\n\nb");
  });

  it("removes control characters", () => {
    const result = sanitizeMessage({ authorName: "An\u0000a", body: "o\u0007i" });

    expect(result).toEqual({ authorName: "Ana", body: "oi" });
  });

  it("rejects empty or whitespace-only values", () => {
    expect(() => sanitizeMessage({ authorName: "Ana", body: "   " })).toThrow(InvalidMessageError);
    expect(() => sanitizeMessage({ authorName: "  ", body: "oi" })).toThrow(InvalidMessageError);
  });

  it("accepts exactly the maximum body and rejects one more", () => {
    const authorName = "Ana";

    expect(() => sanitizeMessage({ authorName, body: "a".repeat(MAX_BODY_LENGTH) })).not.toThrow();
    expect(() => sanitizeMessage({ authorName, body: "a".repeat(MAX_BODY_LENGTH + 1) })).toThrow(
      InvalidMessageError,
    );
  });
});
