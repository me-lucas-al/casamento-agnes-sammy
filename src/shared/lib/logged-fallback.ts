import { logger as defaultLogger, type Logger } from "./logger";
import { serializeError } from "./logging/serialize-error";
import { isNextControlFlowError } from "./next-control-flow";

export function createLoggedFallback(logger: Logger) {
  return async function withLoggedFallback<Value>(
    eventName: string,
    fallback: Value,
    operation: () => Promise<Value>,
  ): Promise<Value> {
    try {
      return await operation();
    } catch (error) {
      if (isNextControlFlowError(error)) throw error;
      logger.error(eventName, { error: serializeError(error) });
      return fallback;
    }
  };
}

export const withLoggedFallback = createLoggedFallback(defaultLogger);
