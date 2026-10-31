import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import { TourUserNotFoundError } from "@/modules/tour/errors";
import { createTourModule } from "@/modules/tour/factory";
import { asUser } from "@/tests/helpers/fakes/fake-session";
import { seedAdmin, seedCouple } from "@/tests/helpers/database/seeds/seed-user";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";

describe("tour use-cases", () => {
  const testDatabase = useTestDatabase();
  const fixedNow = new Date("2026-10-30T12:00:00.000Z");
  const tourModule = () => createTourModule({ database: testDatabase.db, now: () => fixedNow });

  it("reports a fresh couple user as not completed", async () => {
    const couple = await seedCouple(testDatabase.db);

    const status = await tourModule().getTourStatus(asUser("couple", { id: couple.id }));

    expect(status).toEqual({ isCompleted: false, completedAt: null });
  });

  it.each(["admin", "couple"] as const)("persists completion for %s", async (role) => {
    const user = role === "admin" ? await seedAdmin(testDatabase.db) : await seedCouple(testDatabase.db);
    const actor = asUser(role, { id: user.id });

    await tourModule().completeTour(actor);
    const status = await tourModule().getTourStatus(actor);

    expect(status.isCompleted).toBe(true);
    expect(status.completedAt).toEqual(fixedNow);
  });

  it("resets completion when restarting", async () => {
    const couple = await seedCouple(testDatabase.db);
    const actor = asUser("couple", { id: couple.id });
    await tourModule().completeTour(actor);

    await tourModule().restartTour(actor);

    expect((await tourModule().getTourStatus(actor)).isCompleted).toBe(false);
  });

  it("only touches the actor own record", async () => {
    const agnes = await seedCouple(testDatabase.db);
    const sammy = await seedCouple(testDatabase.db);
    const agnesActor = asUser("couple", { id: agnes.id });
    const sammyActor = asUser("couple", { id: sammy.id });

    await tourModule().completeTour(agnesActor);
    expect((await tourModule().getTourStatus(sammyActor)).isCompleted).toBe(false);

    await tourModule().completeTour(sammyActor);
    await tourModule().restartTour(agnesActor);
    expect((await tourModule().getTourStatus(sammyActor)).isCompleted).toBe(true);
    expect((await tourModule().getTourStatus(agnesActor)).isCompleted).toBe(false);
  });

  it("forbids guests from every operation", async () => {
    const guest = asUser("guest");

    await expect(tourModule().getTourStatus(guest)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(tourModule().completeTour(guest)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(tourModule().restartTour(guest)).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("requires authentication", async () => {
    await expect(tourModule().completeTour(null)).rejects.toBeInstanceOf(UnauthenticatedError);
  });

  it("fails when the session user no longer exists", async () => {
    const ghost = asUser("couple");

    await expect(tourModule().getTourStatus(ghost)).rejects.toBeInstanceOf(TourUserNotFoundError);
    await expect(tourModule().completeTour(ghost)).rejects.toBeInstanceOf(TourUserNotFoundError);
    await expect(tourModule().restartTour(ghost)).rejects.toBeInstanceOf(TourUserNotFoundError);
  });
});
