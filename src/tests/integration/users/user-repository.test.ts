import { describe, expect, it } from "vitest";
import { createDrizzleUserRepository } from "@/modules/users/repositories/drizzle/drizzle-user-repository";
import { seedAdmin, seedUser } from "@/tests/helpers/seeds/seed-user";
import { useTestDatabase } from "@/tests/helpers/use-test-database";

describe("drizzle user repository", () => {
  const testDatabase = useTestDatabase();
  const repository = () => createDrizzleUserRepository(testDatabase.db);

  it("creates and finds a user by id and email", async () => {
    const created = await repository().create({ name: "Agnes", email: "agnes@example.com", role: "couple" });

    expect((await repository().findById(created.id))?.email).toBe("agnes@example.com");
    expect((await repository().findByEmail("agnes@example.com"))?.id).toBe(created.id);
    expect(created.isActive).toBe(true);
  });

  it("returns null for unknown users", async () => {
    expect(await repository().findByEmail("nobody@example.com")).toBeNull();
  });

  it("hides inactive users from the active lookup", async () => {
    const inactive = await seedUser(testDatabase.db, { isActive: false });
    const active = await seedAdmin(testDatabase.db);

    expect(await repository().findActiveByEmail(inactive.email)).toBeNull();
    expect((await repository().findActiveByEmail(active.email))?.id).toBe(active.id);
  });

  it("paginates with total count and filters by search", async () => {
    for (let index = 1; index <= 5; index += 1) {
      await seedUser(testDatabase.db, { name: `Pessoa ${index}`, email: `pessoa${index}@example.com` });
    }
    await seedUser(testDatabase.db, { name: "Outro", email: "outro@example.com" });

    const firstPage = await repository().listPage({ limit: 2, offset: 0, search: "" });
    const lastPage = await repository().listPage({ limit: 4, offset: 4, search: "" });
    const filtered = await repository().listPage({ limit: 10, offset: 0, search: "pessoa" });

    expect(firstPage.items).toHaveLength(2);
    expect(firstPage.total).toBe(6);
    expect(lastPage.items).toHaveLength(2);
    expect(filtered.total).toBe(5);
  });
});
