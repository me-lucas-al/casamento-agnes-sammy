import { getDatabase } from "@/shared/db/client";
import type { Database } from "@/shared/db/types";
import { createUserModule } from "@/modules/users/factory";
import { createDrizzleGuestCodeGateway } from "./repositories/drizzle-guest-code-gateway";
import { createDrizzleLoginAttemptRepository } from "./repositories/drizzle-login-attempt-repository";
import { makeAuthenticateGuestCode } from "./use-cases/authenticate-guest-code";
import { makeAuthorizeGoogleSignIn } from "./use-cases/authorize-google-sign-in";

type AuthModuleOptions = { now?: () => Date };

export function createAuthModule(database: Database, { now = () => new Date() }: AuthModuleOptions = {}) {
  const { userRepository } = createUserModule(database);
  return {
    authenticateGuestCode: makeAuthenticateGuestCode({
      guestCodeGateway: createDrizzleGuestCodeGateway(database),
      loginAttemptRepository: createDrizzleLoginAttemptRepository(database),
      now,
    }),
    authorizeGoogleSignIn: makeAuthorizeGoogleSignIn({ activeUserLookup: userRepository }),
  };
}

export type AuthModule = ReturnType<typeof createAuthModule>;

export function getAuthModule(): AuthModule {
  return createAuthModule(getDatabase());
}
