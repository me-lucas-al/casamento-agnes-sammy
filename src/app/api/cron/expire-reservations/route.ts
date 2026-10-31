import { getAuthModule } from "@/modules/auth/factory";
import { createExpireReservationsHandler } from "@/modules/contributions/controllers/handlers/expire-reservations-handler";
import { getContributionController } from "@/modules/contributions/controllers/handlers/get-contribution-controller";
import { getCronEnv } from "@/shared/config/env";
import { withApiErrorHandling } from "@/shared/lib/with-api-error-handling";

export const dynamic = "force-dynamic";

export const GET = withApiErrorHandling(
  "cron.expire-reservations",
  createExpireReservationsHandler({
    readCronSecret: () => getCronEnv().CRON_SECRET,
    expireReservations: () => getContributionController().expireReservations(),
    purgeLoginAttempts: () => getAuthModule().purgeOldLoginAttempts(),
  }),
);
