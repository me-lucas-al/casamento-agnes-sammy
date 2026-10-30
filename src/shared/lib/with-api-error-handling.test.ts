import { describe, expect, it } from "vitest";
import { z } from "zod";
import { FakeLogger } from "@/tests/helpers/fake-logger";
import { createRedirectError } from "@/tests/helpers/next-control-flow-errors";
import { ApiError } from "./api-errors";
import { createApiErrorHandling } from "./with-api-error-handling";

const request = new Request("http://localhost/api/test");

describe("withApiErrorHandling", () => {
  function setup() {
    const logger = new FakeLogger();
    return { logger, wrap: createApiErrorHandling(logger) };
  }

  async function readBody(response: Response) {
    return (await response.json()) as { error: { code: string; message: string } };
  }

  it("passes successful responses through", async () => {
    const { wrap } = setup();
    const response = await wrap("ok", async () => Response.json({ fine: true }))(request);
    expect(response.status).toBe(200);
  });

  it.each([
    ["unauthorized", 401],
    ["forbidden", 403],
    ["not_found", 404],
    ["conflict", 409],
    ["rate_limited", 429],
  ] as const)("answers %s with status %i and the standard body", async (code, status) => {
    const { wrap, logger } = setup();
    const response = await wrap("route", async () => {
      throw new ApiError(code);
    })(request);
    expect(response.status).toBe(status);
    expect((await readBody(response)).error.code).toBe(code);
    expect(logger.entries).toEqual([]);
  });

  it("answers invalid input with 400", async () => {
    const { wrap } = setup();
    const response = await wrap("route", async () => {
      z.object({ name: z.string() }).parse({});
      return Response.json({});
    })(request);
    expect(response.status).toBe(400);
    expect((await readBody(response)).error.message).toBe("Dados inválidos.");
  });

  it("answers database outages with 503 and logs without leaking details", async () => {
    const { wrap, logger } = setup();
    const response = await wrap("route", async () => {
      throw Object.assign(new Error("connect ECONNREFUSED 10.1.2.3:5432"), { code: "ECONNREFUSED" });
    })(request);
    const body = await readBody(response);
    expect(response.status).toBe(503);
    expect(JSON.stringify(body)).not.toContain("10.1.2.3");
    expect(logger.errors()).toHaveLength(1);
  });

  it("answers unknown errors with 500, logs them and hides the stack", async () => {
    const { wrap, logger } = setup();
    const response = await wrap("route", async () => {
      throw new Error("secret internal failure");
    })(request);
    const text = JSON.stringify(await readBody(response));
    expect(response.status).toBe(500);
    expect(text).not.toContain("secret internal failure");
    expect(logger.errors()[0].context.route).toBe("route");
  });

  it("rethrows Next control flow errors", async () => {
    const { wrap } = setup();
    const redirectError = createRedirectError();
    await expect(
      wrap("route", async () => {
        throw redirectError;
      })(request),
    ).rejects.toBe(redirectError);
  });
});
