import { describe, expect, it } from "vitest";
import { GuestCodeGenerationError } from "@/modules/guests/errors";
import { createGuestModule } from "@/modules/guests/factory";
import { asUser } from "@/tests/helpers/fake-session";
import { seedAdmin } from "@/tests/helpers/seeds/seed-user";
import { seedGuest } from "@/tests/helpers/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/use-test-database";

function sequenceGenerator(codes: string[]) {
  let index = 0;
  return () => codes[Math.min(index++, codes.length - 1)];
}

describe("guest code uniqueness", () => {
  const testDatabase = useTestDatabase();
  const details = { name: "Maria", seats: 2 };

  it("retries when the generated code collides", async () => {
    const admin = await seedAdmin(testDatabase.db);
    await seedGuest(testDatabase.db, { code: "AAAAAAAA", createdBy: admin.id });
    const guestModule = createGuestModule(
      testDatabase.db,
      sequenceGenerator(["AAAAAAAA", "AAAAAAAA", "BBBBBBBB"]),
    );

    const guest = await guestModule.createGuest(asUser("admin", { id: admin.id }), details);

    expect(guest.code).toBe("BBBBBBBB");
  });

  it("fails after exhausting attempts", async () => {
    const admin = await seedAdmin(testDatabase.db);
    await seedGuest(testDatabase.db, { code: "AAAAAAAA", createdBy: admin.id });
    const guestModule = createGuestModule(testDatabase.db, () => "AAAAAAAA");

    await expect(
      guestModule.createGuest(asUser("admin", { id: admin.id }), details),
    ).rejects.toBeInstanceOf(GuestCodeGenerationError);
  });

  it("regenerates the code of an existing guest avoiding collisions", async () => {
    const admin = await seedAdmin(testDatabase.db);
    await seedGuest(testDatabase.db, { code: "AAAAAAAA", createdBy: admin.id });
    const target = await seedGuest(testDatabase.db, { code: "CCCCCCCC", createdBy: admin.id });
    const guestModule = createGuestModule(testDatabase.db, sequenceGenerator(["AAAAAAAA", "DDDDDDDD"]));

    const updated = await guestModule.regenerateGuestCode(asUser("couple"), target.id);

    expect(updated.code).toBe("DDDDDDDD");
  });
});
