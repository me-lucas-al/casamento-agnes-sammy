import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import { createDashboardModule } from "@/modules/dashboard/factory";
import { messages, photos } from "@/shared/db/schema";
import { passThroughCachedReader, type CachedReader } from "@/shared/lib/cache/cached-read";
import { addHours } from "@/shared/lib/dates/dates";
import { asUser } from "@/tests/helpers/fake-session";
import { seedContribution } from "@/tests/helpers/seeds/seed-contribution";
import { seedGift } from "@/tests/helpers/seeds/seed-gift";
import { seedGuest } from "@/tests/helpers/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { InMemoryTaggedCache } from "../gifts/in-memory-tagged-cache";

describe("dashboard totals", () => {
  const testDatabase = useTestDatabase();
  const NOW = new Date("2026-11-01T12:00:00.000Z");

  function buildModule(cachedReader: CachedReader = passThroughCachedReader) {
    return createDashboardModule({ database: testDatabase.db, cachedReader, now: () => NOW });
  }

  async function seedPhoto(status: "pending" | "approved", index: number) {
    await testDatabase.db.insert(photos).values({
      cloudinaryPublicId: `photo-${status}-${index}`,
      url: "https://example.com/x.jpg",
      status,
    });
  }

  it("returns zeros on an empty database", async () => {
    expect(await buildModule().getDashboardTotals(asUser("admin"))).toEqual({
      reservations: { reserved: 0, confirmed: 0 },
      pendingPayments: { count: 0, amountCents: 0 },
      attendance: { going: 0, declined: 0, pending: 0, attendingPeople: 0 },
      pendingMessages: 0,
      pendingPhotos: 0,
    });
  });

  it("counts reservations, pending payment value, attendance and moderation", async () => {
    const gift = await seedGift(testDatabase.db, { mode: "fixed_quotas", totalQuotas: 10 });
    const guest = await seedGuest(testDatabase.db, { name: "Ana", seats: 2 });
    const base = { giftId: gift.id, guestId: guest.id };
    await seedContribution(testDatabase.db, { ...base, amountCents: 10000, expiresAt: addHours(NOW, 5) });
    await seedContribution(testDatabase.db, { ...base, amountCents: 5000, expiresAt: addHours(NOW, 5) });
    await seedContribution(testDatabase.db, { ...base, amountCents: 7000, status: "confirmed" });
    await seedContribution(testDatabase.db, { ...base, amountCents: 9000, expiresAt: addHours(NOW, -1) });
    await seedContribution(testDatabase.db, { ...base, amountCents: 9000, status: "cancelled" });
    await testDatabase.db.insert(messages).values([
      { guestId: guest.id, authorName: "Ana", body: "Oi" },
      { guestId: guest.id, authorName: "Ana", body: "Oi 2", status: "approved" },
    ]);
    await seedPhoto("pending", 1);
    await seedPhoto("pending", 2);
    await seedPhoto("approved", 3);

    const totals = await buildModule().getDashboardTotals(asUser("couple"));

    expect(totals.reservations).toEqual({ reserved: 2, confirmed: 1 });
    expect(totals.pendingPayments).toEqual({ count: 2, amountCents: 15000 });
    expect(totals.attendance).toEqual({ going: 0, declined: 0, pending: 1, attendingPeople: 0 });
    expect(totals.pendingMessages).toBe(1);
    expect(totals.pendingPhotos).toBe(2);
  });

  it("allows admin and couple but rejects guests and anonymous visitors", async () => {
    const dashboard = buildModule();
    await expect(dashboard.getDashboardTotals(asUser("admin"))).resolves.toBeDefined();
    await expect(dashboard.getDashboardTotals(asUser("couple"))).resolves.toBeDefined();
    await expect(dashboard.getDashboardTotals(asUser("guest"))).rejects.toBeInstanceOf(ForbiddenError);
    await expect(dashboard.getDashboardTotals(null)).rejects.toBeInstanceOf(UnauthenticatedError);
  });

  it("serves cached totals until the dashboard tag is invalidated", async () => {
    const cache = new InMemoryTaggedCache();
    const dashboard = buildModule(cache);
    const admin = asUser("admin");
    await dashboard.getDashboardTotals(admin);
    await seedPhoto("pending", 1);

    expect((await dashboard.getDashboardTotals(admin)).pendingPhotos).toBe(0);
    expect(cache.readTags.at(-1)).toEqual(["dashboard"]);

    cache.invalidateTags(["dashboard"]);
    expect((await dashboard.getDashboardTotals(admin)).pendingPhotos).toBe(1);
  });
});
