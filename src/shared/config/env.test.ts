import { describe, expect, it } from "vitest";
import { parseServerEnv } from "./env";

const validEnv = {
  DATABASE_URL: "postgresql://localhost/db",
  AUTH_SECRET: "a-secret-with-16+chars",
  AUTH_GOOGLE_ID: "id",
  AUTH_GOOGLE_SECRET: "secret",
  CLOUDINARY_CLOUD_NAME: "cloud",
  CLOUDINARY_API_KEY: "key",
  CLOUDINARY_API_SECRET: "secret",
  CRON_SECRET: "cron-secret-with-at-least-32-characters",
  APP_URL: "http://localhost:3000",
};

describe("parseServerEnv", () => {
  it("accepts a complete environment", () => {
    expect(parseServerEnv(validEnv).DATABASE_URL).toBe(validEnv.DATABASE_URL);
  });

  it("rejects a cron secret shorter than 32 characters", () => {
    expect(() => parseServerEnv({ ...validEnv, CRON_SECRET: "short" })).toThrow(/CRON_SECRET/);
  });

  it("names the missing variables", () => {
    expect(() => parseServerEnv({ ...validEnv, DATABASE_URL: undefined })).toThrow(/DATABASE_URL/);
  });
});
