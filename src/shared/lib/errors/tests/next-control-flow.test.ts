import { describe, expect, it } from "vitest";
import { createNotFoundError, createRedirectError } from "@/tests/helpers/next-control-flow-errors";
import { isNextControlFlowError } from "../next-control-flow";

describe("isNextControlFlowError", () => {
  it("recognizes redirect and notFound errors", () => {
    expect(isNextControlFlowError(createRedirectError())).toBe(true);
    expect(isNextControlFlowError(createNotFoundError())).toBe(true);
  });

  it("rejects ordinary errors and non-objects", () => {
    expect(isNextControlFlowError(new Error("x"))).toBe(false);
    expect(isNextControlFlowError(null)).toBe(false);
    expect(isNextControlFlowError("NEXT_REDIRECT")).toBe(false);
  });
});
