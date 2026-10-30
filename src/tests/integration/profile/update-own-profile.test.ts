import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import { createProfileModule } from "@/modules/profile/factory";
import { CompanionLimitExceededError, RsvpDeadlinePassedError } from "@/modules/rsvp/errors";
import { eventSettings, guests, rsvpCompanions, rsvps } from "@/shared/db/schema";
import { asUser } from "@/tests/helpers/fake-session";
import { seedGuest } from "@/tests/helpers/seeds/seed-guest";
import { seedCouple } from "@/tests/helpers/seeds/seed-user";
import { useTestDatabase } from "@/tests/helpers/use-test-database";

const NOW = new Date("2026-11-02T10:00:00.000Z");

const validInput = {
  name: "Maria Silva",
  phone: "11999990000",
  email: "maria@example.com",
  relatives: [{ name: "João Silva", dietaryNote: null }],
};

describe("updateOwnProfile", () => {
  const testDatabase = useTestDatabase();
  const profileModule = () => createProfileModule(testDatabase.db, { now: () => NOW });

  it("saves contact data, relatives and marks the profile as completed", async () => {
    const guest = await seedGuest(testDatabase.db, { seats: 3 });
    const actor = asUser("guest", { id: guest.id, guestId: guest.id });

    const profile = await profileModule().updateOwnProfile(actor, validInput);

    expect(profile).toMatchObject({
      name: "Maria Silva",
      phone: "11999990000",
      email: "maria@example.com",
      profileCompleted: true,
      relatives: [{ name: "João Silva", dietaryNote: null }],
    });
  });

  it("reports an unfilled profile as not completed", async () => {
    const guest = await seedGuest(testDatabase.db);

    const profile = await profileModule().getGuestProfile(asUser("guest", { guestId: guest.id }), guest.id);

    expect(profile).toMatchObject({ profileCompleted: false, email: null, relatives: [] });
  });

  it("never changes seats or code", async () => {
    const guest = await seedGuest(testDatabase.db, { seats: 3 });

    await profileModule().updateOwnProfile(asUser("guest", { guestId: guest.id }), validInput);

    const [saved] = await testDatabase.db.select().from(guests).where(eq(guests.id, guest.id));
    expect(saved).toMatchObject({ seats: 3, code: guest.code, profileCompletedAt: NOW });
  });

  it("replaces previous relatives without touching the rsvp answer", async () => {
    const guest = await seedGuest(testDatabase.db, { seats: 3 });
    await testDatabase.db.insert(rsvps).values({ guestId: guest.id, status: "going", respondedAt: NOW });
    await testDatabase.db.insert(rsvpCompanions).values({ guestId: guest.id, name: "Antigo" });

    await profileModule().updateOwnProfile(asUser("guest", { guestId: guest.id }), validInput);

    const companions = await testDatabase.db.select().from(rsvpCompanions);
    expect(companions.map((companion) => companion.name)).toEqual(["João Silva"]);
    const [rsvp] = await testDatabase.db.select().from(rsvps);
    expect(rsvp.status).toBe("going");
  });

  it("drops blank relatives", async () => {
    const guest = await seedGuest(testDatabase.db, { seats: 3 });

    const profile = await profileModule().updateOwnProfile(asUser("guest", { guestId: guest.id }), {
      ...validInput,
      relatives: [{ name: "   ", dietaryNote: null }],
    });

    expect(profile.relatives).toEqual([]);
  });

  it("refuses more relatives than the invitation allows", async () => {
    const guest = await seedGuest(testDatabase.db, { seats: 1 });

    await expect(
      profileModule().updateOwnProfile(asUser("guest", { guestId: guest.id }), validInput),
    ).rejects.toBeInstanceOf(CompanionLimitExceededError);
  });

  describe("after the rsvp deadline", () => {
    const insertEventWithDeadline = () =>
      testDatabase.db.insert(eventSettings).values({
        coupleNames: "Agnes & Sammy",
        eventAt: new Date("2027-05-01T20:00:00.000Z"),
        venueName: "Salão",
        address: "Rua Principal, 1",
        rsvpDeadline: new Date("2026-11-01T00:00:00.000Z"),
      });

    it("refuses to change relatives", async () => {
      const guest = await seedGuest(testDatabase.db, { seats: 3 });
      await insertEventWithDeadline();

      await expect(
        profileModule().updateOwnProfile(asUser("guest", { guestId: guest.id }), validInput),
      ).rejects.toBeInstanceOf(RsvpDeadlinePassedError);
    });

    it("still lets the guest change contact data when relatives stay the same", async () => {
      const guest = await seedGuest(testDatabase.db, { seats: 3 });
      await insertEventWithDeadline();

      const profile = await profileModule().updateOwnProfile(asUser("guest", { guestId: guest.id }), {
        ...validInput,
        relatives: [],
      });

      expect(profile.email).toBe("maria@example.com");
    });
  });

  it("forbids staff and anonymous callers", async () => {
    const couple = await seedCouple(testDatabase.db);

    await expect(
      profileModule().updateOwnProfile(asUser("couple", { id: couple.id }), validInput),
    ).rejects.toBeInstanceOf(ForbiddenError);
    await expect(profileModule().updateOwnProfile(null, validInput)).rejects.toBeInstanceOf(UnauthenticatedError);
  });
});
