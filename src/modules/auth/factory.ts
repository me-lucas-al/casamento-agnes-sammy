import { getDatabase } from "@/shared/db/client";
import type { Database } from "@/shared/db/types";
import { createUserModule } from "@/modules/users/factory";
import { createDrizzleGuestCodeGateway } from "./repositories/drizzle-guest-code-gateway";
import { createDrizzleLoginAttemptRepository } from "./repositories/drizzle-login-attempt-repository";
import { createDrizzleSessionAccountLookup } from "./repositories/drizzle-session-account-lookup";
import { makeAuthenticateGuestCode } from "./use-cases/authenticate-guest-code";
import { makeAuthorizeGoogleSignIn } from "./use-cases/authorize-google-sign-in";
import { makePurgeOldLoginAttempts } from "./use-cases/purge-old-login-attempts";
import { makeValidateSessionUser } from "./use-cases/validate-session-user";

type AuthModuleOptions = { now?: () => Date };

export function createAuthModule(database: Database, { now = () => new Date() }: AuthModuleOptions = {}) {
  const { userRepository } = createUserModule(database);
  const loginAttemptRepository = createDrizzleLoginAttemptRepository(database);
  return {
    authenticateGuestCode: makeAuthenticateGuestCode({
      guestCodeGateway: createDrizzleGuestCodeGateway(database),
      loginAttemptRepository,
      now,
    }),
    authorizeGoogleSignIn: makeAuthorizeGoogleSignIn({ activeUserLookup: userRepository }),
    purgeOldLoginAttempts: makePurgeOldLoginAttempts({ loginAttemptRepository, now }),
    validateSessionUser: makeValidateSessionUser({
      sessionAccountLookup: createDrizzleSessionAccountLookup(database),
    }),
  };
}

export type AuthModule = ReturnType<typeof createAuthModule>;

export function getAuthModule(): AuthModule {
  return createAuthModule(getDatabase());
}
