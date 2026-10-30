import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import {
  CompanionLimitExceededError,
  RsvpDeadlinePassedError,
} from "@/modules/rsvp/errors";
import { createRsvpModule } from "@/modules/rsvp/factory";
import { eventSettings } from "@/shared/db/schema";
import { asUser } from "@/tests/helpers/fake-session";
import { seedGuest } from "@/tests/helpers/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/use-test-database";

const NOW = new Date("2026-10-30T12:00:00Z");
const PAST_DEADLINE = new Date("2026-10-25T00:00:00Z");
const FUTURE_DEADLINE = new Date("2026-11-05T00:00:00Z");

describe("rsvp use-cases", () => {
  const testDatabase = useTestDatabase();
  const rsvpModule = () => createRsvpModule(testDatabase.db, { now: () => NOW });

  async function seedDeadline(rsvpDeadline: Date | null) {
    await testDatabase.db.insert(eventSettings).values({
      coupleNames: "Agnes & Sammy",
      eventAt: new Date("2026-11-07T22:00:00Z"),
      venueName: "Restaurante Fazenda",
      address: "Itatiba/SP",
      rsvpDeadline,
    });
  }

  async function seedGuestSession(seats: number) {
    const guest = await seedGuest(testDatabase.db, { seats });
    return { guest, session: asUser("guest", { guestId: guest.id }) };
  }

  const going = (guestId: string, companionNames: string[] = []) => ({
    guestId,
    status: "going" as const,
    dietaryNote: null,
    companions: companionNames.map((name) => ({ name, dietaryNote: null })),
  });

  it("starts pending and records a going answer with companions", async () => {
    await seedDeadline(FUTURE_DEADLINE);
    const { guest, session } = await seedGuestSession(3);
    expect((await rsvpModule().getGuestRsvp(session, guest.id)).status).toBe("pending");

    await rsvpModule().submitRsvp(session, { ...going(guest.id, ["Ana", "Bia"]), dietaryNote: "sem glúten" });

    const saved = await rsvpModule().getGuestRsvp(session, guest.id);
    expect(saved).toMatchObject({ status: "going", dietaryNote: "sem glúten", respondedAt: NOW });
    expect(saved.companions.map(({ name }) => name)).toEqual(["Ana", "Bia"]);
  });

  it("replaces companions on edit and clears them when declining", async () => {
    await seedDeadline(FUTURE_DEADLINE);
    const { guest, session } = await seedGuestSession(3);
    await rsvpModule().submitRsvp(session, going(guest.id, ["Ana", "Bia"]));
    await rsvpModule().submitRsvp(asUser("couple"), going(guest.id, ["Carla"]));
    expect((await rsvpModule().getGuestRsvp(session, guest.id)).companions).toHaveLength(1);

    await rsvpModule().submitRsvp(asUser("couple"), { ...going(guest.id, ["Carla"]), status: "declined" });

    const saved = await rsvpModule().getGuestRsvp(session, guest.id);
    expect(saved.status).toBe("declined");
    expect(saved.companions).toEqual([]);
  });

  it("rejects companions beyond seats minus one", async () => {
    await seedDeadline(FUTURE_DEADLINE);
    const { guest, session } = await seedGuestSession(2);

    await expect(rsvpModule().submitRsvp(session, going(guest.id, ["Ana", "Bia"]))).rejects.toBeInstanceOf(
      CompanionLimitExceededError,
    );
    expect((await rsvpModule().getGuestRsvp(session, guest.id)).status).toBe("pending");
  });

  it("blocks guests after the deadline but lets couple and admin edit on behalf", async () => {
    await seedDeadline(PAST_DEADLINE);
    const { guest, session } = await seedGuestSession(2);

    await expect(rsvpModule().submitRsvp(session, going(guest.id))).rejects.toBeInstanceOf(
      RsvpDeadlinePassedError,
    );
    await rsvpModule().submitRsvp(asUser("couple"), going(guest.id, ["Ana"]));
    await rsvpModule().submitRsvp(asUser("admin"), { ...going(guest.id), status: "declined" });
    expect((await rsvpModule().getGuestRsvp(session, guest.id)).status).toBe("declined");
  });

  it("allows answers when no deadline is configured", async () => {
    await seedDeadline(null);
    const { guest, session } = await seedGuestSession(1);

    await rsvpModule().submitRsvp(session, going(guest.id));

    expect((await rsvpModule().getGuestRsvp(session, guest.id)).status).toBe("going");
  });

  it("forbids a guest from answering or reading for another guest", async () => {
    await seedDeadline(FUTURE_DEADLINE);
    const { session } = await seedGuestSession(1);
    const other = await seedGuest(testDatabase.db);

    await expect(rsvpModule().submitRsvp(session, going(other.id))).rejects.toBeInstanceOf(ForbiddenError);
    await expect(rsvpModule().getGuestRsvp(session, other.id)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(rsvpModule().submitRsvp(null, going(other.id))).rejects.toBeInstanceOf(
      UnauthenticatedError,
    );
  });

  it("restricts totals and listing to couple and admin", async () => {
    const { session } = await seedGuestSession(1);
    const listInput = { page: 1, perPage: 12, offset: 0, status: undefined, search: "" };

    await expect(rsvpModule().getRsvpTotals(session)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(rsvpModule().listRsvpsPage(session, listInput)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(rsvpModule().getRsvpTotals(asUser("couple"))).resolves.toBeDefined();
  });
});
