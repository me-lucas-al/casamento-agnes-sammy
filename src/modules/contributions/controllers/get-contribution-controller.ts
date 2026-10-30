import { getSessionUser } from "@/modules/auth/controllers/get-session-user";
import { nextCacheInvalidator } from "@/shared/lib/cache/invalidate";
import { getContributionModule } from "../factory";
import { createContributionController } from "./contribution-controller";

export function getContributionController() {
  return createContributionController({
    contributions: getContributionModule(),
    invalidator: nextCacheInvalidator,
    getActor: getSessionUser,
  });
}
