import { getDatabase } from "@/shared/db/client";
import type { Database } from "@/shared/db/types";
import { createDrizzleTourRepository } from "./repositories/drizzle-tour-repository";
import { makeCompleteTour } from "./use-cases/complete-tour";
import { makeGetTourStatus } from "./use-cases/get-tour-status";
import { makeRestartTour } from "./use-cases/restart-tour";

type TourModuleOptions = { database: Database; now?: () => Date };

export function createTourModule({ database, now = () => new Date() }: TourModuleOptions) {
  const tourRepository = createDrizzleTourRepository(database);
  return {
    tourRepository,
    getTourStatus: makeGetTourStatus({ tourRepository }),
    completeTour: makeCompleteTour({ tourRepository, now }),
    restartTour: makeRestartTour({ tourRepository }),
  };
}

export type TourModule = ReturnType<typeof createTourModule>;

export function getTourModule(): TourModule {
  return createTourModule({ database: getDatabase() });
}
