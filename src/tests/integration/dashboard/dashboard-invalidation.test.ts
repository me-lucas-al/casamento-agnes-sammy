import { describe, expect, it } from "vitest";
import { createContributionController } from "@/modules/contributions/controllers/contribution-controller";
import { createDashboardModule } from "@/modules/dashboard/factory";
import { invalidateApprovedMessagesCache } from "@/modules/messages/lib/invalidate-messages-cache";
import { invalidateRsvpCache } from "@/modules/rsvp/lib/invalidate-rsvp-cache";
import { asUser } from "@/tests/helpers/fake-session";
import { seedGift } from "@/tests/helpers/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { createContributionContext, seedGuestActor, seedStaffActor } from "../contributions/contribution-context";
import { InMemoryTaggedCache } from "../gifts/in-memory-tagged-cache";

describe("dashboard cache invalidation", () => {
  const testDatabase = useTestDatabase();

  it("refreshes totals after reserving and confirming through the controller", async () => {
    const cache = new InMemoryTaggedCache();
    const dashboard = createDashboardModule({ database: testDatabase.db, cachedReader: cache });
    const context = createContributionContext(testDatabase.db);
    const guest = await seedGuestActor(testDatabase.db);
    const couple = await seedStaffActor(testDatabase.db, "couple");
    const gift = await seedGift(testDatabase.db, { priceCents: 20000 });
    let actor = guest;
    const controller = createContributionController({
      contributions: context.contributions,
      invalidator: cache,
      getActor: async () => actor,
    });
    const readTotals = () => dashboard.getDashboardTotals(couple);

    expect((await readTotals()).pendingPayments.count).toBe(0);
    const reserved = await controller.reserveGift({ giftId: gift.id });
    if (!reserved.ok) throw new Error(reserved.error);
    expect((await readTotals()).pendingPayments).toEqual({ count: 1, amountCents: 20000 });

    actor = couple;
    await controller.confirmPixPayment({ contributionId: reserved.data.contributionId });
    const totals = await readTotals();
    expect(totals.pendingPayments.count).toBe(0);
    expect(totals.reservations).toEqual({ reserved: 0, confirmed: 1 });
  });

  it("invalidates the dashboard tag on rsvp and message changes", async () => {
    const cache = new InMemoryTaggedCache();
    const dashboard = createDashboardModule({ database: testDatabase.db, cachedReader: cache });
    await dashboard.getDashboardTotals(asUser("admin"));
    invalidateRsvpCache(cache, "guest-1");
    await dashboard.getDashboardTotals(asUser("admin"));
    invalidateApprovedMessagesCache(cache);
    await dashboard.getDashboardTotals(asUser("admin"));
    expect(cache.loadCount).toBe(3);
  });
});
