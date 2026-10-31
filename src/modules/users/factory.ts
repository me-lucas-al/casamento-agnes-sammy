import type { Database } from "@/shared/db/types";
import { getDatabase } from "@/shared/db/client";
import { createDrizzleUserRepository } from "./repositories/drizzle/drizzle-user-repository";
import { makeCreateUser } from "./use-cases/create-user";
import { makeEnsureAdminUser } from "./use-cases/ensure-admin-user";
import { makeListUsersPage } from "./use-cases/list-users-page";
import { makeSetUserActive } from "./use-cases/set-user-active";

export function createUserModule(database: Database) {
  const userRepository = createDrizzleUserRepository(database);
  return {
    userRepository,
    createUser: makeCreateUser({ userRepository }),
    listUsersPage: makeListUsersPage({ userRepository }),
    setUserActive: makeSetUserActive({ userRepository }),
    ensureAdminUser: makeEnsureAdminUser({ userRepository }),
  };
}

export type UserModule = ReturnType<typeof createUserModule>;

export function getUserModule(): UserModule {
  return createUserModule(getDatabase());
}
