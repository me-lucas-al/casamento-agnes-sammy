import { describe, expect, it } from "vitest";
import { buildManagedPublicId } from "@/shared/lib/cloudinary/cloudinary-url";
import { giftSchema } from "../gift.schema";

const baseGift = {
  categoryId: "123e4567-e89b-42d3-a456-426614174000",
  kind: "item",
  name: "Panelas",
  priceCents: 1000,
  mode: "single",
  isVisible: true,
};

function parseWithImage(publicId: string) {
  const url = `https://res.cloudinary.com/demo/image/upload/v1/${publicId}.jpg`;
  return giftSchema.safeParse({ ...baseGift, image: { url, publicId } });
}

describe("giftSchema image", () => {
  it("accepts server generated gift public ids", () => {
    expect(parseWithImage(buildManagedPublicId("gifts")).success).toBe(true);
  });

  it.each(["gifts/abc", buildManagedPublicId("gallery"), "gifts/x/../y", ""])("rejects %s", (publicId) => {
    expect(parseWithImage(publicId).success).toBe(false);
  });
});
