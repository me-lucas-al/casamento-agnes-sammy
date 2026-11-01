import { describe, expect, it } from "vitest";
import type { SessionUser } from "@/modules/auth/types";
import { createContributionController } from "@/modules/contributions/controllers/handlers/contribution-controller";
import { FakeCacheInvalidator } from "@/tests/helpers/fakes/fake-cache-invalidator";
import { seedGift } from "@/tests/helpers/database/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { createContributionContext, seedGuestActor, seedStaffActor } from "./contribution-context";

describe("guest actions used by staff", () => {
  const testDatabase = useTestDatabase();

  function controllerFor(actor: SessionUser) {
    const context = createContributionContext(testDatabase.db);
    return createContributionController({
      contributions: context.contributions,
      invalidator: new FakeCacheInvalidator(),
      getActor: async () => actor,
    });
  }

  it.each(["couple", "admin"] as const)("rejects a %s reserving a gift with a friendly message", async (role) => {
    const gift = await seedGift(testDatabase.db);
    const controller = controllerFor(await seedStaffActor(testDatabase.db, role));

    const result = await controller.reserveGift({ giftId: gift.id });

    expect(result).toEqual({ ok: false, error: "Você não tem permissão para esta ação." });
  });

  it("rejects staff cancelling a guest reservation through the guest action", async () => {
    const gift = await seedGift(testDatabase.db);
    const guest = await seedGuestActor(testDatabase.db);
    const reserved = await controllerFor(guest).reserveGift({ giftId: gift.id });
    if (!reserved.ok) throw new Error(reserved.error);
    const staffController = controllerFor(await seedStaffActor(testDatabase.db, "couple"));

    const result = await staffController.cancelOwnReservation({ contributionId: reserved.data.contributionId });

    expect(result.ok).toBe(false);
  });
});
