import { getDatabase } from "@/shared/db/client";
import type { Database } from "@/shared/db/types";
import { createDrizzleRsvpRepository } from "./repositories/drizzle-rsvp-repository";
import { makeDeleteRsvp } from "./use-cases/delete-rsvp";
import { makeGetGuestRsvp } from "./use-cases/get-guest-rsvp";
import { makeGetRsvpTotals } from "./use-cases/get-rsvp-totals";
import { makeListRsvpsPage } from "./use-cases/list-rsvps-page";
import { makeSubmitRsvp } from "./use-cases/submit-rsvp";

type RsvpModuleOptions = { now?: () => Date };

export function createRsvpModule(database: Database, { now = () => new Date() }: RsvpModuleOptions = {}) {
  const rsvpRepository = createDrizzleRsvpRepository(database);
  return {
    rsvpRepository,
    submitRsvp: makeSubmitRsvp({ rsvpRepository, now }),
    deleteRsvp: makeDeleteRsvp({ rsvpRepository }),
    getGuestRsvp: makeGetGuestRsvp({ rsvpRepository }),
    getRsvpTotals: makeGetRsvpTotals({ rsvpRepository }),
    listRsvpsPage: makeListRsvpsPage({ rsvpRepository }),
  };
}

export type RsvpModule = ReturnType<typeof createRsvpModule>;

export function getRsvpModule(): RsvpModule {
  return createRsvpModule(getDatabase());
}
