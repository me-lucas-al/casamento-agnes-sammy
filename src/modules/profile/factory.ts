import { getDatabase } from "@/shared/db/client";
import type { Database } from "@/shared/db/types";
import { createDrizzleProfileRepository } from "./repositories/drizzle-profile-repository";
import { makeGetGuestProfile } from "./use-cases/get-guest-profile";
import { makeGetStaffProfile } from "./use-cases/get-staff-profile";

export function createProfileModule(database: Database) {
  const profileRepository = createDrizzleProfileRepository(database);
  return {
    profileRepository,
    getGuestProfile: makeGetGuestProfile({ profileRepository }),
    getStaffProfile: makeGetStaffProfile({ profileRepository }),
  };
}

export type ProfileModule = ReturnType<typeof createProfileModule>;

export function getProfileModule(): ProfileModule {
  return createProfileModule(getDatabase());
}
