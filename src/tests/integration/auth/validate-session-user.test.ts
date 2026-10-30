import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createAuthModule } from "@/modules/auth/factory";
import { guests, users } from "@/shared/db/schema";
import { asUser } from "@/tests/helpers/fake-session";
import { seedAdmin, seedCouple } from "@/tests/helpers/seeds/seed-user";
import { seedGuest } from "@/tests/helpers/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/use-test-database";

describe("validateSessionUser", () => {
  const testDatabase = useTestDatabase();
  const authModule = () => createAuthModule(testDatabase.db);

  it("keeps an active staff session", async () => {
    const admin = await seedAdmin(testDatabase.db);
    const session = asUser("admin", { id: admin.id });

    expect(await authModule().validateSessionUser(session)).toEqual(session);
  });

  it("rejects a deactivated staff user", async () => {
    const couple = await seedCouple(testDatabase.db);
    await testDatabase.db.update(users).set({ isActive: false }).where(eq(users.id, couple.id));

    expect(await authModule().validateSessionUser(asUser("couple", { id: couple.id }))).toBeNull();
  });

  it("rejects a staff session whose role changed", async () => {
    const couple = await seedCouple(testDatabase.db);

    expect(await authModule().validateSessionUser(asUser("admin", { id: couple.id }))).toBeNull();
  });

  it("rejects a staff session for a deleted user", async () => {
    expect(await authModule().validateSessionUser(asUser("admin"))).toBeNull();
  });

  it("keeps a guest session after the code is regenerated", async () => {
    const guest = await seedGuest(testDatabase.db, { code: "K7M2QX9P" });
    await testDatabase.db.update(guests).set({ code: "NEWCODE2" }).where(eq(guests.id, guest.id));
    const session = asUser("guest", { id: guest.id, guestId: guest.id });

    expect(await authModule().validateSessionUser(session)).toEqual(session);
  });

  it("rejects a guest session for a deleted guest", async () => {
    const guest = await seedGuest(testDatabase.db);
    await testDatabase.db.delete(guests).where(eq(guests.id, guest.id));

    expect(await authModule().validateSessionUser(asUser("guest", { guestId: guest.id }))).toBeNull();
  });
});
