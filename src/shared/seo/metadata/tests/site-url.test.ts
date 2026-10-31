import { describe, expect, it } from "vitest";
import { FakeLogger } from "@/tests/helpers/fakes/fake-logger";
import { resolveSiteUrl } from "../site-url";

describe("resolveSiteUrl logging", () => {
  it("logs an invalid app url before falling back", () => {
    const logger = new FakeLogger();

    expect(resolveSiteUrl("not a url", logger).href).toBe("http://localhost:3000/");
    expect(logger.errors()[0]).toMatchObject({ event: "seo.invalid_app_url" });
  });

  it("does not log for a missing or valid url", () => {
    const logger = new FakeLogger();

    resolveSiteUrl(undefined, logger);
    resolveSiteUrl("https://site.test", logger);

    expect(logger.entries).toEqual([]);
  });
});
