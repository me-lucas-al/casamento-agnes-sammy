import { getAuthModule } from "@/modules/auth/factory";
import { getContributionController } from "@/modules/contributions/controllers/get-contribution-controller";
import { isValidCronAuthorization } from "@/modules/contributions/lib/cron-authorization";
import { getServerEnv } from "@/shared/config/env";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!isValidCronAuthorization(authorization, getServerEnv().CRON_SECRET)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const expiredCount = await getContributionController().expireReservations();
  const purgedLoginAttempts = await getAuthModule().purgeOldLoginAttempts();
  return Response.json({ expiredCount, purgedLoginAttempts });
}
