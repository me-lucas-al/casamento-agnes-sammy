import { describe, expect, it } from "vitest";
import { PixNotConfiguredForReservationError, describeContributionError } from "@/modules/contributions/errors";
import { createContributionModule } from "@/modules/contributions/factory";
import { eventSettings } from "@/shared/db/schema";
import { seedGift } from "@/tests/helpers/database/seeds/seed-gift";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";
import { START_TIME, seedGuestActor } from "./contribution-context";

const baseEvent = {
  coupleNames: "Agnes & Sammy",
  eventAt: new Date("2027-05-01T20:00:00.000Z"),
  venueName: "Salão",
  address: "Rua Principal, 1",
};

describe("reserveGift Pix requirement", () => {
  const testDatabase = useTestDatabase();
  const realModule = () => createContributionModule(testDatabase.db, () => START_TIME);

  async function attemptReservation() {
    const gift = await seedGift(testDatabase.db);
    const guest = await seedGuestActor(testDatabase.db);
    return realModule().reserveGift(guest, { giftId: gift.id });
  }

  it("refuses when there is no event settings row", async () => {
    await expect(attemptReservation()).rejects.toBeInstanceOf(PixNotConfiguredForReservationError);
  });

  it("refuses when the Pix settings are partial", async () => {
    await testDatabase.db.insert(eventSettings).values({ ...baseEvent, pixKey: "a@b.com", pixKeyType: "email" });

    await expect(attemptReservation()).rejects.toBeInstanceOf(PixNotConfiguredForReservationError);
  });

  it("reserves when the Pix settings are complete", async () => {
    await testDatabase.db.insert(eventSettings).values({
      ...baseEvent,
      pixKey: "a@b.com",
      pixKeyType: "email",
      pixReceiverName: "Agnes",
      pixCity: "Recife",
    });

    await expect(attemptReservation()).resolves.toMatchObject({ status: "reserved" });
  });

  it("explains the problem to the guest in Portuguese", () => {
    expect(describeContributionError(new PixNotConfiguredForReservationError())).toBe(
      "Os noivos ainda estão configurando o Pix. Volte em breve.",
    );
  });
});
