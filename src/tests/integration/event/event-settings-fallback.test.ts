import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_EVENT_SETTINGS } from "@/modules/event/lib/default-event-settings";

vi.mock("next/cache", () => ({
  unstable_cache: <Result>(load: () => Promise<Result>) => load,
}));

const ENVIRONMENT = {
  DATABASE_URL: "postgresql://user:password@10.255.255.1:5432/database",
  AUTH_SECRET: "a-secret-with-16+chars",
  AUTH_GOOGLE_ID: "id",
  AUTH_GOOGLE_SECRET: "secret",
  CLOUDINARY_CLOUD_NAME: "cloud",
  CLOUDINARY_API_KEY: "key",
  CLOUDINARY_API_SECRET: "secret",
  CLOUDINARY_UPLOAD_PRESET: "preset",
  CRON_SECRET: "cron-secret-with-at-least-32-characters",
  APP_URL: "http://localhost:3000",
};

describe("event settings fallback", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns defaults within seconds and logs when the database is unreachable", async () => {
    for (const [name, value] of Object.entries(ENVIRONMENT)) vi.stubEnv(name, value);
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { getEventSettingsQuery } = await import("@/modules/event/controllers/event.queries");
    const startedAt = Date.now();

    const snapshot = await getEventSettingsQuery();

    expect(Date.now() - startedAt).toBeLessThan(6000);
    expect(snapshot.coupleNames).toBe(DEFAULT_EVENT_SETTINGS.coupleNames);
    expect(errorLog).toHaveBeenCalled();
  }, 10000);
});
