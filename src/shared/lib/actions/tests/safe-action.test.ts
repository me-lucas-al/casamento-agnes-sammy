import { describe, expect, it } from "vitest";
import { FakeLogger } from "@/tests/helpers/fakes/fake-logger";
import { createNotFoundError, createRedirectError } from "@/tests/helpers/fakes/next-control-flow-errors";
import { success } from "../result";
import { createSafeAction } from "../safe-action";

class KnownBusinessError extends Error {}

function describeTestError(error: unknown): string {
  if (error instanceof KnownBusinessError) return "Regra de negócio violada.";
  return "Não foi possível concluir a operação.";
}

describe("safeAction", () => {
  function setup() {
    const logger = new FakeLogger();
    return { logger, safeAction: createSafeAction(logger) };
  }

  it("returns the operation result untouched", async () => {
    const { safeAction } = setup();
    const result = await safeAction(describeTestError, async () => success({ id: "1" }));
    expect(result).toEqual({ ok: true, data: { id: "1" } });
  });

  it("maps business errors to the pt-BR message without logging", async () => {
    const { safeAction, logger } = setup();
    const result = await safeAction(describeTestError, async () => {
      throw new KnownBusinessError("internal detail");
    });
    expect(result).toEqual({ ok: false, error: "Regra de negócio violada." });
    expect(logger.entries).toEqual([]);
  });

  it("logs unknown errors and returns the generic message without leaking details", async () => {
    const { safeAction, logger } = setup();
    const result = await safeAction(
      describeTestError,
      async () => {
        throw new Error("connection to 10.0.0.5 refused for ana@example.com");
      },
      "createThing",
    );
    expect(result).toEqual({ ok: false, error: "Não foi possível concluir a operação." });
    const [entry] = logger.errors();
    expect(entry.event).toBe("action.unexpected_error");
    expect(entry.context.action).toBe("createThing");
    expect(JSON.stringify(entry.context)).not.toContain("ana@example.com");
  });

  it("rethrows redirect errors", async () => {
    const { safeAction, logger } = setup();
    const redirectError = createRedirectError();
    await expect(
      safeAction(describeTestError, async () => {
        throw redirectError;
      }),
    ).rejects.toBe(redirectError);
    expect(logger.entries).toEqual([]);
  });

  it("rethrows notFound errors", async () => {
    const { safeAction } = setup();
    const notFoundError = createNotFoundError();
    await expect(
      safeAction(describeTestError, async () => {
        throw notFoundError;
      }),
    ).rejects.toBe(notFoundError);
  });
});
