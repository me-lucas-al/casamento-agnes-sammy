import { apiErrorResponse } from "@/shared/lib/api-errors";
import { isValidCronAuthorization } from "../lib/cron-authorization";

type Dependencies = {
  readCronSecret: () => string;
  expireReservations: () => Promise<number>;
  purgeLoginAttempts: () => Promise<number>;
};

export function createExpireReservationsHandler(dependencies: Dependencies) {
  return async function handleExpireReservations(request: Request): Promise<Response> {
    const authorization = request.headers.get("authorization");
    if (!isValidCronAuthorization(authorization, dependencies.readCronSecret())) {
      return apiErrorResponse("unauthorized");
    }
    const expiredCount = await dependencies.expireReservations();
    const purgedLoginAttempts = await dependencies.purgeLoginAttempts();
    return Response.json({ expiredCount, purgedLoginAttempts });
  };
}
