import { describe, expect, it } from "vitest";
import { removeAccessCodeFromUrl } from "../remove-access-code-from-url";

describe("removeAccessCodeFromUrl", () => {
  it("drops the code and keeps the path", () => {
    expect(removeAccessCodeFromUrl("https://site.test/?codigo=K7M2QX9P")).toBe("/");
  });

  it("keeps the other params and the hash", () => {
    expect(removeAccessCodeFromUrl("https://site.test/?aba=noivos&codigo=K7M2QX9P#x")).toBe("/?aba=noivos#x");
  });

  it("returns null when there is no code", () => {
    expect(removeAccessCodeFromUrl("https://site.test/?aba=noivos")).toBeNull();
  });
});
