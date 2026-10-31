import { ZodError } from "zod";
import { ApiError, type ApiErrorCode } from "./api-errors";
import { TimeoutError } from "../resilience/with-timeout";

const UNAVAILABLE_SYSTEM_CODES = new Set(["ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "ENOTFOUND", "EAI_AGAIN"]);
const UNAVAILABLE_SQLSTATE_CLASSES = ["08", "53", "57"];

function readCode(error: unknown): string | null {
  if (typeof error !== "object" || error === null) return null;
  const { code } = error as { code?: unknown };
  return typeof code === "string" ? code : null;
}

function isDatabaseUnavailable(error: unknown): boolean {
  if (error instanceof TimeoutError) return true;
  const code = readCode(error);
  if (code === null) return false;
  if (UNAVAILABLE_SYSTEM_CODES.has(code)) return true;
  return UNAVAILABLE_SQLSTATE_CLASSES.some((sqlstateClass) => code.startsWith(sqlstateClass));
}

export function classifyApiError(error: unknown): ApiErrorCode {
  if (error instanceof ApiError) return error.code;
  if (error instanceof ZodError) return "invalid_input";
  if (isDatabaseUnavailable(error)) return "unavailable";
  if (error instanceof Error && error.cause !== undefined && isDatabaseUnavailable(error.cause)) {
    return "unavailable";
  }
  return "internal_error";
}
