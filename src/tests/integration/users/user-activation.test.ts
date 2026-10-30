import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@/modules/auth/errors";
import { CannotDeactivateSelfError, LastAdminError, UserNotFoundError } from "@/modules/users/errors";
import { createUserModule } from "@/modules/users/factory";
import { asUser } from "@/tests/helpers/fake-session";
import { seedAdmin, seedCouple, seedUser } from "@/tests/helpers/seeds/seed-user";
import { useTestDatabase } from "@/tests/helpers/use-test-database";

describe("user activation and listing filters", () => {
  const testDatabase = useTestDatabase();
  const userModule = () => createUserModule(testDatabase.db);

  it("deactivates and reactivates a couple user", async () => {
    const couple = await seedCouple(testDatabase.db);
    const admin = asUser("admin");

    const deactivated = await userModule().setUserActive(admin, couple.id, false);
    const reactivated = await userModule().setUserActive(admin, couple.id, true);

    expect(deactivated.isActive).toBe(false);
    expect(reactivated.isActive).toBe(true);
  });

  it.each(["couple", "guest"] as const)("forbids %s from changing activation", async (role) => {
    const couple = await seedCouple(testDatabase.db);

    await expect(userModule().setUserActive(asUser(role), couple.id, false)).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });

  it("blocks deactivating yourself", async () => {
    const admin = await seedAdmin(testDatabase.db);

    await expect(
      userModule().setUserActive(asUser("admin", { id: admin.id }), admin.id, false),
    ).rejects.toBeInstanceOf(CannotDeactivateSelfError);
  });

  it("blocks deactivating the last active admin", async () => {
    const lastAdmin = await seedAdmin(testDatabase.db);

    await expect(userModule().setUserActive(asUser("admin"), lastAdmin.id, false)).rejects.toBeInstanceOf(
      LastAdminError,
    );
  });

  it("allows deactivating an admin when another active admin exists", async () => {
    const first = await seedAdmin(testDatabase.db);
    await seedAdmin(testDatabase.db);

    const result = await userModule().setUserActive(asUser("admin"), first.id, false);

    expect(result.isActive).toBe(false);
  });

  it("fails for an unknown user", async () => {
    await expect(
      userModule().setUserActive(asUser("admin"), crypto.randomUUID(), false),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it("filters the list by status and search", async () => {
    await seedUser(testDatabase.db, { name: "Agnes", isActive: true });
    await seedUser(testDatabase.db, { name: "Sammy", isActive: false });
    const list = (extra: { search: string; status?: "active" | "inactive" }) =>
      userModule().listUsersPage(asUser("admin"), { page: 1, perPage: 12, offset: 0, ...extra });

    const inactive = await list({ search: "", status: "inactive" });
    const searched = await list({ search: "agn" });

    expect(inactive.items.map((user) => user.name)).toEqual(["Sammy"]);
    expect(searched.items.map((user) => user.name)).toEqual(["Agnes"]);
  });
});
