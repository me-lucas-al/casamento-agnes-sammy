import { describe, expect, it } from "vitest";
import { z } from "zod";
import { ApiError } from "./api-errors";
import { classifyApiError } from "./classify-api-error";
import { TimeoutError } from "./with-timeout";

describe("classifyApiError", () => {
  it("maps explicit api errors to their own code", () => {
    expect(classifyApiError(new ApiError("conflict"))).toBe("conflict");
    expect(classifyApiError(new ApiError("not_found"))).toBe("not_found");
  });

  it("maps zod errors to invalid_input", () => {
    const parsed = z.string().safeParse(1);
    if (parsed.success) throw new Error("expected failure");
    expect(classifyApiError(parsed.error)).toBe("invalid_input");
  });

  it("maps database outages to unavailable", () => {
    expect(classifyApiError(Object.assign(new Error("x"), { code: "ECONNREFUSED" }))).toBe("unavailable");
    expect(classifyApiError(Object.assign(new Error("x"), { code: "57P01" }))).toBe("unavailable");
    expect(classifyApiError(new TimeoutError(100))).toBe("unavailable");
    expect(classifyApiError(new Error("x", { cause: { code: "ETIMEDOUT" } }))).toBe("unavailable");
  });

  it("maps anything else to internal_error", () => {
    expect(classifyApiError(new Error("boom"))).toBe("internal_error");
    expect(classifyApiError("weird")).toBe("internal_error");
  });
});
