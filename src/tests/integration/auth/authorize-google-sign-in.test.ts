import { describe, expect, it } from "vitest";
import { createAuthModule } from "@/modules/auth/factory";
import { seedAdmin, seedCouple, seedUser } from "@/tests/helpers/seeds/seed-user";
import { useTestDatabase } from "@/tests/helpers/use-test-database";

describe("authorizeGoogleSignIn allowlist", () => {
  const testDatabase = useTestDatabase();
  const authModule = () => createAuthModule(testDatabase.db);

  it("allows active users and returns their role", async () => {
    const admin = await seedAdmin(testDatabase.db, { email: "lucas@example.com" });
    const couple = await seedCouple(testDatabase.db, { email: "agnes@example.com" });

    expect(await authModule().authorizeGoogleSignIn("Lucas@Example.com")).toEqual({ id: admin.id, role: "admin" });
    expect(await authModule().authorizeGoogleSignIn("agnes@example.com")).toEqual({ id: couple.id, role: "couple" });
  });

  it("denies unknown emails", async () => {
    expect(await authModule().authorizeGoogleSignIn("stranger@example.com")).toBeNull();
  });

  it("denies inactive users", async () => {
    await seedUser(testDatabase.db, { email: "gone@example.com", isActive: false });

    expect(await authModule().authorizeGoogleSignIn("gone@example.com")).toBeNull();
  });

  it("denies missing emails", async () => {
    expect(await authModule().authorizeGoogleSignIn(null)).toBeNull();
  });
});
