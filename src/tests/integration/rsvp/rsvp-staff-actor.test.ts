import { describe, expect, it } from "vitest";
import { createRsvpModule } from "@/modules/rsvp/factory";
import { requireGuestId } from "@/modules/rsvp/lib/require-guest-id";
import { ForbiddenError } from "@/modules/auth/errors";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedGuest } from "@/tests/helpers/database/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";

describe("rsvp staff actors", () => {
  const testDatabase = useTestDatabase();

  it("refuses to resolve a own-guest id for staff", () => {
    expect(() => requireGuestId(asUser("couple"))).toThrow(ForbiddenError);
  });

  it("lets staff read and edit a guest rsvp on their behalf", async () => {
    const guest = await seedGuest(testDatabase.db, { seats: 2 });
    const rsvpModule = createRsvpModule(testDatabase.db);
    const couple = asUser("couple");

    await rsvpModule.submitRsvp(couple, { guestId: guest.id, status: "going", dietaryNote: null, companions: [] });

    expect((await rsvpModule.getGuestRsvp(couple, guest.id)).status).toBe("going");
  });
});
