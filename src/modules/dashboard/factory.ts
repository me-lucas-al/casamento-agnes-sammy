import { getDatabase } from "@/shared/db/client";
import type { Database } from "@/shared/db/types";
import { nextCachedReader, type CachedReader } from "@/shared/lib/cache/cached-read";
import { createDrizzleDashboardRepository } from "./repositories/drizzle-dashboard-repository";
import { makeGetDashboardTotals } from "./use-cases/get-dashboard-totals";

type DashboardModuleOptions = {
  database: Database;
  cachedReader: CachedReader;
  now?: () => Date;
};

export function createDashboardModule({ database, cachedReader, now = () => new Date() }: DashboardModuleOptions) {
  const dashboardRepository = createDrizzleDashboardRepository(database);
  return {
    dashboardRepository,
    getDashboardTotals: makeGetDashboardTotals({ dashboardRepository, cachedReader, now }),
  };
}

export type DashboardModule = ReturnType<typeof createDashboardModule>;

export function getDashboardModule(): DashboardModule {
  return createDashboardModule({ database: getDatabase(), cachedReader: nextCachedReader });
}
