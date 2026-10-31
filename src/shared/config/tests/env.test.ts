import { describe, expect, it } from "vitest";
import {
  parseAppEnv,
  parseAuthEnv,
  parseCloudinaryEnv,
  parseCronEnv,
  parseDatabaseEnv,
} from "../env";

const authVars = {
  AUTH_SECRET: "a-secret-with-16+chars",
  AUTH_GOOGLE_ID: "id",
  AUTH_GOOGLE_SECRET: "secret",
};
const cloudinaryVars = {
  CLOUDINARY_CLOUD_NAME: "cloud",
  CLOUDINARY_API_KEY: "key",
  CLOUDINARY_API_SECRET: "secret",
  CLOUDINARY_UPLOAD_PRESET: "wedding_8mb",
};
const validEnv = {
  ...authVars,
  ...cloudinaryVars,
  DATABASE_URL: "postgresql://localhost/db",
  CRON_SECRET: "cron-secret-with-at-least-32-characters",
  APP_URL: "http://localhost:3000",
};

describe("auth env", () => {
  it("does not need Cloudinary, cron or app variables", () => {
    expect(parseAuthEnv(authVars).AUTH_SECRET).toBe(authVars.AUTH_SECRET);
  });

  it("names the missing auth variable", () => {
    expect(() => parseAuthEnv({ ...authVars, AUTH_GOOGLE_ID: undefined })).toThrow(/AUTH_GOOGLE_ID/);
  });

  it("rejects a short auth secret", () => {
    expect(() => parseAuthEnv({ ...authVars, AUTH_SECRET: "short" })).toThrow(/AUTH_SECRET/);
  });
});

describe("database env", () => {
  it("only needs DATABASE_URL", () => {
    expect(parseDatabaseEnv({ DATABASE_URL: "postgresql://x" }).DATABASE_URL).toBe("postgresql://x");
  });

  it("fails on its own variable only", () => {
    expect(() => parseDatabaseEnv({ ...validEnv, DATABASE_URL: undefined })).toThrow(/^Invalid environment variables: DATABASE_URL$/);
  });
});

describe("cloudinary env", () => {
  it("accepts only its variables", () => {
    expect(parseCloudinaryEnv(cloudinaryVars).CLOUDINARY_API_KEY).toBe("key");
  });

  it("requires the upload preset that enforces the image size limit", () => {
    expect(() => parseCloudinaryEnv({ ...validEnv, CLOUDINARY_UPLOAD_PRESET: undefined })).toThrow(
      /CLOUDINARY_UPLOAD_PRESET/,
    );
  });

  it("is not affected by missing auth variables", () => {
    expect(() => parseAuthEnv({ ...cloudinaryVars })).toThrow(/AUTH_SECRET/);
    expect(parseCloudinaryEnv(cloudinaryVars)).toEqual(cloudinaryVars);
  });
});

describe("cron env", () => {
  it("rejects a cron secret shorter than 32 characters", () => {
    expect(() => parseCronEnv({ CRON_SECRET: "short" })).toThrow(/CRON_SECRET/);
  });

  it("accepts a long cron secret", () => {
    expect(parseCronEnv(validEnv).CRON_SECRET).toBe(validEnv.CRON_SECRET);
  });
});

describe("app env", () => {
  it("requires a valid APP_URL", () => {
    expect(() => parseAppEnv({ APP_URL: "nope" })).toThrow(/APP_URL/);
    expect(parseAppEnv(validEnv).APP_URL).toBe(validEnv.APP_URL);
  });
});
