import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@/modules/auth/errors";
import { createDashboardModule } from "@/modules/dashboard/factory";
import { eventSettings, photos } from "@/shared/db/schema";
import { passThroughCachedReader } from "@/shared/lib/cache/cached-read";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedGift } from "@/tests/helpers/database/seeds/seed-gift";
import { seedGuest } from "@/tests/helpers/database/seeds/seed-guest";
import { seedCouple } from "@/tests/helpers/database/seeds/seed-user";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";

const baseEvent = {
  coupleNames: "Agnes & Sammy",
  eventAt: new Date("2027-05-01T20:00:00.000Z"),
  venueName: "Salão",
  address: "Rua Principal, 1",
};

describe("getOnboardingStatus", () => {
  const testDatabase = useTestDatabase();
  const dashboard = () =>
    createDashboardModule({ database: testDatabase.db, cachedReader: passThroughCachedReader });
  const doneKeys = async () =>
    (await dashboard().getOnboardingStatus(asUser("couple"))).steps
      .filter((step) => step.isDone)
      .map((step) => step.key);

  it("starts with every step pending", async () => {
    expect(await doneKeys()).toEqual([]);
  });

  it("needs all four Pix fields before the Pix step is done", async () => {
    await testDatabase.db.insert(eventSettings).values({ ...baseEvent, pixKey: "a@b.com", pixKeyType: "email" });
    expect(await doneKeys()).toEqual([]);

    await testDatabase.db.update(eventSettings).set({ pixReceiverName: "Agnes", pixCity: "Recife" });
    expect(await doneKeys()).toEqual(["pix"]);
  });

  it("marks the story, photos and gifts steps from stored data", async () => {
    await testDatabase.db.insert(eventSettings).values({ ...baseEvent, story: "  Nos conhecemos em 2020.  " });
    const couple = await seedCouple(testDatabase.db);
    await testDatabase.db
      .insert(photos)
      .values({ cloudinaryPublicId: "p1", url: "https://example.com/p1.jpg", uploadedByUserId: couple.id });
    await seedGift(testDatabase.db);

    expect(await doneKeys()).toEqual(["story", "photos", "gifts"]);
  });

  it("does not count guest photos or hidden gifts", async () => {
    const guest = await seedGuest(testDatabase.db);
    await testDatabase.db
      .insert(photos)
      .values({ cloudinaryPublicId: "g1", url: "https://example.com/g1.jpg", uploadedByGuestId: guest.id });
    await seedGift(testDatabase.db, { isVisible: false });

    expect(await doneKeys()).toEqual([]);
  });

  it("ignores a blank story", async () => {
    await testDatabase.db.insert(eventSettings).values({ ...baseEvent, story: "   " });

    expect(await doneKeys()).toEqual([]);
  });

  it("forbids guests", async () => {
    await expect(dashboard().getOnboardingStatus(asUser("guest"))).rejects.toBeInstanceOf(ForbiddenError);
  });
});
