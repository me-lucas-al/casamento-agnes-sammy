import { describe, expect, it } from "vitest";
import { FakeLogger } from "@/tests/helpers/fake-logger";
import { createRedirectError } from "@/tests/helpers/next-control-flow-errors";
import { createGuardedQuery } from "./guarded-query";

describe("guardedQuery", () => {
  it("returns the query value", async () => {
    const guardedQuery = createGuardedQuery(new FakeLogger());
    expect(await guardedQuery("q", async () => 42)).toBe(42);
  });

  it("logs unexpected failures and propagates the original error", async () => {
    const logger = new FakeLogger();
    const failure = new Error("db exploded");
    await expect(
      createGuardedQuery(logger)("listThings", async () => {
        throw failure;
      }),
    ).rejects.toBe(failure);
    expect(logger.errors()[0]).toMatchObject({ event: "query.failed", context: { query: "listThings" } });
  });

  it("propagates control flow errors without logging", async () => {
    const logger = new FakeLogger();
    const redirectError = createRedirectError();
    await expect(
      createGuardedQuery(logger)("q", async () => {
        throw redirectError;
      }),
    ).rejects.toBe(redirectError);
    expect(logger.entries).toEqual([]);
  });
});
