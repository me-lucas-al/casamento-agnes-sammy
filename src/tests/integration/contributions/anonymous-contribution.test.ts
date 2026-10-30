import { describe, expect, it } from "vitest";
import { messages } from "@/shared/db/schema";
import { seedGift } from "@/tests/helpers/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/use-test-database";
import { createContributionContext, seedGuestActor, seedStaffActor } from "./contribution-context";

describe("anonymous contributions", () => {
  const testDatabase = useTestDatabase();

  async function setup() {
    const context = createContributionContext(testDatabase.db);
    const gift = await seedGift(testDatabase.db);
    const guest = await seedGuestActor(testDatabase.db, "Maria");
    return { ...context, gift, guest };
  }

  it("is not anonymous by default", async () => {
    const { contributions, gift, guest } = await setup();

    const contribution = await contributions.reserveGift(guest, { giftId: gift.id });

    expect(contribution.anonymous).toBe(false);
  });

  it("stores the anonymous choice when reserving", async () => {
    const { contributions, gift, guest } = await setup();

    const contribution = await contributions.reserveGift(guest, { giftId: gift.id, anonymous: true });

    expect(contribution.anonymous).toBe(true);
  });

  it("lets the guest change the choice while the reservation is open", async () => {
    const { contributions, gift, guest } = await setup();
    const contribution = await contributions.reserveGift(guest, { giftId: gift.id });

    const updated = await contributions.updateReservation(guest, {
      contributionId: contribution.id,
      anonymous: true,
    });

    expect(updated.anonymous).toBe(true);
  });

  it("keeps the previous choice when the update does not send one", async () => {
    const { contributions, gift, guest } = await setup();
    const contribution = await contributions.reserveGift(guest, { giftId: gift.id, anonymous: true });

    const updated = await contributions.updateReservation(guest, { contributionId: contribution.id });

    expect(updated.anonymous).toBe(true);
  });

  it("hides the guest name in the message created on confirmation", async () => {
    const { contributions, gift, guest } = await setup();
    const contribution = await contributions.reserveGift(guest, { giftId: gift.id, anonymous: true });

    await contributions.confirmPixPayment(await seedStaffActor(testDatabase.db, "couple"), {
      contributionId: contribution.id,
      message: "Felicidades!",
    });

    const [message] = await testDatabase.db.select().from(messages);
    expect(message.authorName).toBe("Anônimo");
  });
});
