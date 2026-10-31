import { logger as defaultLogger, type Logger } from "../logging/logger";
import { serializeError } from "../logging/serialize-error";
import { isNextControlFlowError } from "../errors/next-control-flow";

export function createGuardedQuery(logger: Logger) {
  return async function guardedQuery<Value>(queryName: string, query: () => Promise<Value>): Promise<Value> {
    try {
      return await query();
    } catch (error) {
      if (isNextControlFlowError(error)) throw error;
      logger.error("query.failed", { query: queryName, error: serializeError(error) });
      throw error;
    }
  };
}

export const guardedQuery = createGuardedQuery(defaultLogger);
