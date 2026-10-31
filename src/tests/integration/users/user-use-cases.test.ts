import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import { EmailAlreadyRegisteredError } from "@/modules/users/errors";
import { createUserModule } from "@/modules/users/factory";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedUser } from "@/tests/helpers/database/seeds/seed-user";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";

describe("user use-cases", () => {
  const testDatabase = useTestDatabase();
  const userModule = () => createUserModule(testDatabase.db);
  const newUser = { name: "Sammy", email: "Sammy@Example.com", role: "couple" as const };

  it("lets an admin create a user with a normalized email", async () => {
    const user = await userModule().createUser(asUser("admin"), newUser);

    expect(user.email).toBe("sammy@example.com");
    expect(await userModule().userRepository.findById(user.id)).not.toBeNull();
  });

  it("rejects duplicated emails", async () => {
    await userModule().createUser(asUser("admin"), newUser);

    await expect(userModule().createUser(asUser("admin"), newUser)).rejects.toBeInstanceOf(
      EmailAlreadyRegisteredError,
    );
  });

  it.each(["couple", "guest"] as const)("forbids %s from creating users", async (role) => {
    await expect(userModule().createUser(asUser(role), newUser)).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("requires authentication", async () => {
    await expect(userModule().createUser(null, newUser)).rejects.toBeInstanceOf(UnauthenticatedError);
  });

  it("lists users page for admin with pagination metadata", async () => {
    for (let index = 0; index < 13; index += 1) await seedUser(testDatabase.db);

    const pageResult = await userModule().listUsersPage(asUser("admin"), {
      page: 2,
      perPage: 12,
      offset: 12,
      search: "",
    });

    expect(pageResult).toMatchObject({ total: 13, totalPages: 2, hasPreviousPage: true, hasNextPage: false });
    expect(pageResult.items).toHaveLength(1);
  });

  it("ensures the admin exactly once", async () => {
    const first = await userModule().ensureAdminUser({ name: "Lucas", email: "lucas@example.com" });
    const second = await userModule().ensureAdminUser({ name: "Lucas", email: "LUCAS@example.com" });

    expect(second.id).toBe(first.id);
    expect(first.role).toBe("admin");
  });
});
