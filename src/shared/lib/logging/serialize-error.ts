import { scrubSensitiveText, type LogContext } from "./redact";

export function serializeError(error: unknown): LogContext {
  if (!(error instanceof Error)) return { name: "NonError", message: scrubSensitiveText(String(error)) };
  return {
    name: error.name,
    message: scrubSensitiveText(error.message),
    stack: error.stack ? scrubSensitiveText(error.stack) : undefined,
  };
}
