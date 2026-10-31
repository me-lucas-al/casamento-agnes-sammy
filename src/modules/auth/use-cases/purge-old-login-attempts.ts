import { addMinutes } from "@/shared/lib/dates/dates";
import type { LoginAttemptRepository } from "../repositories/contracts/login-attempt-repository";

export const LOGIN_ATTEMPT_RETENTION_MINUTES = 24 * 60;

type Dependencies = { loginAttemptRepository: LoginAttemptRepository; now: () => Date };

export function makePurgeOldLoginAttempts({ loginAttemptRepository, now }: Dependencies) {
  return async function purgeOldLoginAttempts(): Promise<number> {
    const threshold = addMinutes(now(), -LOGIN_ATTEMPT_RETENTION_MINUTES);
    return loginAttemptRepository.deleteOlderThan(threshold);
  };
}
