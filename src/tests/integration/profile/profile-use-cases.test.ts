import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import { ProfileNotFoundError } from "@/modules/profile/errors";
import { createProfileModule } from "@/modules/profile/factory";
import { rsvps } from "@/shared/db/schema";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedGuest } from "@/tests/helpers/database/seeds/seed-guest";
import { seedAdmin, seedCouple } from "@/tests/helpers/database/seeds/seed-user";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";

describe("profile use-cases", () => {
  const testDatabase = useTestDatabase();
  const profileModule = () => createProfileModule(testDatabase.db);

  describe("getGuestProfile", () => {
    it("returns the guest own profile with pending rsvp by default", async () => {
      const guest = await seedGuest(testDatabase.db, { name: "Maria", seats: 3, phone: "11999990000" });

      const profile = await profileModule().getGuestProfile(asUser("guest", { guestId: guest.id }), guest.id);

      expect(profile).toMatchObject({
        guestId: guest.id,
        name: "Maria",
        seats: 3,
        phone: "11999990000",
        code: guest.code,
        rsvpStatus: "pending",
        respondedAt: null,
      });
    });

    it("reflects the rsvp status and response date", async () => {
      const guest = await seedGuest(testDatabase.db);
      const respondedAt = new Date("2026-10-01T12:00:00.000Z");
      await testDatabase.db.insert(rsvps).values({ guestId: guest.id, status: "going", respondedAt });

      const profile = await profileModule().getGuestProfile(asUser("guest", { guestId: guest.id }), guest.id);

      expect(profile.rsvpStatus).toBe("going");
      expect(profile.respondedAt).toEqual(respondedAt);
    });

    it("forbids a guest from reading another guest profile", async () => {
      const guest = await seedGuest(testDatabase.db);
      const otherGuest = await seedGuest(testDatabase.db);

      await expect(
        profileModule().getGuestProfile(asUser("guest", { guestId: guest.id }), otherGuest.id),
      ).rejects.toBeInstanceOf(ForbiddenError);
    });

    it("allows staff to read a guest profile", async () => {
      const guest = await seedGuest(testDatabase.db);

      const profile = await profileModule().getGuestProfile(asUser("admin"), guest.id);

      expect(profile.guestId).toBe(guest.id);
    });

    it("requires authentication", async () => {
      await expect(profileModule().getGuestProfile(null, "any")).rejects.toBeInstanceOf(UnauthenticatedError);
    });

    it("fails when the guest does not exist", async () => {
      const missingId = "00000000-0000-4000-8000-000000000000";

      await expect(
        profileModule().getGuestProfile(asUser("guest", { guestId: missingId }), missingId),
      ).rejects.toBeInstanceOf(ProfileNotFoundError);
    });
  });

  describe("getStaffProfile", () => {
    it.each([
      ["admin", seedAdmin],
      ["couple", seedCouple],
    ] as const)("returns the own profile of %s", async (role, seed) => {
      const user = await seed(testDatabase.db, { name: "Staff", email: `${role}@example.com` });

      const profile = await profileModule().getStaffProfile(asUser(role, { id: user.id }));

      expect(profile).toEqual({ userId: user.id, name: "Staff", email: `${role}@example.com`, role, image: null });
    });

    it("never returns another user data", async () => {
      const user = await seedAdmin(testDatabase.db);
      await seedCouple(testDatabase.db, { email: "other@example.com" });

      const profile = await profileModule().getStaffProfile(asUser("admin", { id: user.id }));

      expect(profile.userId).toBe(user.id);
    });

    it("forbids guests", async () => {
      await expect(profileModule().getStaffProfile(asUser("guest"))).rejects.toBeInstanceOf(ForbiddenError);
    });

    it("requires authentication", async () => {
      await expect(profileModule().getStaffProfile(null)).rejects.toBeInstanceOf(UnauthenticatedError);
    });

    it("fails when the session user no longer exists", async () => {
      await expect(profileModule().getStaffProfile(asUser("admin"))).rejects.toBeInstanceOf(ProfileNotFoundError);
    });
  });
});
