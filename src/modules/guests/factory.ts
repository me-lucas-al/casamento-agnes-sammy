import { getDatabase } from "@/shared/db/client";
import type { Database } from "@/shared/db/types";
import { generateGuestCode, type GuestCodeGenerator } from "./lib/guest-code";
import { createDrizzleGuestRepository } from "./repositories/drizzle-guest-repository";
import { makeCreateGuest } from "./use-cases/create-guest";
import { makeDeleteGuest } from "./use-cases/delete-guest";
import { makeGenerateUniqueGuestCode } from "./use-cases/generate-unique-guest-code";
import { makeListGuestsPage } from "./use-cases/list-guests-page";
import { makeRegenerateGuestCode } from "./use-cases/regenerate-guest-code";
import { makeUpdateGuest } from "./use-cases/update-guest";

export function createGuestModule(database: Database, generateCode: GuestCodeGenerator = generateGuestCode) {
  const guestRepository = createDrizzleGuestRepository(database);
  const generateUniqueGuestCode = makeGenerateUniqueGuestCode({ guestRepository, generateCode });
  return {
    guestRepository,
    createGuest: makeCreateGuest({ guestRepository, generateUniqueGuestCode }),
    updateGuest: makeUpdateGuest({ guestRepository }),
    deleteGuest: makeDeleteGuest({ guestRepository }),
    regenerateGuestCode: makeRegenerateGuestCode({ guestRepository, generateUniqueGuestCode }),
    listGuestsPage: makeListGuestsPage({ guestRepository }),
  };
}

export type GuestModule = ReturnType<typeof createGuestModule>;

export function getGuestModule(): GuestModule {
  return createGuestModule(getDatabase());
}
