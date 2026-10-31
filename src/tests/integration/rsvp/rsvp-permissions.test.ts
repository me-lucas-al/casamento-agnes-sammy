import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import { RsvpDeadlinePassedError, RsvpGuestNotFoundError } from "@/modules/rsvp/errors";
import { createRsvpModule } from "@/modules/rsvp/factory";
import { eventSettings } from "@/shared/db/schema";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedGuest } from "@/tests/helpers/database/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";

describe("rsvp edit and delete permissions", () => {
  const testDatabase = useTestDatabase();
  const rsvpModule = () => createRsvpModule(testDatabase.db);

  async function answeredGuest() {
    const guest = await seedGuest(testDatabase.db, { seats: 2 });
    const session = asUser("guest", { guestId: guest.id });
    await rsvpModule().submitRsvp(session, {
      guestId: guest.id,
      status: "going",
      dietaryNote: null,
      companions: [{ name: "Ana", dietaryNote: null }],
    });
    return { guest, session };
  }

  it("lets a guest edit own answer before the deadline and blocks it after", async () => {
    const { guest, session } = await answeredGuest();
    const decline = { guestId: guest.id, status: "declined" as const, dietaryNote: null, companions: [] };

    await rsvpModule().submitRsvp(session, decline);
    expect((await rsvpModule().getGuestRsvp(session, guest.id)).status).toBe("declined");

    await testDatabase.db.insert(eventSettings).values({
      coupleNames: "Agnes & Sammy",
      eventAt: new Date("2026-11-07T22:00:00Z"),
      venueName: "Restaurante Fazenda",
      address: "Itatiba/SP",
      rsvpDeadline: new Date("2020-01-01T00:00:00Z"),
    });
    await expect(rsvpModule().submitRsvp(session, { ...decline, status: "going" })).rejects.toBeInstanceOf(
      RsvpDeadlinePassedError,
    );
  });

  it("lets couple and admin delete an answer, resetting it to pending", async () => {
    const { guest, session } = await answeredGuest();

    await rsvpModule().deleteRsvp(asUser("couple"), guest.id);

    const reset = await rsvpModule().getGuestRsvp(session, guest.id);
    expect(reset).toMatchObject({ status: "pending", respondedAt: null, companions: [] });
    await rsvpModule().deleteRsvp(asUser("admin"), guest.id);
  });

  it("forbids guests from deleting and rejects unknown guests", async () => {
    const { guest, session } = await answeredGuest();

    await expect(rsvpModule().deleteRsvp(session, guest.id)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(rsvpModule().deleteRsvp(null, guest.id)).rejects.toBeInstanceOf(UnauthenticatedError);
    await expect(
      rsvpModule().deleteRsvp(asUser("admin"), "00000000-0000-4000-8000-000000000000"),
    ).rejects.toBeInstanceOf(RsvpGuestNotFoundError);
  });
});
