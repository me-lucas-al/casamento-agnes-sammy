import { describe, expect, it } from "vitest";
import { createRsvpModule } from "@/modules/rsvp/factory";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedGuest } from "@/tests/helpers/database/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";

describe("rsvp panel", () => {
  const testDatabase = useTestDatabase();
  const rsvpModule = () => createRsvpModule(testDatabase.db);
  const couple = asUser("couple");
  const pageInput = { page: 1, perPage: 12, offset: 0, status: undefined, search: "" };

  async function answer(name: string, seats: number, status: "going" | "declined", companions = 0) {
    const guest = await seedGuest(testDatabase.db, { name, seats });
    await rsvpModule().submitRsvp(couple, {
      guestId: guest.id,
      status,
      dietaryNote: null,
      companions: Array.from({ length: companions }, (_, index) => ({
        name: `${name} companion ${index}`,
        dietaryNote: null,
      })),
    });
    return guest;
  }

  it("totals going, declined, pending and attending people", async () => {
    await answer("Alice", 3, "going", 2);
    await answer("Bruno", 2, "going", 1);
    await answer("Caio", 2, "declined");
    await seedGuest(testDatabase.db, { name: "Dani" });
    await seedGuest(testDatabase.db, { name: "Edu" });

    expect(await rsvpModule().getRsvpTotals(couple)).toEqual({
      going: 2,
      declined: 1,
      pending: 2,
      attendingPeople: 5,
    });
  });

  it("filters the list by status including guests without an answer", async () => {
    await answer("Alice", 1, "going");
    await answer("Caio", 1, "declined");
    await seedGuest(testDatabase.db, { name: "Dani" });

    const pending = await rsvpModule().listRsvpsPage(couple, { ...pageInput, status: "pending" });
    const going = await rsvpModule().listRsvpsPage(couple, { ...pageInput, status: "going" });

    expect(pending.items.map(({ guestName }) => guestName)).toEqual(["Dani"]);
    expect(going.items.map(({ guestName }) => guestName)).toEqual(["Alice"]);
    expect((await rsvpModule().listRsvpsPage(couple, pageInput)).total).toBe(3);
  });

  it("searches by guest name and reports companions count", async () => {
    await answer("Alice Souza", 3, "going", 2);
    await answer("Bruno Lima", 1, "going");

    const result = await rsvpModule().listRsvpsPage(couple, { ...pageInput, search: "souza" });

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({ guestName: "Alice Souza", companionsCount: 2, status: "going" });
  });

  it("paginates the list", async () => {
    for (let index = 0; index < 13; index += 1) {
      await seedGuest(testDatabase.db, { name: `Guest ${String(index).padStart(2, "0")}` });
    }

    const secondPage = await rsvpModule().listRsvpsPage(couple, { ...pageInput, page: 2, offset: 12 });

    expect(secondPage).toMatchObject({ total: 13, totalPages: 2, hasPreviousPage: true, hasNextPage: false });
    expect(secondPage.items).toHaveLength(1);
  });
});
