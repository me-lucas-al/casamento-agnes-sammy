import { addMinutes } from "@/shared/lib/dates/dates";
import { InvalidGuestCodeError, TooManyLoginAttemptsError } from "../errors";
import { normalizeAccessCode } from "../lib/access-code";
import type { GuestCodeGateway } from "../repositories/contracts/guest-code-gateway";
import type { LoginAttemptRepository } from "../repositories/contracts/login-attempt-repository";
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
    await loginAttemptRepository.record(ipHash, currentTime);
    const attempts = await loginAttemptRepository.countSince(ipHash, windowStart);
    if (attempts > MAX_FAILED_ATTEMPTS) throw new TooManyLoginAttemptsError();

    const guest = await guestCodeGateway.findByCode(normalizeAccessCode(code));
    if (!guest) throw new InvalidGuestCodeError();

    await loginAttemptRepository.clearForIp(ipHash);
    await guestCodeGateway.markAccess(guest.id, currentTime);
    return { id: guest.id, guestId: guest.id, role: "guest", name: guest.name };
  };
}
