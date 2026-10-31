import { createContributionModule } from "@/modules/contributions/factory";
import type { Database } from "@/shared/db/types";
import { addHours } from "@/shared/lib/dates/dates";
import { asUser } from "@/tests/helpers/fake-session";
import { seedGuest } from "@/tests/helpers/seeds/seed-guest";
import { seedUser } from "@/tests/helpers/seeds/seed-user";

export const START_TIME = new Date("2026-11-01T12:00:00.000Z");

export function createControlledClock() {
  let current = START_TIME;
  return {
    clock: () => current,
    advanceHours(hours: number) {
      current = addHours(current, hours);
    },
  };
}

export function createContributionContext(database: Database) {
  const controlledClock = createControlledClock();
  return {
    ...controlledClock,
    contributions: createContributionModule(database, controlledClock.clock),
  };
}

export async function seedGuestActor(database: Database, name = "Convidado") {
  const guest = await seedGuest(database, { name });
  return asUser("guest", { id: guest.id, guestId: guest.id });
}

export async function seedStaffActor(database: Database, role: "admin" | "couple" = "couple") {
  const user = await seedUser(database, { role });
  return asUser(role, { id: user.id });
}
