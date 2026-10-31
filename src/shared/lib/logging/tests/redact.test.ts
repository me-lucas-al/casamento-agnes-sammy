import { describe, expect, it } from "vitest";
import { maskSensitiveValue, redactContext, scrubSensitiveText } from "../redact";

describe("redact", () => {
  it("masks long values keeping only a short prefix", () => {
    expect(maskSensitiveValue("K7M2QX9P")).toBe("K7***");
  });

  it("fully masks short values", () => {
    expect(maskSensitiveValue("abc")).toBe("***");
  });

  it("masks context values under sensitive keys", () => {
    const redacted = redactContext({ guestCode: "K7M2QX9P", email: "ana@example.com", route: "cron" });
    expect(redacted).toEqual({ guestCode: "K7***", email: "an***", route: "cron" });
  });

  it("scrubs emails embedded in free text", () => {
    expect(scrubSensitiveText("failed for ana.silva@example.com now")).toBe("failed for an*** now");
  });

  it("scrubs database key-value details", () => {
    const text = "duplicate key Key (code)=(K7M2QX9P) already exists";
    expect(scrubSensitiveText(text)).toBe("duplicate key Key (code)=(K7***) already exists");
  });
});
