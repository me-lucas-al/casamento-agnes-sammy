import { requireRole } from "@/modules/auth/authorization";
import type { SessionUser } from "@/modules/auth/types";
import { dashboardTag } from "@/shared/lib/cache/cache-tags";
import type { CachedReader } from "@/shared/lib/cache/cached-read";
import type { DashboardRepository } from "../repositories/contracts/dashboard-repository";
import type { DashboardTotals } from "../types";

type Dependencies = {
  dashboardRepository: DashboardRepository;
  cachedReader: CachedReader;
  now: () => Date;
};

const DASHBOARD_REVALIDATE_SECONDS = 60;

export function makeGetDashboardTotals({ dashboardRepository, cachedReader, now }: Dependencies) {
  return async function getDashboardTotals(actor: SessionUser | null): Promise<DashboardTotals> {
    requireRole(actor, ["admin", "couple"]);
    return cachedReader.read(
      {
        keyParts: ["dashboard", "totals"],
        tags: [dashboardTag()],
        revalidateSeconds: DASHBOARD_REVALIDATE_SECONDS,
      },
      () => dashboardRepository.readTotals(now()),
    );
  };
}
