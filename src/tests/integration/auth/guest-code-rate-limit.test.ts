import { describe, expect, it } from "vitest";
import { TooManyLoginAttemptsError } from "@/modules/auth/errors";
import { createAuthModule } from "@/modules/auth/factory";
import { MAX_FAILED_ATTEMPTS } from "@/modules/auth/use-cases/authenticate-guest-code";
import { loginAttempts } from "@/shared/db/schema";
import { addMinutes } from "@/shared/lib/dates/dates";
import { seedGuest } from "@/tests/helpers/database/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";

describe("guest code rate limit", () => {
  const testDatabase = useTestDatabase();
  const ipHash = "hashed-ip";

  it("lets at most the limit through on a parallel burst", async () => {
    await seedGuest(testDatabase.db, { code: "K7M2QX9P" });
    const authModule = createAuthModule(testDatabase.db);
    const burstSize = MAX_FAILED_ATTEMPTS * 3;

    const outcomes = await Promise.allSettled(
      Array.from({ length: burstSize }, () => authModule.authenticateGuestCode({ code: "WRONG", ipHash })),
    );

    const guessesEvaluated = outcomes.filter(
      (outcome) => !(outcome.status === "rejected" && outcome.reason instanceof TooManyLoginAttemptsError),
    );
    expect(guessesEvaluated.length).toBeLessThanOrEqual(MAX_FAILED_ATTEMPTS);
  });

  it("clears the failures of an ip after a successful login", async () => {
    await seedGuest(testDatabase.db, { code: "K7M2QX9P" });
    const authModule = createAuthModule(testDatabase.db);
    await authModule.authenticateGuestCode({ code: "WRONG", ipHash }).catch(() => undefined);
    await authModule.authenticateGuestCode({ code: "K7M2QX9P", ipHash });

    expect(await testDatabase.db.select().from(loginAttempts)).toHaveLength(0);
  });

  it("purges login attempts older than 24 hours only", async () => {
    const now = new Date();
    await testDatabase.db.insert(loginAttempts).values([
      { ipHash, at: addMinutes(now, -25 * 60) },
      { ipHash, at: addMinutes(now, -60) },
    ]);

    const purged = await createAuthModule(testDatabase.db, { now: () => now }).purgeOldLoginAttempts();

    expect(purged).toBe(1);
    expect(await testDatabase.db.select().from(loginAttempts)).toHaveLength(1);
  });
});
