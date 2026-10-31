import { API_ERRORS, apiErrorResponse } from "./api-errors";
import { classifyApiError } from "./classify-api-error";
import { logger as defaultLogger, type Logger } from "../logging/logger";
import { serializeError } from "../logging/serialize-error";
import { isNextControlFlowError } from "../errors/next-control-flow";

type RouteHandler<Arguments extends unknown[]> = (request: Request, ...rest: Arguments) => Promise<Response>;

export function createApiErrorHandling(logger: Logger) {
  return function withApiErrorHandling<Arguments extends unknown[]>(
    routeName: string,
    handler: RouteHandler<Arguments>,
  ): RouteHandler<Arguments> {
    return async (request, ...rest) => {
      try {
        return await handler(request, ...rest);
      } catch (error) {
        if (isNextControlFlowError(error)) throw error;
        const code = classifyApiError(error);
        if (code === "internal_error" || code === "unavailable") {
          logger.error("api.unexpected_error", { route: routeName, status: API_ERRORS[code].status, error: serializeError(error) });
        }
        return apiErrorResponse(code);
      }
    };
  };
}

export const withApiErrorHandling = createApiErrorHandling(defaultLogger);
