import { getDatabase } from "@/shared/db/client";
import type { Database } from "@/shared/db/types";
import { createDrizzleProfileRepository } from "./repositories/drizzle-profile-repository";
import { makeGetGuestProfile } from "./use-cases/get-guest-profile";
import { makeGetStaffProfile } from "./use-cases/get-staff-profile";
import { makeUpdateOwnProfile } from "./use-cases/update-own-profile";

type ProfileModuleOptions = { now?: () => Date };

export function createProfileModule(database: Database, { now = () => new Date() }: ProfileModuleOptions = {}) {
  const profileRepository = createDrizzleProfileRepository(database);
  return {
    profileRepository,
    getGuestProfile: makeGetGuestProfile({ profileRepository }),
    getStaffProfile: makeGetStaffProfile({ profileRepository }),
    updateOwnProfile: makeUpdateOwnProfile({ profileRepository, now }),
  };
}

export type ProfileModule = ReturnType<typeof createProfileModule>;

export function getProfileModule(): ProfileModule {
  return createProfileModule(getDatabase());
}
