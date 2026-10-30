import { describe, expect, it } from "vitest";
import { createExpireReservationsHandler } from "@/modules/contributions/controllers/expire-reservations-handler";
import { createApiErrorHandling } from "@/shared/lib/with-api-error-handling";
import { FakeLogger } from "@/tests/helpers/fake-logger";
import { seedGift } from "@/tests/helpers/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { createContributionContext, seedGuestActor } from "../contributions/contribution-context";

const CRON_SECRET = "cron-secret-for-tests";

type HandlerDependencies = Parameters<typeof createExpireReservationsHandler>[0];

function cronRequest(authorization?: string) {
  const headers = authorization ? { authorization } : undefined;
  return new Request("http://localhost/api/cron/expire-reservations", { headers });
}

describe("cron route error handling", () => {
  const testDatabase = useTestDatabase();

  function buildRoute(overrides: Partial<HandlerDependencies> = {}) {
    const logger = new FakeLogger();
    const context = createContributionContext(testDatabase.db);
    const route = createApiErrorHandling(logger)(
      "cron.expire-reservations",
      createExpireReservationsHandler({
        readCronSecret: () => CRON_SECRET,
        expireReservations: async () => {
          context.advanceHours(100);
          return context.contributions.expireReservations();
        },
        purgeLoginAttempts: async () => 0,
        ...overrides,
      }),
    );
    return { route, logger, context };
  }

  it("rejects a wrong secret with the standard 401 body", async () => {
    const { route } = buildRoute();
    const response = await route(cronRequest("Bearer wrong"));
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: { code: "unauthorized", message: "Não autorizado." } });
  });

  it("rejects a missing header", async () => {
    const { route } = buildRoute();
    expect((await route(cronRequest())).status).toBe(401);
  });

  it("expires reservations against the real database with the right secret", async () => {
    const guest = await seedGuestActor(testDatabase.db);
    const gift = await seedGift(testDatabase.db);
    const { route, context } = buildRoute();
    await context.contributions.reserveGift(guest, { giftId: gift.id });
    const response = await route(cronRequest(`Bearer ${CRON_SECRET}`));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ expiredCount: 1, purgedLoginAttempts: 0 });
  });

  it("answers 503 when the database is down without leaking details", async () => {
    const { route, logger } = buildRoute({
      expireReservations: async () => {
        throw Object.assign(new Error("connect ECONNREFUSED 127.0.0.1:5432"), { code: "ECONNREFUSED" });
      },
    });
    const response = await route(cronRequest(`Bearer ${CRON_SECRET}`));
    const text = await response.text();
    expect(response.status).toBe(503);
    expect(text).not.toContain("127.0.0.1");
    expect(logger.errors()).toHaveLength(1);
  });

  it("answers 500 for unexpected failures and hides the message", async () => {
    const { route } = buildRoute({
      purgeLoginAttempts: async () => {
        throw new Error("relation login_attempts does not exist");
      },
    });
    const response = await route(cronRequest(`Bearer ${CRON_SECRET}`));
    expect(response.status).toBe(500);
    expect(await response.text()).not.toContain("login_attempts");
  });
});
