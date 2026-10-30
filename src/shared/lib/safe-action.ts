import { logger as defaultLogger, type Logger } from "./logger";
import { serializeError } from "./logging/serialize-error";
import { isNextControlFlowError } from "./next-control-flow";
import { failure, type ActionResult } from "./result";

export type ErrorDescriber = (error: unknown) => string;

class UnclassifiedProbeError extends Error {}

function isBusinessError(describeError: ErrorDescriber, error: unknown): boolean {
  return describeError(error) !== describeError(new UnclassifiedProbeError());
}

export function createSafeAction(logger: Logger) {
  return async function safeAction<Value>(
    describeError: ErrorDescriber,
    operation: () => Promise<ActionResult<Value>>,
    actionName = "server-action",
  ): Promise<ActionResult<Value>> {
    try {
      return await operation();
    } catch (error) {
      if (isNextControlFlowError(error)) throw error;
      const message = describeError(error);
      if (!isBusinessError(describeError, error)) {
        logger.error("action.unexpected_error", { action: actionName, error: serializeError(error) });
      }
      return failure(message);
    }
  };
}

export const safeAction = createSafeAction(defaultLogger);
