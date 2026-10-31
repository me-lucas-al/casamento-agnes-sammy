import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import { GuestHasConfirmedContributionsError, GuestNotFoundError } from "@/modules/guests/errors";
import { createGuestModule } from "@/modules/guests/factory";
import { guests } from "@/shared/db/schema";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedContribution } from "@/tests/helpers/database/seeds/seed-contribution";
import { seedGuest } from "@/tests/helpers/database/seeds/seed-guest";
import { seedAdmin } from "@/tests/helpers/database/seeds/seed-user";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";

describe("guest use-cases", () => {
  const testDatabase = useTestDatabase();
  const guestModule = () => createGuestModule(testDatabase.db);
  const details = { name: "Maria Souza", phone: "11912345678", seats: 3 };

  async function managerActor(role: "admin" | "couple" = "admin") {
    const admin = await seedAdmin(testDatabase.db);
    return asUser(role, { id: admin.id });
  }

  it.each(["admin", "couple"] as const)("lets %s create a guest with a valid code", async (role) => {
    const guest = await guestModule().createGuest(await managerActor(role), details);

    expect(guest.code).toMatch(/^[A-HJKMNP-Z2-9]{8}$/);
    expect(guest).toMatchObject({ name: "Maria Souza", seats: 3 });
  });

  it("forbids guests from every management operation", async () => {
    const guest = await seedGuest(testDatabase.db);
    const guestActor = asUser("guest", { guestId: guest.id });
    const operations = [
      () => guestModule().createGuest(guestActor, details),
      () => guestModule().updateGuest(guestActor, guest.id, details),
      () => guestModule().deleteGuest(guestActor, guest.id),
      () => guestModule().regenerateGuestCode(guestActor, guest.id),
      () =>
        guestModule().listGuestsPage(guestActor, { page: 1, perPage: 12, offset: 0, search: "", sort: "recent" }),
    ];

    for (const operation of operations) await expect(operation()).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("requires authentication", async () => {
    await expect(guestModule().createGuest(null, details)).rejects.toBeInstanceOf(UnauthenticatedError);
  });

  it("updates guest details without touching the code", async () => {
    const guest = await seedGuest(testDatabase.db);

    const updated = await guestModule().updateGuest(asUser("couple"), guest.id, { name: "Novo Nome", seats: 5 });

    expect(updated).toMatchObject({ name: "Novo Nome", seats: 5, code: guest.code });
  });

  it("fails to update an unknown guest", async () => {
    await expect(
      guestModule().updateGuest(asUser("admin"), crypto.randomUUID(), details),
    ).rejects.toBeInstanceOf(GuestNotFoundError);
  });

  it("regenerates a different code", async () => {
    const guest = await seedGuest(testDatabase.db);

    const updated = await guestModule().regenerateGuestCode(asUser("admin"), guest.id);

    expect(updated.code).not.toBe(guest.code);
  });

  it("deletes a guest with unconfirmed contributions", async () => {
    const guest = await seedGuest(testDatabase.db);
    await seedContribution(testDatabase.db, { guestId: guest.id, status: "reserved" });

    await guestModule().deleteGuest(asUser("admin"), guest.id);

    const remaining = await testDatabase.db.select().from(guests).where(eq(guests.id, guest.id));
    expect(remaining).toHaveLength(0);
  });

  it("blocks deleting a guest with confirmed contributions", async () => {
    const guest = await seedGuest(testDatabase.db);
    await seedContribution(testDatabase.db, { guestId: guest.id, status: "confirmed" });

    await expect(guestModule().deleteGuest(asUser("admin"), guest.id)).rejects.toBeInstanceOf(
      GuestHasConfirmedContributionsError,
    );
    expect(await guestModule().guestRepository.findById(guest.id)).not.toBeNull();
  });

  it("fails to delete an unknown guest", async () => {
    await expect(guestModule().deleteGuest(asUser("admin"), crypto.randomUUID())).rejects.toBeInstanceOf(
      GuestNotFoundError,
    );
  });
});
