import { describe, expect, it } from "vitest";
import { FakeLogger } from "@/tests/helpers/fake-logger";
import { createRedirectError } from "@/tests/helpers/next-control-flow-errors";
import { createLoggedFallback } from "../logged-fallback";

describe("withLoggedFallback", () => {
  it("returns the operation value", async () => {
    const withLoggedFallback = createLoggedFallback(new FakeLogger());
    expect(await withLoggedFallback("e", null, async () => "ok")).toBe("ok");
  });

  it("logs the failure and returns the fallback", async () => {
    const logger = new FakeLogger();
    const value = await createLoggedFallback(logger)("query.broken", false, async () => {
      throw new Error("db down");
    });
    expect(value).toBe(false);
    expect(logger.errors()[0]).toMatchObject({ event: "query.broken" });
  });

  it("rethrows control flow errors without logging", async () => {
    const logger = new FakeLogger();
    const redirectError = createRedirectError();
    await expect(
      createLoggedFallback(logger)("e", null, async () => {
        throw redirectError;
      }),
    ).rejects.toBe(redirectError);
    expect(logger.entries).toEqual([]);
  });
});
