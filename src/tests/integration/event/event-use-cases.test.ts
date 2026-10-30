import { describe, expect, it } from "vitest";
import { ForbiddenError, UnauthenticatedError } from "@/modules/auth/errors";
import { runUpdateEventSettings } from "@/modules/event/controllers/run-update-event-settings";
import { InvalidPixKeyError } from "@/modules/event/errors";
import { createEventModule } from "@/modules/event/factory";
import { DEFAULT_EVENT_SETTINGS } from "@/modules/event/lib/default-event-settings";
import { asUser } from "@/tests/helpers/fake-session";
import { FakeCacheInvalidator } from "@/tests/helpers/fake-cache-invalidator";
import { useTestDatabase } from "@/tests/helpers/use-test-database";

describe("event use-cases", () => {
  const testDatabase = useTestDatabase();
  const eventModule = () => createEventModule(testDatabase.db);
  const settings = {
    ...DEFAULT_EVENT_SETTINGS,
    pixKey: "529.982.247-25",
    pixKeyType: "cpf" as const,
    pixReceiverName: "Agnes Souza",
    pixCity: "Itatiba",
  };
  const formInput = {
    coupleNames: "Agnes & Sammy",
    eventAt: "2026-11-07T19:00",
    venueName: "Restaurante Fazenda",
    address: "Av. Mal. Castelo Branco, 760",
    mapUrl: "",
    story: "",
    rsvpDeadline: "2026-11-01T23:59",
    pixKey: "agnes@example.com",
    pixKeyType: "email",
    pixReceiverName: "Agnes Souza",
    pixCity: "Itatiba",
  };

  it("returns defaults when nothing was saved", async () => {
    expect(await eventModule().getEventSettings()).toEqual(DEFAULT_EVENT_SETTINGS);
  });

  it.each(["admin", "couple"] as const)("lets %s update and normalizes the pix key", async (role) => {
    await eventModule().updateEventSettings(asUser(role), settings);

    const stored = await eventModule().getEventSettings();
    expect(stored.pixKey).toBe("52998224725");
    expect(stored.pixReceiverName).toBe("Agnes Souza");
  });

  it("updates the single row on later saves", async () => {
    await eventModule().updateEventSettings(asUser("admin"), settings);
    await eventModule().updateEventSettings(asUser("admin"), { ...settings, venueName: "Outro Lugar" });

    expect((await eventModule().getEventSettings()).venueName).toBe("Outro Lugar");
  });

  it("forbids guests and anonymous users", async () => {
    await expect(eventModule().updateEventSettings(asUser("guest"), settings)).rejects.toBeInstanceOf(
      ForbiddenError,
    );
    await expect(eventModule().updateEventSettings(null, settings)).rejects.toBeInstanceOf(
      UnauthenticatedError,
    );
  });

  it("rejects a pix key that does not match its type", async () => {
    await expect(
      eventModule().updateEventSettings(asUser("admin"), { ...settings, pixKey: "abc" }),
    ).rejects.toBeInstanceOf(InvalidPixKeyError);
  });

  it("clears pix when key and type are both empty", async () => {
    const saved = await eventModule().updateEventSettings(asUser("admin"), {
      ...settings,
      pixKey: null,
      pixKeyType: null,
    });

    expect(saved.pixKey).toBeNull();
  });

  describe("controller", () => {
    it("invalidates the event tag on success", async () => {
      const cacheInvalidator = new FakeCacheInvalidator();

      const result = await runUpdateEventSettings(
        { eventModule: eventModule(), cacheInvalidator },
        asUser("couple"),
        formInput,
      );

      expect(result.ok).toBe(true);
      expect(cacheInvalidator.invalidatedTags).toEqual(["event"]);
      expect((await eventModule().getEventSettings()).eventAt.toISOString()).toBe("2026-11-07T22:00:00.000Z");
    });

    it("does not invalidate when forbidden, invalid or pix mismatch", async () => {
      const cacheInvalidator = new FakeCacheInvalidator();
      const dependencies = { eventModule: eventModule(), cacheInvalidator };

      const forbidden = await runUpdateEventSettings(dependencies, asUser("guest"), formInput);
      const invalid = await runUpdateEventSettings(dependencies, asUser("admin"), { ...formInput, eventAt: "x" });
      const mismatch = await runUpdateEventSettings(dependencies, asUser("admin"), {
        ...formInput,
        pixKeyType: "cpf",
      });

      expect([forbidden.ok, invalid.ok, mismatch.ok]).toEqual([false, false, false]);
      expect(cacheInvalidator.invalidatedTags).toEqual([]);
    });
  });
});
