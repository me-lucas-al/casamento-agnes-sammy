import { describe, expect, it } from "vitest";
import { FakeCloudinaryClient } from "@/tests/helpers/fake-cloudinary";
import { FakeLogger } from "@/tests/helpers/fake-logger";
import { destroyImageBestEffort } from "./cloudinary-destroy";

describe("destroyImageBestEffort", () => {
  it("logs a failed destroy and does not throw", async () => {
    const client = new FakeCloudinaryClient();
    client.destroyImage = async () => {
      throw new Error("cloudinary down");
    };
    const logger = new FakeLogger();

    await expect(destroyImageBestEffort(client, "public-id", logger)).resolves.toBeUndefined();

    expect(logger.errors()[0]).toMatchObject({ event: "cloudinary.destroy_failed", context: { publicId: "public-id" } });
  });

  it("stays silent when the destroy works", async () => {
    const logger = new FakeLogger();

    await destroyImageBestEffort(new FakeCloudinaryClient(), "public-id", logger);

    expect(logger.entries).toEqual([]);
  });
});
