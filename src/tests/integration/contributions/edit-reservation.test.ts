import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import type { SessionUser } from "@/modules/auth/types";
import { createContributionController } from "@/modules/contributions/controllers/handlers/contribution-controller";
import { MAX_ACTIVE_RESERVATIONS_PER_GUEST } from "@/modules/contributions/lib/reservation/reservation-window";
import { giftContributions as contributionsTable } from "@/shared/db/schema";
import { FakeCacheInvalidator } from "@/tests/helpers/fakes/fake-cache-invalidator";
import { seedGift } from "@/tests/helpers/database/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { createContributionContext, seedGuestActor } from "./contribution-context";

describe("editing a reservation through the controller", () => {
  const testDatabase = useTestDatabase();

  async function setup() {
    const context = createContributionContext(testDatabase.db);
    const gift = await seedGift(testDatabase.db, { mode: "fixed_quotas", totalQuotas: 4, priceCents: 40000 });
    const guest = await seedGuestActor(testDatabase.db);
    let actor: SessionUser = guest;
    const controller = createContributionController({
      contributions: context.contributions,
      invalidator: new FakeCacheInvalidator(),
      getActor: async () => actor,
    });
    const reserved = await controller.reserveGift({ giftId: gift.id, quotas: 2 });
    if (!reserved.ok) throw new Error(reserved.error);
    const countRows = async () => (await testDatabase.db.select().from(contributionsTable)).length;
    const findRow = async () => {
      const [row] = await testDatabase.db
        .select()
        .from(contributionsTable)
        .where(eq(contributionsTable.id, reserved.data.contributionId));
      return row;
    };
    return {
      ...context,
      controller,
      gift,
      guest,
      countRows,
      findRow,
      contributionId: reserved.data.contributionId,
      actAs: (next: SessionUser) => (actor = next),
    };
  }

  it("increases the quotas in place without creating a row", async () => {
    const { controller, contributionId, countRows, findRow } = await setup();

    const result = await controller.updateReservation({ contributionId, quotas: 4 });

    expect(result).toEqual({ ok: true, data: { contributionId } });
    expect(await countRows()).toBe(1);
    expect(await findRow()).toMatchObject({ quotas: 4, amountCents: 40000 });
  });

  it("decreases the quotas in place without creating a row", async () => {
    const { controller, contributionId, countRows, findRow } = await setup();

    await controller.updateReservation({ contributionId, quotas: 1 });

    expect(await countRows()).toBe(1);
    expect(await findRow()).toMatchObject({ quotas: 1, amountCents: 10000 });
  });

  it("rejects quotas above the total and keeps the reservation untouched", async () => {
    const { controller, contributionId, findRow } = await setup();

    const result = await controller.updateReservation({ contributionId, quotas: 5 });

    expect(result.ok).toBe(false);
    expect(await findRow()).toMatchObject({ quotas: 2 });
  });

  it("rejects editing a reservation that belongs to another guest", async () => {
    const { controller, contributionId, actAs, findRow } = await setup();
    actAs(await seedGuestActor(testDatabase.db, "Outro"));

    const result = await controller.updateReservation({ contributionId, quotas: 3 });

    expect(result.ok).toBe(false);
    expect(await findRow()).toMatchObject({ quotas: 2 });
  });

  it("keeps the active reservation cap intact while editing at the limit", async () => {
    const { controller, contributionId, contributions, guest, countRows } = await setup();
    for (let index = 1; index < MAX_ACTIVE_RESERVATIONS_PER_GUEST; index += 1) {
      const gift = await seedGift(testDatabase.db);
      await contributions.reserveGift(guest, { giftId: gift.id });
    }
    const rowsAtLimit = await countRows();

    const edit = await controller.updateReservation({ contributionId, quotas: 3 });
    const extraGift = await seedGift(testDatabase.db);
    const extra = await controller.reserveGift({ giftId: extraGift.id });

    expect(edit.ok).toBe(true);
    expect(extra.ok).toBe(false);
    expect(await countRows()).toBe(rowsAtLimit);
  });
});
