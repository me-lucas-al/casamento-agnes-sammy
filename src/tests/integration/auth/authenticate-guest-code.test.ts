import { describe, expect, it } from "vitest";
import { InvalidGuestCodeError, TooManyLoginAttemptsError } from "@/modules/auth/errors";
import { createAuthModule } from "@/modules/auth/factory";
import { MAX_FAILED_ATTEMPTS } from "@/modules/auth/use-cases/authenticate-guest-code";
import { addMinutes } from "@/shared/lib/dates/dates";
import { seedGuest } from "@/tests/helpers/database/seeds/seed-guest";
import { useTestDatabase } from "@/tests/helpers/database/use-test-database";

describe("authenticateGuestCode", () => {
  const testDatabase = useTestDatabase();
  const ipHash = "hashed-ip";

  async function failAttempts(authModule: ReturnType<typeof createAuthModule>, times: number) {
    for (let attempt = 0; attempt < times; attempt += 1) {
      await authModule.authenticateGuestCode({ code: "WRONGCODE", ipHash }).catch(() => undefined);
    }
  }

  it("authenticates a guest by code ignoring case and spaces", async () => {
    const guest = await seedGuest(testDatabase.db, { code: "K7M2QX9P" });
    const authModule = createAuthModule(testDatabase.db);

    const session = await authModule.authenticateGuestCode({ code: " k7m2qx9p ", ipHash });

    expect(session).toMatchObject({ id: guest.id, guestId: guest.id, role: "guest", name: guest.name });
  });

  it("normalizes separators and symbols on the server side", async () => {
    const guest = await seedGuest(testDatabase.db, { code: "K7M2QX9P" });
    const authModule = createAuthModule(testDatabase.db);

    const session = await authModule.authenticateGuestCode({ code: "k7m2-qx9p!", ipHash });

    expect(session.guestId).toBe(guest.id);
  });

  it("rejects unknown codes with a generic error", async () => {
    const authModule = createAuthModule(testDatabase.db);

    await expect(authModule.authenticateGuestCode({ code: "NOPE", ipHash })).rejects.toBeInstanceOf(
      InvalidGuestCodeError,
    );
  });

  it("blocks the ip after too many failed attempts, even with a valid code", async () => {
    await seedGuest(testDatabase.db, { code: "K7M2QX9P" });
    const authModule = createAuthModule(testDatabase.db);
    await failAttempts(authModule, MAX_FAILED_ATTEMPTS);

    await expect(authModule.authenticateGuestCode({ code: "K7M2QX9P", ipHash })).rejects.toBeInstanceOf(
      TooManyLoginAttemptsError,
    );
  });

  it("does not block other ips", async () => {
    await seedGuest(testDatabase.db, { code: "K7M2QX9P" });
    const authModule = createAuthModule(testDatabase.db);
    await failAttempts(authModule, MAX_FAILED_ATTEMPTS);

    const session = await authModule.authenticateGuestCode({ code: "K7M2QX9P", ipHash: "other-ip" });

    expect(session.role).toBe("guest");
  });

  it("forgets failed attempts after the window", async () => {
    await seedGuest(testDatabase.db, { code: "K7M2QX9P" });
    await failAttempts(createAuthModule(testDatabase.db), MAX_FAILED_ATTEMPTS);
    const later = createAuthModule(testDatabase.db, { now: () => addMinutes(new Date(), 16) });

    const session = await later.authenticateGuestCode({ code: "K7M2QX9P", ipHash });

    expect(session.role).toBe("guest");
  });

  it("records last access", async () => {
    const guest = await seedGuest(testDatabase.db, { code: "K7M2QX9P" });
    const authModule = createAuthModule(testDatabase.db);

    await authModule.authenticateGuestCode({ code: "K7M2QX9P", ipHash });

    const [updated] = await testDatabase.db.query.guests.findMany({ where: (table, { eq }) => eq(table.id, guest.id) });
    expect(updated.lastAccessAt).toBeInstanceOf(Date);
  });
});
