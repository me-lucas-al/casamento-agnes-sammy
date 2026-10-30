import { describe, expect, it } from "vitest";
import { createGuestModule } from "@/modules/guests/factory";
import type { GuestSort } from "@/modules/guests/types";
import { rsvps } from "@/shared/db/schema";
import { parsePageParams } from "@/shared/lib/pagination";
import { textParam } from "@/shared/lib/url-params";
import { asUser } from "@/tests/helpers/fake-session";
import { seedGuest } from "@/tests/helpers/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/use-test-database";

describe("guest listing", () => {
  const testDatabase = useTestDatabase();
  const guestModule = () => createGuestModule(testDatabase.db);
  const list = (params: Record<string, string>, sort: GuestSort = "recent") => {
    const pageParams = parsePageParams(params);
    return guestModule().listGuestsPage(asUser("couple"), {
      ...pageParams,
      search: textParam(params, "search"),
      sort,
    });
  };

  it("paginates in the backend with metadata", async () => {
    for (let index = 0; index < 13; index += 1) await seedGuest(testDatabase.db, { name: `Guest ${index}` });

    const secondPage = await list({ page: "2" });

    expect(secondPage).toMatchObject({ total: 13, totalPages: 2, hasPreviousPage: true, hasNextPage: false });
    expect(secondPage.items).toHaveLength(1);
  });

  it("falls back to defaults for invalid page params", async () => {
    await seedGuest(testDatabase.db);

    const result = await list({ page: "-3", perPage: "7" });

    expect(result).toMatchObject({ page: 1, perPage: 12 });
  });

  it("searches by name, code and phone", async () => {
    await seedGuest(testDatabase.db, { name: "Ana Lima", code: "ZZZZ2222", phone: "11999990000" });
    await seedGuest(testDatabase.db, { name: "Bruno Reis", code: "YYYY3333" });

    expect((await list({ search: "ana" })).items.map((guest) => guest.name)).toEqual(["Ana Lima"]);
    expect((await list({ search: "yyyy" })).items.map((guest) => guest.name)).toEqual(["Bruno Reis"]);
    expect((await list({ search: "99999" })).items.map((guest) => guest.name)).toEqual(["Ana Lima"]);
  });

  it("treats percent and underscore in search as literal characters", async () => {
    await seedGuest(testDatabase.db, { name: "Ana 100%" });
    await seedGuest(testDatabase.db, { name: "Bruno Reis" });

    expect((await list({ search: "%" })).items.map((guest) => guest.name)).toEqual(["Ana 100%"]);
    expect((await list({ search: "_" })).items).toHaveLength(0);
  });

  it("sorts by name and by last access with nulls last", async () => {
    await seedGuest(testDatabase.db, { name: "Carla" });
    await seedGuest(testDatabase.db, { name: "Beto", lastAccessAt: new Date("2026-01-01") });
    await seedGuest(testDatabase.db, { name: "Abel", lastAccessAt: new Date("2026-02-01") });

    const byName = await list({}, "name");
    const byAccess = await list({}, "access");

    expect(byName.items.map((guest) => guest.name)).toEqual(["Abel", "Beto", "Carla"]);
    expect(byAccess.items.map((guest) => guest.name)).toEqual(["Abel", "Beto", "Carla"]);
  });

  it("reports rsvp status, defaulting to pending", async () => {
    const going = await seedGuest(testDatabase.db, { name: "Going" });
    await seedGuest(testDatabase.db, { name: "Silent" });
    await testDatabase.db.insert(rsvps).values({ guestId: going.id, status: "going" });

    const result = await list({}, "name");

    expect(result.items.map((guest) => [guest.name, guest.rsvpStatus])).toEqual([
      ["Going", "going"],
      ["Silent", "pending"],
    ]);
  });
});
