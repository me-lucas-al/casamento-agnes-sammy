import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import { RsvpAlreadyAnsweredError, RsvpGuestNotFoundError } from "@/modules/rsvp/errors";
import { createRsvpModule } from "@/modules/rsvp/factory";
import { asUser } from "@/tests/helpers/fake-session";
import { seedGuest } from "@/tests/helpers/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/use-test-database";

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

  it("forbids a guest from changing an answer already sent", async () => {
    const { guest, session } = await answeredGuest();

    await expect(
      rsvpModule().submitRsvp(session, { guestId: guest.id, status: "declined", dietaryNote: null, companions: [] }),
    ).rejects.toBeInstanceOf(RsvpAlreadyAnsweredError);
    expect((await rsvpModule().getGuestRsvp(session, guest.id)).status).toBe("going");
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
