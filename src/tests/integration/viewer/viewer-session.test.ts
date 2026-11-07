import { describe, expect, it } from "vitest";
import { createAuthModule } from "@/modules/auth/factory";
import type { SessionUser } from "@/modules/auth/types";
import { VIEWER_USER_ID } from "@/modules/auth/types";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { viewer } from "./viewer-test-context";

describe("viewer session validation", () => {
  const testDatabase = useTestDatabase();
  const validate = (user: SessionUser) => createAuthModule(testDatabase.db).validateSessionUser(user);

  it("accepts the viewer session without any database record", async () => {
    await expect(validate(viewer)).resolves.toEqual({ id: VIEWER_USER_ID, role: "viewer" });
  });

  it("rejects a viewer token that carries another identity", async () => {
    await expect(validate(asUser("viewer", { id: crypto.randomUUID() }))).resolves.toBeNull();
  });

  it("drops a guest id smuggled into a viewer token", async () => {
    const forged = asUser("viewer", { id: VIEWER_USER_ID, guestId: crypto.randomUUID() });

    await expect(validate(forged)).resolves.toEqual({ id: VIEWER_USER_ID, role: "viewer" });
  });
});
