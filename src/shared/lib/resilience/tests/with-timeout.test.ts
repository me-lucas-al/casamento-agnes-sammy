import { describe, expect, it } from "vitest";
import { TimeoutError, withTimeout } from "../with-timeout";

describe("withTimeout", () => {
  it("resolves with the operation result", async () => {
    await expect(withTimeout(Promise.resolve("ok"), 50)).resolves.toBe("ok");
  });

  it("rejects when the operation is slower than the limit", async () => {
    const slowOperation = new Promise<string>((resolve) => setTimeout(() => resolve("late"), 200));
    await expect(withTimeout(slowOperation, 20)).rejects.toBeInstanceOf(TimeoutError);
  });

  it("propagates operation errors", async () => {
    await expect(withTimeout(Promise.reject(new Error("boom")), 50)).rejects.toThrow("boom");
  });
});
