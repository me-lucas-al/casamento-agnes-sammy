import { addMinutes } from "@/shared/lib/dates";
import { InvalidGuestCodeError, TooManyLoginAttemptsError } from "../errors";
import type { GuestCodeGateway } from "../repositories/guest-code-gateway";
import type { LoginAttemptRepository } from "../repositories/login-attempt-repository";
import type { SessionUser } from "../types";

export const MAX_FAILED_ATTEMPTS = 10;
export const ATTEMPT_WINDOW_MINUTES = 15;

type Dependencies = {
  guestCodeGateway: GuestCodeGateway;
  loginAttemptRepository: LoginAttemptRepository;
  now: () => Date;
};

type Input = { code: string; ipHash: string };

export type AuthenticatedGuest = SessionUser & { guestId: string; name: string };

export function makeAuthenticateGuestCode(dependencies: Dependencies) {
  const { guestCodeGateway, loginAttemptRepository, now } = dependencies;

  return async function authenticateGuestCode({ code, ipHash }: Input): Promise<AuthenticatedGuest> {
    const currentTime = now();
    const windowStart = addMinutes(currentTime, -ATTEMPT_WINDOW_MINUTES);
    const failedAttempts = await loginAttemptRepository.countSince(ipHash, windowStart);
    if (failedAttempts >= MAX_FAILED_ATTEMPTS) throw new TooManyLoginAttemptsError();

    const guest = await guestCodeGateway.findByCode(code.trim().toUpperCase());
    if (!guest) {
      await loginAttemptRepository.record(ipHash, currentTime);
      throw new InvalidGuestCodeError();
    }

    await guestCodeGateway.markAccess(guest.id, currentTime);
    return { id: guest.id, guestId: guest.id, role: "guest", name: guest.name };
  };
}
